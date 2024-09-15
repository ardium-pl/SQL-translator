import { dbSchema, dbSchemaWithExamples } from "../Database/dbSchema.js";

// OpenAI prompt for natural language to SQL translation
let examplesForSQL = [
  {
    userQuery: "How many doctors are available?",
    aiAnswer: {
      isTranslatable: true,
      isSelect: true,
      sqlStatement:
        "SELECT ilosc_lekarzy FROM stan_zasobow ORDER BY ostatnia_aktualizacja DESC LIMIT 1;",
    },
  },
  {
    userQuery: "What is the waiting time for a nurse?",
    aiAnswer: {
      isTranslatable: true,
      isSelect: true,
      sqlStatement:
        "SELECT minuty_pielegniarka FROM stan_kolejki ORDER BY data DESC LIMIT 1;",
    },
  },
  {
    userQuery: "How many patients of type 1 have been admitted?",
    aiAnswer: {
      isTranslatable: true,
      isSelect: true,
      sqlStatement: "SELECT COUNT(*) FROM pacjenci WHERE typ = 1;",
    },
  },
  {
    userQuery: "Add a new patient with type 2 and admission date as now.",
    aiAnswer: {
      isTranslatable: true,
      isSelect: false,
      sqlStatement:
        "INSERT INTO pacjenci (typ, data_przyjecia) VALUES (2, CURRENT_TIMESTAMP);",
    },
  },
  {
    userQuery:
      "What is the average waiting time for doctors for each patient type?",
    aiAnswer: {
      isTranslatable: true,
      isSelect: true,
      sqlStatement:
        "SELECT typy_pacjenta.nazwa, AVG(stan_kolejki.minuty_lekarz) AS avg_wait_time FROM stan_kolejki JOIN pacjenci ON pacjenci.typ = typy_pacjenta.id GROUP BY typy_pacjenta.nazwa;",
    },
  },
  {
    userQuery:
      "List all patient types with the total time spent by doctors for each type.",
    aiAnswer: {
      isTranslatable: true,
      isSelect: true,
      sqlStatement:
        "SELECT typy_pacjenta.nazwa, SUM(typy_pacjenta.czas_lekarza) AS total_time FROM typy_pacjenta JOIN pacjenci ON pacjenci.typ = typy_pacjenta.id GROUP BY typy_pacjenta.nazwa;",
    },
  },
  {
    userQuery:
      "Show the number of beds and nurses available in the latest resource update.",
    aiAnswer: {
      isTranslatable: true,
      isSelect: true,
      sqlStatement:
        "SELECT ilosc_lozek, ilosc_pielegniarek FROM stan_zasobow ORDER BY ostatnia_aktualizacja DESC LIMIT 1;",
    },
  },
  {
    userQuery: "Get the patient type that had the longest nurse time spent.",
    aiAnswer: {
      isTranslatable: true,
      isSelect: true,
      sqlStatement:
        "SELECT typy_pacjenta.nazwa FROM typy_pacjenta ORDER BY czas_pielegniarki DESC LIMIT 1;",
    },
  },
  {
    userQuery: "Update the number of available doctors to 5.",
    aiAnswer: {
      isTranslatable: true,
      isSelect: false,
      sqlStatement:
        "UPDATE stan_zasobow SET ilosc_lekarzy = 5 WHERE ostatnia_aktualizacja = (SELECT MAX(ostatnia_aktualizacja) FROM stan_zasobow);",
    },
  },
  {
    userQuery: "Delete all patients who were admitted before 2023.",
    aiAnswer: {
      isTranslatable: true,
      isSelect: false,
      sqlStatement: "DELETE FROM pacjenci WHERE data_przyjecia < '2023-01-01';",
    },
  },
  {
    userQuery:
      "List the patient types with their respective total time for beds and bed observation time.",
    aiAnswer: {
      isTranslatable: true,
      isSelect: true,
      sqlStatement:
        "SELECT typy_pacjenta.nazwa, SUM(typy_pacjenta.czas_lozka) AS total_bed_time, SUM(typy_pacjenta.czas_lozka_obserwacji) AS total_observation_time FROM typy_pacjenta GROUP BY typy_pacjenta.nazwa;",
    },
  },
];

