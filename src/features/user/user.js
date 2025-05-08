// import { DB_connection } from "../../../config/database.js";
import { DB_connection } from "../../shared/database.js";
// Create user
export async function create_user(user_info) {
  // Get personal Info -> name + email + password
  const { name, email, password } = user_info;
  let connection;
  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?);";
  const arr = [name, email, password]; // ['test','test@gmail.com', '1234' ]
  try {
    connection = await DB_connection();
    const [result] = await connection.execute(query, arr);
    console.log(result);
    return "User was created it!";
  } catch (error) {
    console.error(error);
    throw Error("there was an error");
  } finally {
    if (connection) {
      try {
        await connection.release();
        console.log("Database connection closed.");
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }
}

// Retrieve user
export async function retrieve_user(user_info) {
  const { email, password } = user_info;
  let connection;
  const query = `SELECT * FROM users where email= ? AND password=?`;
  try {
    connection = await DB_connection();
    const [result] = await connection.execute(query, [email, password]);
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw Error("there was an error");
  } finally {
    if (connection && typeof connection === "function") {
      try {
        await connection.release();
        console.log("Database connection closed.");
      } catch (closeError) {
        console.error("Error closing database connection:", closeError);
      }
    }
  }
}
// Update user
// Delete user
