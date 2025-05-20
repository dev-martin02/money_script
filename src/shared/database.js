import mysql from "mysql2/promise";

// Database configuration with fallback values
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "money_script",
};

export class DatabaseError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = "DatabaseError";
    this.originalError = originalError;
  }
}

export async function DB_connection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    throw new DatabaseError("Failed to establish database connection", error);
  }
}

export async function withConnection(operation) {
  let connection;
  try {
    connection = await DB_connection();
    if (!connection) {
      throw new DatabaseError("Connection object is null or undefined");
    }
    return await operation(connection);
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    console.error("Error not handled", error);
    throw error;
  } finally {
    if (connection) {
      try {
        if (typeof connection === "function") await connection.release();
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }
}
