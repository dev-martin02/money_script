import { DB_connection } from "../../config/database.js";

export async function add_category(categories) {
  let connection = await DB_connection();

  if (categories && categories.length > 0) {
    for (const category of categories) {
      const categoryInsertQuery = `
              INSERT INTO categories (category_name, category_type, description)
              VALUES (?, ?, ?)
              ON DUPLICATE KEY UPDATE category_name = VALUES(category_name);
            `;

      const categoryValues = [
        category.category_name,
        category.category_type,
        category.description,
      ];

      try {
        const [categoryResult] = await connection.execute(
          categoryInsertQuery,
          categoryValues
        );
        if (categoryResult.insertId) {
          console.log(
            `Category "${category.category_name}" inserted with ID: ${categoryResult.insertId}`
          );
        } else {
          console.log(`Category "${category.category_name}" already exists.`);
        }
      } catch (error) {
        console.error(
          `Error inserting category "${category.category_name}":`,
          error
        );
      }
    }
  }
}

export async function get_category() {
  let connection = await DB_connection();
  const query = "SELECT * FROM categories;"; // CHANGE THIS

  try {
    const [result] = await connection.execute(query);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (closeErr) {
        console.error("Error closing connection", closeErr);
      }
    }
  }
}
