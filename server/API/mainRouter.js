import express from "express";
import {
  generateGPTAnswer,
  sqlResponse,
  finalResponse,
} from "../OpenAI/openAI.js";
import { promptForSQL, promptForAnswer } from "../OpenAI/prompts.js";
import { executeSQL } from "../Database/mysql.js";
import { loggerMain, loggerMySQL, loggerOpenAI } from "../Utils/logger.js";
import { JWTverificator } from "../Utils/middleware.js";

export const mainRouter = express.Router();

mainRouter.post("/language-to-sql", JWTverificator, async (req, res) => {
  loggerMain.info("📩 Received a new POST request.");

  const userQuery = req.body?.query;
  // console.log(promptForSQL(userQuery));

  if (!userQuery) {
    res.status(400).json({ status: "error", errorCode: "NO_QUERY_ERR" });

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
        errorCode: "PROCESSING_ERR",
      });

      return;
    }

    if (!sqlAnswer.isSelect) {
      res.status(400).json({
        status: "error",
        errorCode: "UNSUPPORTED_QUERY_ERR",
      });

      return;
    }

    // Execute the generated SQL query
    const rows = await executeSQL(sqlAnswer.sqlStatement);
    if (!rows) {
      res.status(500).json({
        status: "error",
        errorCode: "DATABASE_ERR",
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
        errorCode: "PROCESSING_ERR",
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
      errorCode: "PROCESSING_ERR",
    });
  }
});
