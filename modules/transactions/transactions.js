import { DB_connection } from "../../config/database.js";

export async function transactions(transactions) {
  let connection; // Declare connection outside the try block

  try {
    connection = await DB_connection();
    console.log("Connected to the database!");

    // 2. Insert Transactions
    if (transactions && transactions.length > 0) {
      for (const transaction of transactions) {
        const transactionInsertQuery = `
              INSERT INTO transactions (
                transaction_date, description, amount, transaction_type,
                category_id, payment_method, notes, receipt_number,
                receipt_date, store_name, receipt_image_path
              )
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
        // changed the query to match the new table
        const transactionValues = [
          transaction.transaction_date,
          transaction.description,
          transaction.amount,
          transaction.transaction_type,
          transaction.category_id,
          transaction.payment_method,
          transaction.notes,
          transaction.receipt_number,
          transaction.receipt_date,
          transaction.store_name,
          transaction.receipt_image_path,
        ];
        if (!transaction.category_id) {
          throw new Error(`Category is missing! for : ${transaction} `);
        }
        try {
          const [transactionResult] = await connection.execute(
            transactionInsertQuery,
            transactionValues
          );
          console.log(
            `Transaction inserted with ID: ${transactionResult.insertId}` // .insertID will get the ID of the last row you just inserted
          );
        } catch (error) {
          console.error("Error inserting transaction:", error);
          throw Error("Transaction couldn't be complete");
        }
      }
    }
    console.log("Data insertion complete.");
  } catch (error) {
    console.error(
      "Error connecting to the database or during insertion:",
      error
    );
    throw Error(error);
    //  throw error; // Re-throw the error if you want the caller to handle it.
  } finally {
    // Ensure the connection is closed, even if errors occur
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

export async function get_transactions() {
  let connection = await DB_connection();
  const query = "SELECT * FROM transactions;"; // CHANGE THIS

  try {
    const [result] = await connection.execute(query);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (closeErr) {
        console.error("Error closing connection", closeErr);
      }
    }
  }
}
