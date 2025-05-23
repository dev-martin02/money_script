// file will contain all functions which have all the interactions need it for the transactions folder
import { withConnection, DatabaseError } from "../../shared/database.js";

export async function add_transaction_records(transaction_values) {
  try {
    const placeholders = transaction_values
      .map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .join(", ");
    const join_transactions = transaction_values.flat();

    const query = `
      INSERT INTO transactions (
        user_id, transaction_date, description, amount, transaction_type,
        category_id, method, notes, place
      )
      VALUES ${placeholders}
    `;
    return await withConnection(async (connection) => {
      const result = await connection.runAsync(query, join_transactions);
      return { success: true, insertedCount: result.changes };
    });
  } catch (err) {
    if (err instanceof DatabaseError) {
      throw err;
    }
    throw new DatabaseError("Failed to add transactions", err);
  }
}

export async function get_transactions_records(id) {
  const query = `
      SELECT 
        id,
        amount,
        place,
        transaction_date,
        description,
        method,
        category_id,
        transaction_type,
        notes
      FROM transactions
      WHERE user_id = ?
    `;
  try {
    return await withConnection(async (connection) => {
      const result = await connection.allAsync(query, [id]);
      return result;
    });
  } catch (error) {
    console.error("Error on Database Transactions:", error);
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError("Failed to get transactions", error);
  }
}
