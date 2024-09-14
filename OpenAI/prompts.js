import { dbSchema } from "../Database/dbSchema.js";

// OpenAI prompt for natural language to SQL translation
let examplesForSQL = [
  {
    userQuery: "How many doctors are available?",
    aiAnswer: {
      sqlStatement:
        "SELECT ilosc_lekarzy FROM stan_zasobow ORDER BY ostatnia_aktualizacja DESC LIMIT 1;",
      isSelect: true,
    },
  },
  {
    userQuery: "What is the waiting time for a nurse?",
    aiAnswer: {
      sqlStatement:
        "SELECT minuty_pielegniarka FROM stan_kolejki ORDER BY data DESC LIMIT 1;",
      isSelect: true,
    },
  },
  {
    userQuery: "How many patients of type 1 have been admitted?",
    aiAnswer: {
      sqlStatement: "SELECT COUNT(*) FROM pacjenci WHERE typ = 1;",
      isSelect: true,
    },
  },
  {
    userQuery: "Add a new patient with type 2 and admission date as now.",
    aiAnswer: {
      sqlStatement:
        "INSERT INTO pacjenci (typ, data_przyjecia) VALUES (2, CURRENT_TIMESTAMP);",
      isSelect: false,
    },
  },
  {
    userQuery:
      "What is the average waiting time for doctors for each patient type?",
    aiAnswer: {
      sqlStatement:
        "SELECT typy_pacjenta.nazwa, AVG(stan_kolejki.minuty_lekarz) AS avg_wait_time FROM stan_kolejki JOIN pacjenci ON pacjenci.typ = typy_pacjenta.id GROUP BY typy_pacjenta.nazwa;",
      isSelect: true,
    },
  },
  {
    userQuery:
      "List all patient types with the total time spent by doctors for each type.",
    aiAnswer: {
      sqlStatement:
        "SELECT typy_pacjenta.nazwa, SUM(typy_pacjenta.czas_lekarza) AS total_time FROM typy_pacjenta JOIN pacjenci ON pacjenci.typ = typy_pacjenta.id GROUP BY typy_pacjenta.nazwa;",
      isSelect: true,
    },
  },
  {
    userQuery:
      "Show the number of beds and nurses available in the latest resource update.",
    aiAnswer: {
      sqlStatement:
        "SELECT ilosc_lozek, ilosc_pielegniarek FROM stan_zasobow ORDER BY ostatnia_aktualizacja DESC LIMIT 1;",
      isSelect: true,
    },
  },
  {
    userQuery: "Get the patient type that had the longest nurse time spent.",
    aiAnswer: {
      sqlStatement:
        "SELECT typy_pacjenta.nazwa FROM typy_pacjenta ORDER BY czas_pielegniarki DESC LIMIT 1;",
      isSelect: true,
    },
  },
  {
    userQuery: "Update the number of available doctors to 5.",
    aiAnswer: {
      sqlStatement:
        "UPDATE stan_zasobow SET ilosc_lekarzy = 5 WHERE ostatnia_aktualizacja = (SELECT MAX(ostatnia_aktualizacja) FROM stan_zasobow);",
      isSelect: false,
    },
  },
  {
    userQuery: "Delete all patients who were admitted before 2023.",
    aiAnswer: {
      sqlStatement: "DELETE FROM pacjenci WHERE data_przyjecia < '2023-01-01';",
      isSelect: false,
    },
  },
  {
    userQuery:
      "List the patient types with their respective total time for beds and bed observation time.",
    aiAnswer: {
      sqlStatement:
        "SELECT typy_pacjenta.nazwa, SUM(typy_pacjenta.czas_lozka) AS total_bed_time, SUM(typy_pacjenta.czas_lozka_obserwacji) AS total_observation_time FROM typy_pacjenta GROUP BY typy_pacjenta.nazwa;",
      isSelect: true,
    },
  },
];

examplesForSQL = examplesForSQL
  .map(
    (e) =>
      `Employee query:\n${e.userQuery}\n\nYour answer:\n${JSON.stringify(
        e.aiAnswer,
        null,
        2
      )}`
  )
  .join("\n\n");

export function promptForSQL(userQuery) {
  return [
    {
      role: "system",
      content: `You are an intelligent AI translator which translates natural language to SQL queries. You will be provided with:

        1. Comprehensive schema of our database which contains information about all the tables in this database. Each table description contains information about all columns in that table and the relation of these columns to other tables. The schema will be provided in JSON format.
        2. Query (written in human language) from our company employee who is trying to urgently find some important information in our database.
      
      You need to translate this query into an appropiate SQL statement which will allow the employee to retrieve the data. Prepare the SQL statement using information about out database. Answer in JSON format. Your JSON answer should have two properties: 
        1. "sqlStatement" - String with valid SQL statement without any additional comments. SQL-specific keywords should be in upper case.
        2. "isSelect" - Boolean property set to true only if the generated SQL statement is of type SELECT (and thus doesn't change the data in our database). Otherwise (e.g if the SQL statement involves INSERT or CREATE operation) this property should be false.`,
    },
    {
      role: "system",
      content: `Here is the comprehensive JSON formatted schema of our database:\n${JSON.stringify(
        dbSchema,
        null,
        2
      )}`,
    },
    {
      role: "system",
      content: `Here are some example pairs of employee queries and your JSON answers containing SQL statement:\n${examplesForSQL}\nYou should answer in a similar fashion.`,
    },
    { role: "user", content: userQuery },
  ];
}

// OpenAI prompt for structuring retrieved database results into a desired output format (full sentence)
export function promptForAnswer() {
  return [];
}
