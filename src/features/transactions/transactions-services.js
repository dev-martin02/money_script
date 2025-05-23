import { ApiError, DatabaseError } from "../../utils/errors/errors.js";
import { add_transaction_records } from "./transactions-db.js";

// File will focus on the business logic
export async function add_transactions(transactions) {
  const transaction_values = transactions.map((value) => [
    value.user_id,
    value.transaction_date,
    value.description,
    value.amount,
    value.transaction_type,
    value.category_id,
    value.method,
    value.notes || null,
    value.place || null,
  ]);
  try {
    const result = await add_transaction_records(transaction_values);
    return result;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new ApiError("Failed to add transactions", error);
  }
}
