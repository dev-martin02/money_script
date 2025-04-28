import { DB_connection } from "../../config/database.js";

export async function add_transactions(transactions) {
  let connection; // Declare connection outside the try block

  try {
    connection = await DB_connection();
    const transaction_values = transactions.map((value) => [
      value.user_id, // those this goes like with cookies?
      value.transaction_date,
      value.description,
      value.amount,
      value.transaction_type,
      value.category_id,
      value.payment_method,
      value.notes,
      value.receipt_number,
      value.receipt_date,
      value.store_name,
      value.receipt_image_path,
    ]);

    // Create placeholders for mysql statement
    const placeholders = transaction_values
      .map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .join(", ");

    const transactionInsertQuery = `
    INSERT INTO transactions (
      user_id, transaction_date, description, amount, transaction_type,
      category_id, payment_method, notes, receipt_number,
      receipt_date, store_name, receipt_image_path
    )
    VALUES ${placeholders}
  `;
    // Will join everything to 1 array
    const transaction_values_flat = transaction_values.flat();
    const [result] = await connection.execute(
      transactionInsertQuery,
      transaction_values_flat
    );

    return result;
  } catch (error) {
    console.error("Error on add_transactions", error);
    throw Error(error);
    //  throw error; // Re-throw the error if you want the caller to handle it.
  } finally {
    // Ensure the connection is closed, even if errors occur
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

export async function get_transactions() {
  let connection;
  const query = "SELECT * FROM transactions;"; // CHANGE THIS

  try {
    connection = await DB_connection();
    if (!connection) {
      throw new Error("Failed to establish database connection.");
    }

    const [result] = await connection.execute(query);
    return result;
  } catch (error) {
    console.error("Error in get_transactions", error);
    throw error;
  } finally {
    if (connection && typeof connection === "function") {
      try {
        await connection.release();
      } catch (closeErr) {
        console.error("Error closing connection", closeErr);
      }
    }
  }
}
