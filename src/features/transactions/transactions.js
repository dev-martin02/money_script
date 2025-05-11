import { withConnection, DatabaseError } from "../../shared/database.js";

class TransactionError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = "TransactionError";
    this.originalError = originalError;
  }
}

function validateTransaction(transaction) {
  const requiredFields = [
    "user_id",
    "transaction_date",
    "description",
    "amount",
    "transaction_type",
    "category_id",
    "payment_method",
  ];

  for (const field of requiredFields) {
    if (!transaction[field]) {
      throw new TransactionError(`Missing required field: ${field}`);
    }
  }

  if (typeof transaction.amount !== "number" || isNaN(transaction.amount)) {
    throw new TransactionError("Amount must be a valid number");
  }

  if (!["income", "expense"].includes(transaction.transaction_type)) {
    throw new TransactionError(
      "Transaction type must be either income or expense"
    );
  }
}

export async function add_transactions(transactions) {
  try {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      throw new TransactionError("Transactions must be a non-empty array");
    }

    transactions.forEach(validateTransaction);

    const transaction_values = transactions.map((value) => [
      value.user_id,
      value.transaction_date,
      value.description,
      value.amount,
      value.transaction_type,
      value.category_id,
      value.payment_method,
      value.notes || null,
      value.receipt_number || null,
      value.receipt_date || null,
      value.store_name || null,
      value.receipt_image_path || null,
    ]);

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

    return await withConnection(async (connection) => {
      const [result] = await connection.execute(
        query,
        transaction_values.flat()
      );
      return { success: true, insertedCount: result.affectedRows };
    });
  } catch (error) {
    if (error instanceof TransactionError || error instanceof DatabaseError) {
      throw error;
    }
    throw new TransactionError("Failed to add transactions", error);
  }
}

export async function get_transactions(user_id) {
  try {
    if (!user_id) {
      throw new TransactionError("User ID is required");
    }

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
    return await withConnection(async (connection) => {
      const [result] = await connection.execute(query, [user_id]);
      console.log(result);
      return result;
    });
  } catch (error) {
    if (error instanceof TransactionError || error instanceof DatabaseError) {
      throw error;
    }
    throw new TransactionError("Failed to retrieve transactions", error);
  }
}
