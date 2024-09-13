import express from "express";
import axios from "axios";
import { generateGPTAnswer } from "./OpenAI/openai.js";
import { promptForSQL, promptForAnswer } from "./OpenAI/prompts.js";
import { executeSQL } from "./Database/mysql.js";

// WORK ON THIS FILE IS IN PROGRESS
// WORK ON THIS FILE IS IN PROGRESS
// WORK ON THIS FILE IS IN PROGRESS

const app = express();
app.use(express.json());

// Route to handle language-to-SQL
app.post("/language-to-sql", async (req, res) => {
  const userQuery = req.body.query;

  try {
    // Call OpenAI to translate natural language to SQL
    const sqlQuery = await generateGPTAnswer(promptForSQL(userQuery));
    console.log("Generated SQL:", sqlQuery);

    // Execute the generated SQL query on MySQL
    const result = await executeSQL(sqlQuery);
    console.log("Database result:", result);

    // Prepare prompt for structuring the response data
    const responsePrompt = [
      {
        role: "system",
        content:
          "You are a data formatter. Format the following SQL result into a well-structured JSON format.",
      },
      {
        role: "system",
        content: `The result should be a JSON object with the following format:\n{\n  "query": string,  // The original user query\n  "data": array,   // Data retrieved from the database\n  "answer": string  // Paraphrased answer to the user question based on the data\n}`,
      },
      {
        role: "user",
        content: `User query: ${userQuery}\nData: ${JSON.stringify(result)}`,
      },
    ];

    // Call OpenAI to format the result
    const formattedResponse = await generateGPTAnswer(responsePrompt);
    res.json(JSON.parse(formattedResponse));
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
