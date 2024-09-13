import { dbSchema } from "../Database/dbSchema";

// OpenAI prompt for natural language to SQL translation
let examplesForSQL = [
  {
    userQuery: "How many doctors are available?",
    sqlStatement:
      "SELECT ilosc_lekarzy FROM stan_zasobow ORDER BY ostatnia_aktualizacja DESC LIMIT 1;",
  },
  {
    userQuery: "What is the waiting time for a nurse?",
    sqlStatement:
      "SELECT minuty_pielegniarka FROM stan_kolejki ORDER BY data DESC LIMIT 1;",
  },
  {
    userQuery: "How many patients of type 1 have been admitted?",
    sqlStatement: "SELECT COUNT(*) FROM pacjenci WHERE typ = 1;",
  },
  {
    userQuery:
      "What is the average waiting time for doctors for each patient type?",
    sqlStatement:
      "SELECT typy_pacjenta.nazwa, AVG(stan_kolejki.minuty_lekarz) as avg_wait_time FROM stan_kolejki JOIN pacjenci ON pacjenci.typ = typy_pacjenta.id GROUP BY typy_pacjenta.nazwa;",
  },
  {
    userQuery:
      "List all patient types with the total time spent by doctors for each type.",
    sqlStatement:
      "SELECT typy_pacjenta.nazwa, SUM(typy_pacjenta.czas_lekarza) as total_time FROM typy_pacjenta JOIN pacjenci ON pacjenci.typ = typy_pacjenta.id GROUP BY typy_pacjenta.nazwa;",
  },
  {
    userQuery:
      "Show the number of beds and nurses available in the latest resource update.",
    sqlStatement:
      "SELECT ilosc_lozek, ilosc_pielegniarek FROM stan_zasobow ORDER BY ostatnia_aktualizacja DESC LIMIT 1;",
  },
  {
    userQuery: "Get the patient type that had the longest nurse time spent.",
    sqlStatement:
      "SELECT typy_pacjenta.nazwa FROM typy_pacjenta ORDER BY czas_pielegniarki DESC LIMIT 1;",
  },
  {
    userQuery:
      "List the patient types with their respective total time for beds and bed observation time.",
    sqlStatement:
      "SELECT typy_pacjenta.nazwa, SUM(typy_pacjenta.czas_lozka) as total_bed_time, SUM(typy_pacjenta.czas_lozka_obserwacji) as total_observation_time FROM typy_pacjenta GROUP BY typy_pacjenta.nazwa;",
  },
];

examplesForSQL = examplesForSQL
  .map(
    (e) =>
      `Employee query: ${e.userQuery}\nSQL statement answer: ${e.sqlStatement}`
  )
  .join("\n\n");

export function promptForSQL(userQuery) {
  return [
    {
      role: "system",
      content: `You are an intelligent AI translator which translates natural language to SQL queries. You will be provided with:

      1. Comprehensive schema of our database which contains information about all the tables in this database. Each table description contains information about all columns in that table and the relation of these columns to other tables. The schema will be provided in JSON format.
      2. Query (written in human language) from our company employee who is trying to urgently find some important information in our database.
      
      You need to translate this query into an appropiate SQL statement which will allow the employee to retrieve the data. Prepare the SQL statement using information about out database. Your answer should ONLY contain this SQL statement without any additional comments - you are only allowed to answer with SQL.`,
    },
    {
      role: "system",
      content: `Here is the comprehensive JSON formatted schema of our database:\n${dbSchema}`,
    },
    {
      role: "system",
      content: `Here are some example pairs of employee queries and your SQL statement answers:\n${examplesForSQL}\nYou should answer in a similar fashion.`,
    },
    { role: "user", content: userQuery },
  ];
}

// OpenAI prompt for structuring retrieved database results into a desired output format (full sentence)
export function systemPromptForAnswer() {return []}
