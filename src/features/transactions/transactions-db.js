// This file will contain all functions which have all the interactions need it for the transactions folder
import { withConnection, DatabaseError } from "../../shared/database.js";
export function add_transactions() {
  const placeholders = transaction_values
    .map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .join(", ");

  const query = `
      INSERT INTO transactions (
        user_id, transaction_date, description, amount, transaction_type,
        category_id, payment_method, notes, receipt_number,
        receipt_date, store_name, receipt_image_path
      )
      VALUES ${placeholders}
    `;
}
