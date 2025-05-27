// file will contain all functions which have all the interactions need it for the transactions folder
import {
  withConnection,
  DatabaseError,
  DB_connection,
} from "../../shared/database.js";

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

export async function get_monthly_totals(id) {
  try {
    const db = await DB_connection();
    const query = `
      SELECT 
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) AS total_expense
      FROM transactions
      WHERE user_id = ?
        AND strftime('%m', transaction_date) = strftime('%m', 'now')
        AND strftime('%Y', transaction_date) = strftime('%Y', 'now')
    `;
    const result = await db.getAsync(query, [id]);
    return result || { total_income: 0, total_expense: 0 };
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.log(error.message);
      throw error;
    }
    throw new DatabaseError("Error getting monthly_totals:", error.message);
  }
}

export async function get_weekly_breakdown(id, month = null, year = null) {
  try {
    const db = await DB_connection();
    const query = `
      SELECT 
        strftime('%W', transaction_date) as week_number,
        strftime('%Y-%m-%d', transaction_date) as week_start,
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) AS weekly_income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) AS weekly_expense,
        COUNT(CASE WHEN transaction_type = 'income' THEN 1 END) as income_count,
        COUNT(CASE WHEN transaction_type = 'expense' THEN 1 END) as expense_count
      FROM transactions
      WHERE user_id = ?
        AND strftime('%m', transaction_date) = ?
        AND strftime('%Y', transaction_date) = ?
      GROUP BY week_number
      ORDER BY week_number ASC
    `;

    // Use provided month/year or current month/year
    const targetMonth = month || strftime("%m", "now");
    const targetYear = year || strftime("%Y", "now");

    const result = await db.allAsync(query, [id, targetMonth, targetYear]);

    // Format the results to include week ranges and net amount
    return result.map((week) => ({
      week_number: parseInt(week.week_number),
      week_start: week.week_start,
      weekly_income: week.weekly_income || 0,
      weekly_expense: week.weekly_expense || 0,
      net_amount: (week.weekly_income || 0) - (week.weekly_expense || 0),
      transaction_counts: {
        income: week.income_count || 0,
        expense: week.expense_count || 0,
      },
    }));
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error("Database error in get_weekly_breakdown:", error);
      throw error;
    }
    throw new DatabaseError("Error getting weekly breakdown:", error);
  }
}
