import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "1234",
  database: "money_script",
};
let pool;

export async function DB_connection() {
  try {
    if (!pool) {
      // Create a connection pool if it doesn't exist
      pool = mysql.createPool(dbConfig);
      console.log("Connected to the database pool");
    }
    return pool;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}
