// file will contain all functions which have all the interactions need it for the transactions folder
import { withConnection, DatabaseError } from "../../shared/database.js";

export async function add_transaction_records(transaction_values) {
  try {
    const placeholders = transaction_values
      .map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .join(", ");
    const join_transactions = transaction_values.flat();

    const query = `
      INSERT INTO transactions (
        user_id, transaction_date, description, amount, transaction_type,
        category_id, payment_method, notes, receipt_number,
        receipt_date, store_name, receipt_image_path
      )
      VALUES ${placeholders}
    `;
    return await withConnection(async (connection) => {
      const [result] = await connection.execute(query, join_transactions);
      return { success: true, insertedCount: result.affectedRows };
    });
  } catch (err) {
    if (err instanceof DatabaseError) {
      throw err;
    }
  }
}

export async function get_transactions_records(user_id) {
  const query = `
      SELECT 
        transaction_id,
        amount,
        store_name,
        transaction_date,
        description,
        payment_method,
        category_id,
        transaction_type,
        notes
      FROM transactions
      WHERE user_id = ?
    `;
  try {
    return await withConnection(async (connection) => {
      const [result] = await connection.execute(query, [user_id]);
      return result;
    });
  } catch (error) {
    console.log("error on Database Transactions");
    if (err instanceof DatabaseError) {
      throw err;
    }
  }
}
