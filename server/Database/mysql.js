import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { loggerMySQL } from "../Utils/logger.js";

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
    return connection;
  } catch (error) {
    loggerMySQL.error("❌ Error creating a connection.");
    loggerMySQL.error(error);
    if (connection) {
      await connection.end();
    }
  }
}

export async function createTestConnection() {
  const connection = await createConnection();

  if (connection) {
    await connection.end();
    loggerMySQL.info("Successfully established a database connection! ✅");
  }
}

export async function executeSQL(query) {
  const connection = await createConnection();
  if (connection) {
    try {
      const [rows] = await connection.execute(query);
      loggerMySQL.info("Successfully fetched the raw data! ✅");
      loggerMySQL.info(`💾 Number of rows fetched: ${rows.length}`);
      // console.log("💾 Fetched data:", rows);
      return rows;
    } catch (error) {
      loggerMySQL.error(error);
    } finally {
      connection.end();
    }
  }

  return null;
}

createTestConnection();
