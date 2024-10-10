import express from "express";
import cors from "cors";
import {
  generateGPTAnswer,
  sqlResponse,
  finalResponse,
} from "./OpenAI/openai.js";
import { promptForSQL, promptForAnswer } from "./OpenAI/prompts.js";
import { executeSQL, fetchPassword } from "./Database/mysql.js";
import { loggerMain, loggerMySQL, loggerOpenAI } from "./Utils/logger.js";
import { JWTverificator } from "./Utils/middleware.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();

app.use(express.json());
app.use(cookieParser());
//  Access-Control-Allow-Credentials: true & Access-Control-Allow-Origin: XXX headers need to be configured in order for a browser to send cookies to the server in cross-origin context
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

// Login route to handle password verification and token generation
app.post("/login", async (req, res) => {
  loggerMain.info("↘️ Received a new login attempt.");

  const userPassword = req.body?.password;
  loggerMain.info(`🔑 Password received in request body: ${userPassword}`);

  // Short-circuit if there is no user provided password
  if (!userPassword) {
    loggerMain.warn(
      `❌ No password provided. Responding with 401 Unauthorized.`
    );
    res.status(401).json({ status: "error", message: "No password provided" });
    return;
  }

  const password = await fetchPassword();
  // Short-circuit if the server failed to fetch the password
  if (!password) {
    res.status(500).json({ status: "error", message: "Internal server error" });
    return;
  }

  if (userPassword === password) {
    loggerMain.info(`✅ Password correct.`);

    // Generate a JWT token valid for 1 hour
    // Default headers: { "alg": "HS256", "typ": "JWT" } Claims on payload: { "iat": xxx, "exp": xxx }
    const JWTtoken = jwt.sign({}, JWT_SECRET, { expiresIn: "1h" });
    loggerMain.info(`Generated JWT token: ${JWTtoken}`);

    // Send the JWT token as a HttpOnly, Secure, SameSite cookie
    res.cookie("auth_token", JWTtoken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });
    res
      .status(200)
      .json({ status: "success", message: "Logged in successfully." });
  } else {
    loggerMain.warn(`❌ Invalid password. Responding with 401 Unauthorized.`);
    res.status(401).json({ status: "error", message: "Invalid password" });
  }
});

app.post("/logout", async (req, res) => {
  loggerMain.info("↖️ Received a new logout request.");

  // Clear the JWT token cookie (sets the Expiration Date of the cookie to a date in the past)
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully." });
  loggerMain.info(`Auth cookie cleared.`);
});

app.get("/test", JWTverificator, async (req, res) => {
  loggerMain.info("📩 [/test] Received a new GET request.");
  res
    .status(200)
    .json({ status: "success", message: "Welcome, you passed the test!" });
});

app.post("/language-to-sql", JWTverificator, async (req, res) => {
  loggerMain.info("📩 Received a new POST request.");

  const userQuery = req.body?.query;
  // console.log(promptForSQL(userQuery));

  if (!userQuery) {
    res.status(400).json({ status: "error", message: "No query provided." });

    return;
  }

  try {
    // Call OpenAI to translate natural language to SQL
    const sqlAnswer = await generateGPTAnswer(
      promptForSQL(userQuery),
      sqlResponse,
      "sql_response"
    );
    loggerMySQL.info(`🤖 Generated SQL: ${sqlAnswer.sqlStatement}`);

    if (!sqlAnswer) {
      loggerOpenAI.error("Failed to create the SQL query.");
      res.status(500).json({
        status: "error",
        message: "An error occured while processing the request.",
      });

      return;
    }

    if (!sqlAnswer.isSelect) {
      res.status(200).json({
        status: "error",
        message:
          "It seems that you want to perform a query other than SELECT, which I cannot execute.",
        sqlStatement: sqlAnswer.sqlStatement,
      });

      return;
    }

    // Execute the generated SQL query
    const rows = await executeSQL(sqlAnswer.sqlStatement);
    if (!rows) {
      res.status(500).json({
        status: "error",
        message: "Database error. Failed to execute the SQL query.",
        sqlStatement: sqlAnswer.sqlStatement,
      });

      return;
    }

    // Call OpenAI to format the result
    const formattedAnswer = await generateGPTAnswer(
      promptForAnswer(userQuery, sqlAnswer.sqlStatement, rows),
      finalResponse,
      "final_response"
    );
    if (!formattedAnswer) {
      loggerOpenAI.error("Failed to generate the formatted answer.");
      res.status(500).json({
        status: "error",
        message: "An error occured while processing the request.",
      });

      return;
    }

    // Send back the response
    res.status(200).json({
      status: "success",
      question: userQuery,
      sqlStatement: sqlAnswer.sqlStatement,
      formattedAnswer: formattedAnswer.formattedAnswer,
      rawData: rows,
    });
    loggerMain.info("✅ Successfully processed the request!");
  } catch (error) {
    loggerMain.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occured while processing the request.",
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  loggerMain.info(`Server is running on port ${PORT}`);
});
