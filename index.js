import express from "express";
import {
  generateGPTAnswer,
  sqlResponse,
  finalResponse,
} from "./OpenAI/openai.js";
import { promptForSQL, promptForAnswer } from "./OpenAI/prompts.js";
import { executeSQL } from "./Database/mysql.js";
import { loggerMain, loggerMySQL, loggerOpenAI } from "./Utils/logger.js";

const app = express();
app.use(express.json());

app.post("/language-to-sql", async (req, res) => {
  loggerMain.info("📩 Received a new POST request.");

  const userQuery = req.body?.query;
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
    if (!sqlAnswer) {
      loggerOpenAI.error("Failed to create the SQL query.");
      res.status(500).json({
        message: "An error occured while processing the request.",
      });

      return null;
    }
    if (!sqlAnswer.isTranslatable) {
      res.status(200).json({
        message: "😓 Unfortunately, I am unable to translate this query.",
      });

      return null;
    }
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
    if (rows.length < 1) {
      res.status(200).json({
        message: "No rows found.",
        sqlStatement: sqlAnswer.sqlStatement,
      });

      return null;
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
        message: "An error occured while processing the request.",
      });

      return null;
    }

    const message = formattedAnswer.isRelevant
      ? formattedAnswer.formattedAnswer
      : "😓 Unfortunately, based on the information in our database I am unable to answer the question.";

    // Send back the response
    res.status(200).json({
      sqlStatement: sqlAnswer.sqlStatement,
      rawData: rows,
      formattedAnswer: message,
    });
    loggerMain.info("✅ Successfully processed the request!");
  } catch (error) {
    loggerMain.error(error);
    res.status(500).json({
      message: "An error occured while processing the request.",
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  loggerMain.info(`Server is running on port ${PORT}`);
});

// console.log(
//   promptForSQL("Iloma pacjentami dziennie zajmuje sie jedna pielegniarka?")
// );

// console.log(
//   promptForAnswer(
//     "Iloma pacjentami dziennie zajmuje sie jedna pielegniarka?",
//     "SELECT AVG(minuty_pielegniarka) AS avg_patients_per_nurse FROM stan_kolejki;",
//     [
//       {
//         avg_patients_per_nurse: "16.6800",
//       },
//     ]
//   )
// );
