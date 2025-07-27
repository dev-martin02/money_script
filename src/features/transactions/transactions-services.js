import { AppError } from "../../utils/errors/errors.js";
import { add_transaction_records } from "./transactions-db.js";

// File will focus on the business logic
export function add_transactions(transactions) {
  const transaction_values = transactions.map((value) => [
    value.user_id,
    value.date,
    value.description,
    value.amount,
    value.type,
    value.category_id,
    value.method,
    value.notes || null,
    value.place || null,
  ]);

  try {
    const result = add_transaction_records(transaction_values);
    return result;
  } catch (error) {
    if (error.name === "AppError") {
      throw error;
    }
    throw AppError.database("Failed to add transactions", error);
  }
}
