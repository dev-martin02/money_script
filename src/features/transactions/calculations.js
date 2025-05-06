import { DB_connection } from "../../shared/database.js";

export async function weekly_expenses(user_id) {
  let connection;

  try {
    connection = await DB_connection();
    const query = `
      SELECT 
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) AS total_expense
      FROM transactions
      WHERE user_id = ?
        AND MONTH(transaction_date) = MONTH(CURDATE())
        AND YEAR(transaction_date) = YEAR(CURDATE())
    `;
    const [rows] = await connection.execute(query, [user_id]);
    return rows[0];
  } catch (error) {
    console.error(error);
  } finally {
    if (connection && typeof connection === "function") {
      await connection.release();
      console.log("Database connection closed.");
    }
  }
}

export async function weekly_monthly(user_id) {
  let connection;
  try {
    connection = await DB_connection();
    const query = `
      SELECT 
        YEAR(transaction_date) AS year,
        WEEK(transaction_date, 1) AS week,
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) AS expense
      FROM transactions
      WHERE user_id = ?
        AND MONTH(transaction_date) = MONTH(CURDATE())
        AND YEAR(transaction_date) = YEAR(CURDATE())
      GROUP BY year, week
      ORDER BY year, week
    `;
    const [rows] = await connection.execute(query, [user_id]);
    return rows;
  } catch (error) {
    console.error(error);
  } finally {
    if (connection && typeof connection === "function") {
      await connection.release();
      console.log("Database connection closed.");
    }
  }
}

export async function weekly_yearly(user_id) {
  let connection;
  try {
    connection = await DB_connection();
    const query = `
      SELECT 
        YEAR(transaction_date) AS year,
        MONTH(transaction_date) AS month,
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) AS expense
      FROM transactions
      WHERE user_id = ?
        AND YEAR(transaction_date) = YEAR(CURDATE())
      GROUP BY year, month
      ORDER BY month
    `;
    const [rows] = await connection.execute(query, [user_id]);
    return rows;
  } catch (error) {
    console.error(error);
  } finally {
    if (connection && typeof connection === "function") {
      await connection.release();
      console.log("Database connection closed.");
    }
  }
}
