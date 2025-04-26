import { DB_connection } from "../../config/database.js";

export async function add_category(categories) {
  if (categories.length === 0 || !categories) {
    console.warn("No categories provided for insertion");
    return;
  }

  const categories_values = categories.map((values) => [
    values.category_name,
    values.category_type,
    values.description,
  ]);

  let connection;

  try {
    connection = await DB_connection();

    // This will make enough ? for each category that is being place
    const placeholders = categories_values.map(() => "(?, ?, ?)").join(", ");

    const categoryInsertQuery = `
    INSERT INTO categories (category_name, category_type, description)
    VALUES ${placeholders}`;

    // Flatten the array of values to make it only 1
    const flattenedValues = categories_values.flat();

    const [result] = await connection.query(
      categoryInsertQuery,
      flattenedValues
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
