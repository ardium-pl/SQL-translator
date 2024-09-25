import express from "express";
import cors from "cors";
import {
  generateGPTAnswer,
  sqlResponse,
  finalResponse,
} from "./OpenAI/openai.js";
import { promptForSQL, promptForAnswer } from "./OpenAI/prompts.js";
import { executeSQL } from "./Database/mysql.js";
import { loggerMain, loggerMySQL, loggerOpenAI } from "./Utils/logger.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
// Authorization middleware
app.use((req, res, next) => {
  loggerMain.info("📩 Received a new POST request.");

  const apiKey = process.env.API_KEY;
  const userApiKey = req.headers["x-api-key"];

  if (userApiKey !== apiKey) {
    loggerMain.warn(
      `🔒 Unauthorized request. Responding with: [403 Forbidden]\n`
    );
    res.status(403).json({ message: "Forbidden: Invalid API Key" });
  } else {
    next();
  }
});

app.post("/language-to-sql", async (req, res) => {
  const userQuery = req.body?.query;
  // console.log(promptForSQL(userQuery));

  if (!userQuery) {
    res.status(400).json({ message: "No query provided." });

    return null;
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
        message: "An error occured while processing the request.",
      });

      return null;
    }
    // if (!sqlAnswer.isTranslatable) {
    //   res.status(200).json({
    //     message: "😓 Unfortunately, I am unable to translate this query.",
    //   });

    //   return null;
    // }
    if (!sqlAnswer.isSelect) {
      res.status(200).json({
        message:
          "It seems that you want to perform a query other than SELECT, which I cannot execute.",
        sqlStatement: sqlAnswer.sqlStatement,
      });

      return null;
    }

    // Execute the generated SQL query
    const rows = await executeSQL(sqlAnswer.sqlStatement);
    if (!rows) {
      res.status(500).json({
        message: "Database error. Failed to execute the SQL query.",
        sqlStatement: sqlAnswer.sqlStatement,
      });

      return null;
    }
    // if (rows.length < 1) {
    //   res.status(200).json({
    //     message: "No rows found.",
    //     sqlStatement: sqlAnswer.sqlStatement,
    //   });

    //   return null;
    // }

    // Call OpenAI to format the result
    const formattedAnswer = await generateGPTAnswer(
      promptForAnswer(userQuery, sqlAnswer.sqlStatement, rows),
      finalResponse,
      "final_response"
    );
    if (!formattedAnswer) {
      loggerOpenAI.error("Failed to generate the formatted answer.");
      res.status(500).json({
        message: "An error occured while processing the request.",
      });

      return null;
    }

    // const message = formattedAnswer.isRelevant
    //   ? formattedAnswer.formattedAnswer
    //   : "😓 Unfortunately, based on the information in our database I am unable to answer the question.";

    // Send back the response
    res.status(200).json({
      question: userQuery,
      sqlStatement: sqlAnswer.sqlStatement,
      formattedAnswer: formattedAnswer.formattedAnswer,
      rawData: rows,
    });
    loggerMain.info("✅ Successfully processed the request!\n");
  } catch (error) {
    loggerMain.error(error);
    res.status(500).json({
      message: "An error occured while processing the request.\n",
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  loggerMain.info(`Server is running on port ${PORT}`);
});
