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

export async function get_transactions_records(userId, page = 1, limit = 10) {
  const offset = (page - 1) * limit; // rows to skip

  const recordsQuery = `
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
    ORDER BY transaction_date DESC
    LIMIT ? OFFSET ?
  `;

  const countQuery = `
    SELECT COUNT(*) as total
    FROM transactions
    WHERE user_id = ?
  `;

  try {
    return await withConnection(async (connection) => {
      const records = await connection.allAsync(recordsQuery, [
        userId,
        limit,
        offset,
      ]);
      const countResult = await connection.getAsync(countQuery, [userId]);

      const total = countResult?.total || 0; // defensive js
      const totalPages = Math.ceil(total / limit);

      return {
        data: records,
        pagination: {
          total,
          page,
          totalPages,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    });
  } catch (error) {
    console.error("Error on Database Transactions:", error);
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError("Failed to get transactions", error);
  }
}

// ---------------------------- Transactions Calculations -----------------------------

export async function month_summary(id) {
  try {
    const db = await DB_connection();
    //TODOl: FIX THIS TO BE DINAMICALLY
    // Let's first verify the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // JavaScript months are 0-based
    const currentYear = currentDate.getFullYear();

    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense
      FROM transactions
      WHERE user_id = ?
        AND strftime('%m', transaction_date) = ?
        AND strftime('%Y', transaction_date) = ?
    `;

    const result = await db.getAsync(query, [
      id,
      currentMonth.toString().padStart(2, "0"), // Ensure month is 2 digits
      currentYear.toString(),
    ]);

    return result || { total_income: 0, total_expense: 0 };
  } catch (error) {
    console.error("Error in get_monthly_totals:", error);
    return { total_income: 0, total_expense: 0 };
  }
}

export async function month_weekly_breakdown(id, month = null, year = null) {
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

export async function get_category_breakdown(
  userId,
  month = null,
  year = null
) {
  try {
    const db = await DB_connection();

    // If month/year not provided, use current
    const now = new Date();
    const targetMonth = month
      ? month.toString().padStart(2, "0")
      : (now.getMonth() + 1).toString().padStart(2, "0"); // JS months are 0-based
    const targetYear = year ? year.toString() : now.getFullYear().toString();

    const query = `
      SELECT 
        c.id as category_id,
        c.name as category_name,
        c.type as category_type,
        c.color as category_color,
        c.icon as category_icon,
        SUM(t.amount) as total_amount,
        COUNT(t.id) as transaction_count
      FROM categories c
      LEFT JOIN transactions t ON c.id = t.category_id AND t.user_id = ?
      WHERE c.user_id = ? 
        AND strftime('%m', t.transaction_date) = ?
        AND strftime('%Y', t.transaction_date) = ?
      GROUP BY c.id, c.name, c.type, c.color, c.icon
      ORDER BY total_amount DESC
    `;

    const rows = await db.allAsync(query, [
      userId,
      userId,
      targetMonth,
      targetYear,
    ]);

    // Separate income and expense categories
    const breakdown = {
      income: rows.filter((row) => row.category_type === "income"),
      expense: rows.filter((row) => row.category_type === "expense"),
    };

    return breakdown;
  } catch (error) {
    console.error("Error in get_category_breakdown:", error);
    throw error;
  }
}

export async function get_monthly_breakdown(userId) {
  try {
    const db = await DB_connection();
    const query = `
      SELECT 
        strftime('%Y-%m', transaction_date) as month,
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as total_expense,
        SUM(CASE 
          WHEN transaction_type = 'income' THEN amount 
          WHEN transaction_type = 'expense' THEN -amount 
          ELSE 0 
        END) as net_amount,
        COUNT(CASE WHEN transaction_type = 'income' THEN 1 END) as income_count,
        COUNT(CASE WHEN transaction_type = 'expense' THEN 1 END) as expense_count
      FROM transactions
      WHERE user_id = ?
      GROUP BY strftime('%Y-%m', transaction_date)
      ORDER BY month DESC
    `;

    const results = await db.allAsync(query, [userId]);

    // Format the results to include transaction counts in a nested object
    return results.map((month) => ({
      month: month.month,
      total_income: month.total_income || 0,
      total_expense: month.total_expense || 0,
      net_amount: month.net_amount || 0,
      transaction_counts: {
        income: month.income_count || 0,
        expense: month.expense_count || 0,
      },
    }));
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error("Database error in get_monthly_breakdown:", error);
      throw error;
    }
    throw new DatabaseError("Error getting monthly breakdown:", error);
  }
}
