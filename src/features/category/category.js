import { DB_connection } from "../../shared/database.js";

export async function add_category(categories) {
  if (categories.length === 0 || !categories) {
    console.warn("No categories provided for insertion");
    return;
  }

  const categories_values = categories.map((values) => [
    values.user_id,
    values.category_name,
    values.transaction_type,
    values.description,
    values.icon,
    values.color,
  ]);

  let connection;

  try {
    connection = await DB_connection();

    // This will make enough ? for each category that is being place
    const placeholders = categories_values
      .map(() => "(?, ?, ?, ?, ?, ?)")
      .join(", ");

    const categoryInsertQuery = `
    INSERT INTO categories (user_id, category_name, transaction_type, description, icon, color)
    VALUES ${placeholders}`;

    console.log(categories_values);

    const [result] = await connection.query(
      categoryInsertQuery,
      categories_values.flat()
    );
    return `Inserted or updated ${result.affectedRows} categories`;
  } catch (error) {
    console.error("Error inserting categories:", error);
    throw error;
  } finally {
    if (connection && typeof connection === "function") {
      try {
        await connection.release();
      } catch (releaseError) {
        console.error("Error releasing DB connection:", releaseError);
      }
    }
  }
}

export async function get_category() {
  let connection;
  const query = "SELECT * FROM categories;";

  try {
    connection = await DB_connection();
    if (!connection)
      throw new Error("Failed to establish database connection.");

    const [result] = await connection.execute(query);
    return result;
  } catch (error) {
    console.error("Error in get_category", error);
    throw error;
  } finally {
    if (connection && typeof connection === "function") {
      try {
        await connection.release();
      } catch (closeErr) {
        console.error("Error closing connection", closeErr);
      }
    }
  }
}