// examplesForSQL = examplesForSQL
//   .map(
//     (e) =>
//       `Employee query:\n${e.userQuery}\n\nYour answer:\n${JSON.stringify(
//         e.aiAnswer,
//         null,
//         2
//       )}`
//   )
//   .join("\n\n");

export function promptForSQL(userQuery) {
  return [
    {
      role: "system",
      content: `You are an intelligent AI translator which translates natural language to SQL queries. You will be provided with:

        1. Comprehensive schema of our database which contains information about all the tables in this database. Each table description contains information about all columns in that table and the relation of these columns to other tables. The schema will be provided in JSON format. Apart from the table defitions the schema also includes example rows randomly selected from the tables. You can find the example rows for each table under its "exampleRows" property on the provided JSON.
        2. Query (written in human language) from our company employee who is trying to urgently find some important information in our database.
      
      You need to translate this query into an appropiate SQL statement which will allow the employee to retrieve the data. Prepare the SQL statement using information about out database. Answer in JSON format. Your JSON answer should have three properties:
      
        1. "isTranslatable" - Boolean property which by default should be set to true. Set this property to false only if you are unable to translate the user query into SQL (e.g. when the user input doesn't relate to our database and the information it stores). Set this property to false only if necessary.
        2. "isSelect" - Boolean property set to true only if the generated SQL statement is of type SELECT (and thus doesn't change the data in our database). Otherwise (e.g if the SQL statement involves INSERT or CREATE operation) this property should be false. If "isTranslatable" is set to false return false.
        3. "sqlStatement" - String with valid SQL statement without any additional comments. SQL-specific keywords should be in upper case. If "isTranslatable" is set to false return empty string.
        `,
    },
    {
      role: "system",
      content: `Here is the comprehensive JSON formatted schema of our database:
      ${JSON.stringify(dbSchemaWithExamples, null, 2)}`,
    },
    {
      role: "system",
      content: `Here are some example pairs of employee queries and your JSON answers containing SQL statement:
      ${JSON.stringify(examplesForSQL, null, 2)}
      You should answer in a similar fashion.`,
    },
    { role: "user", content: userQuery },
  ];
}

// OpenAI prompt for structuring retrieved database results into a desired output format (full sentence)
export function promptForAnswer(userQuery, sqlStatement, rowData) {
  return [
    {
      role: "system",
      content: `You are an intelligent AI assitant who specializes in answering questions of our employees based on the data retrieved from our database. You will be provided with:
        
        1. The initial question asked by the employee (in human language).
        2. Comprehensive schema of our database which contains information about all the tables in this database. Each table description contains information about all columns in that table and the relation of these columns to other tables. The schema will be provided in JSON format. Apart from the table defitions the schema also includes example rows randomly selected from the tables. You can find the example rows for each table under its "exampleRows" property on the provided JSON.
        3. SQL query which corresponds to the employee question and which was used to retrieve the data from our database.
        4. Raw data retrieved from the database in JSON format.
        
      Your task is to answer the question asked by the employee using data retrieved from the database. Answer in JSON format. Your JSON answer should have two properties:

        1. "isRelevant" - Boolean property which should be set to true if based on the provided data you are able to answer the employee question or at least provide the employee with some useful information. Set this property to false only if the data retrieved from the database is completely unhelpful in answering the qeustion.
        2. "formattedAnswer" - String containing your answer to the employee question. Should contain useful information which you extracted from the raw database data.Should be a full sentence in the same language as the initial question. If "isRelevant" is set to false return empty string.
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

// TODO: add examples to propmptForAnswer
