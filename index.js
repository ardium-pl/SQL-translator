import express from "express";
import axios from "axios";
import { generateGPTAnswer } from "./OpenAI/openai.js";
import { promptForSQL, promptForAnswer } from "./OpenAI/prompts.js";
import { executeSQL } from "./Database/mysql.js";
import { loggerMain, loggerMySQL, loggerOpenAI } from "./Utils/logger.js";

// WORK ON THIS FILE IS IN PROGRESS
// WORK ON THIS FILE IS IN PROGRESS
// WORK ON THIS FILE IS IN PROGRESS

const app = express();
app.use(express.json());

app.post("/language-to-sql", async (req, res) => {
  loggerMain.info("📩 Received new POST request.");

  const userQuery = req.body?.query;
  if (!userQuery) {
    res.status(400).json({ message: "No query provided." });

    return null;
  }

  try {
    // Call OpenAI to translate natural language to SQL
    const sqlAnswer = await generateGPTAnswer(promptForSQL(userQuery));
    if (!sqlAnswer) {
      loggerOpenAI.error("Failed to create the SQL query.");
      res.status(500).json({
        message: "An error occured while processing the request.",
      });

      return null;
    }

    loggerOpenAI.info(
      `Generated answer: ${JSON.stringify(sqlAnswer, null, 2)}`
    );
    loggerMain.info(
      `isSelect: ${
        sqlAnswer.isSelect
      }, isSelect type: ${typeof sqlAnswer.isSelect}`
    );

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
    if (rows.length < 1) {
      res.status(200).json({
        message: "No rows found.",
        sqlStatement: sqlAnswer.sqlStatement,
      });

      return null;
    }
    if (!rows) {
      res.status(500).json({
        message: "Database error. Failed to execute the SQL query.",
        sqlStatement: sqlAnswer.sqlStatement,
      });

      return null;
    }

    // Prepare prompt for structuring the response data
    // const responsePrompt = [
    //   {
    //     role: "system",
    //     content:
    //       "You are a data formatter. Format the following SQL result into a well-structured JSON format.",
    //   },
    //   {
    //     role: "system",
    //     content: `The result should be a JSON object with the following format:\n{\n  "query": string,  // The original user query\n  "data": array,   // Data retrieved from the database\n  "answer": string  // Paraphrased answer to the user question based on the data\n}`,
    //   },
    //   {
    //     role: "user",
    //     content: `User query: ${userQuery}\nData: ${JSON.stringify(result)}`,
    //   },
    // ];

    // Call OpenAI to format the result
    // const formattedResponse = await generateGPTAnswer(responsePrompt);
    // res.json(JSON.parse(formattedResponse));

    res.status(200).json({
      sqlStatement: sqlAnswer.sqlStatement,
      rawData: rows,
      formattedAnswer: "TBC",
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

// console.log(promptForSQL("123"))