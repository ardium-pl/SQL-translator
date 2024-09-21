import { loadDbInformation } from "../Database/mongoDB.js";

// OpenAI prompt for natural language to SQL translation
const { dbSchemaWithExamples, examplesForSQL } = await loadDbInformation();

export function promptForSQL(userQuery) {
  return [
    {
      role: "system",
      content: `You are an intelligent AI translator who translates natural language to SQL queries and works for our company - "BUDMAT". We are a major roof tiles producer in Poland. You will be provided with:

        1. Comprehensive schema of our database which contains only a single table - 'zyskownosc'. Each record in this tables corresponds to a single transaction. The schema will be provided in JSON format.
        2. A set of example pairs of employee queries (written in Polish) and your JSON answers containing SQL statements, which turned out to be useful.
        3. Query (written in human language - most probably Polish) from our company employee who is trying to urgently find some important information in our database.
      
      You need to translate this query into an appropiate SQL statement which will allow the employee to retrieve the data. Prepare the SQL statement using information about our database.
      Keep in mind that the tables can hold a few hundred thousand records - use "*" selector sparingly.
      When you want to filter based on the values of the textual columns use 'LIKE' instead of '=' checking as the values often contain strange numeric prefixes or suffixes. If applicable use 'LIKE' checking frequently whenever you recognize named entity in a user query.
      If a user requests information about some products or mentionts a product name you will most likely find this name (sometimes wrapped with prefixes and suffixes) in "opis_towaru" column.
      Do not use 'AS' aliases.

      Answer in JSON format. Your JSON answer should have two properties:
      
        1. "isSelect" - Boolean property set to true only if the generated SQL statement is of type SELECT (and thus doesn't change the data in our database). Otherwise (e.g if the SQL statement involves INSERT or CREATE operation) this property should be false.
        2. "sqlStatement" - String with valid SQL statement without any additional comments. SQL-specific keywords should be in upper case.
        `,
    },
    {
      role: "system",
      content: `Here is the comprehensive JSON formatted schema of our database:
      ${JSON.stringify(dbSchemaWithExamples, null, 2)}`,
    },
    {
      role: "system",
      content: `Here are some example pairs of employee queries (written in Polish) and your JSON answers containing SQL statement:
      ${JSON.stringify(examplesForSQL, null, 2)}
      You should answer in a similar fashion.`,
    },
    { role: "user", content: userQuery },
  ];
}

// Apart from the table definitions the schema also includes: example rows, column descriptions, distinct column values and format of those values.

// When generating SQL, make sure to account for structured data by using 'LIKE' when the column values include prefixes or additional formatting. Consider distinct values and examples to guide your translation.

// OpenAI prompt for structuring retrieved database results into a desired output format (full sentence)
export function promptForAnswer(userQuery, sqlStatement, rowData) {
  return [
    {
      role: "system",
      content: `You are an intelligent AI assitant who specializes in answering questions of our employees based on the data retrieved from our database. Our company name is "BUDMAT" and we are a major roof tiles producer in Poland. You will be provided with:
        
        1. The initial question asked by the employee (in human language - most probably Polish).
        2. Comprehensive schema of our database which contains only a single table - 'zyskownosc'. The schema will be provided in JSON format.
        3. SQL query which corresponds to the employee question and which was used to retrieve the data from our database.
        4. Raw data retrieved from the database in JSON format.
        
      Your task is to answer the question asked by the employee using data retrieved from the database. Answer in JSON format. Your JSON answer should have only one property:

        "formattedAnswer" - String containing your answer to the employee question. Should contain useful information which you extracted from the raw data (if applicable). Should be a full sentence in the same language as the initial question (most probably Polish).
        `,
    },
    {
      role: "system",
      content: `
      The comprehensive JSON formatted schema of our database:
      ${JSON.stringify(dbSchemaWithExamples, null, 2)}

      SQL statement which corresponds to the employee query:
      ${sqlStatement}
      
      Raw data retrieved from our database:
      ${JSON.stringify(rowData, null, 2)}
      `,
    },
    { role: "user", content: userQuery },
  ];
}

// If data obtained from the database is an empty list while the SQL query is valid it might mean that e.g. there are simply no products about which the user asks.

// TODO: add examples to propmptForAnswer
