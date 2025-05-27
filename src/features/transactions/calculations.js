import { DB_connection } from "../../shared/database.js";

export async function monthly_totals(id) {
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
    console.error("Error in monthly_totals:", error);
    throw error;
  }
}

export async function weekly_monthly(id) {
  try {
    const db = await DB_connection();
    const query = `
      SELECT 
        strftime('%Y', transaction_date) AS year,
        strftime('%W', transaction_date) AS week,
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) AS expense
      FROM transactions
      WHERE user_id = ?
        AND strftime('%m', transaction_date) = strftime('%m', 'now')
        AND strftime('%Y', transaction_date) = strftime('%Y', 'now')
      GROUP BY year, week
      ORDER BY year, week
    `;
    const rows = await db.allAsync(query, [id]);
    return rows || [];
  } catch (error) {
    console.error("Error in weekly_monthly:", error);
    throw error;
  }
}

export async function monthly_yearly(id) {
  try {
    const db = await DB_connection();
    const query = `
      SELECT 
        strftime('%Y', transaction_date) AS year,
        strftime('%m', transaction_date) AS month,
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) AS expense
      FROM transactions
      WHERE user_id = ?
        AND strftime('%Y', transaction_date) = strftime('%Y', 'now')
      GROUP BY year, month
      ORDER BY month
    `;
    const rows = await db.allAsync(query, [id]);
    return rows || [];
  } catch (error) {
    console.error("Error in monthly_yearly:", error);
    throw error;
  }
}
