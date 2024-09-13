import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
};

export async function createConnection() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("Successfully established a database connection! ✅");

    return connection;
  } catch (err) {
    console.log("❌ Error creating a connection. Error message:\n", err, "❌");

    if (connection) {
      await connection.end();
    }
  }
}

export async function createTestConnection() {
  const connection = await createConnection();

  if (connection) {
    await connection.end();
    console.log("Closing a test connection...\n");
  }
}

// Helper to execute SQL on MySQL database
export async function executeSQL(query) {
  const connection = await createConnection();
  if (connection) {
    try {
      const [rows] = await connection.execute(query);
      return rows;
    } finally {
      connection.end();
    }
  }

  return null;
}
