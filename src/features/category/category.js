import e from "express";
import { withConnection } from "../../shared/database.js";

export async function add_category(categories) {
  if (categories.length === 0 || !categories) {
    throw Error("No categories provided for insertion");
  }

  const categories_values = categories.map((values) => [
    values.user_id,
    values.name,
    values.type,
    values.description,
    values.icon,
    values.color,
  ]);

  try {
    // This will make enough ? for each category that is being place
    const placeholders = categories_values
      .map(() => "(?, ?, ?, ?, ?, ?)")
      .join(", ");

    const categoryInsertQuery = `
    INSERT INTO categories (user_id, name, type, description, icon, color)
    VALUES ${placeholders}`;

    return await withConnection(async (connection) => {
      const result = await connection.runAsync(
        categoryInsertQuery,
        categories_values.flat()
      );
      return { success: true, insertedCount: result.changes };
    });
  } catch (error) {
    console.error("Error inserting categories:", error);
    throw Error("Failed to add categories", error);
  }
}

export async function get_category(user) {
  const query =
    "SELECT id, name, type, description, icon, color FROM categories WHERE user_id = ?;";

  try {
    return await withConnection(async (connection) => {
      const result = await connection.allAsync(query, [user]);
      return result;
    });
  } catch (error) {
    throw Error("Failed to get categories", error);
  }
}

export async function update_category(category_body) {
  const categories_values = [
    category_body.name,
    category_body.icon,
    category_body.color,
    category_body.description,
    category_body.type,
    category_body.id,
    category_body.id,
  ];

  const query = `UPDATE categories
  SET name = ?, icon = ?, color = ?, description = ?, type = ? 
  WHERE id = ? AND id = ?;`;

  try {
    return await withConnection(async (connection) => {
      const result = await connection.runAsync(query, categories_values);
      return { success: true, insertedCount: result.changes };
    });
  } catch (error) {
    throw Error("Failed to update categories", error);
  }
}

export async function delete_category(category_body) {
  const query = "DELETE FROM categories WHERE id = ? AND id = ?;";

  try {
    return await withConnection(async (connection) => {
      const result = await connection.runAsync(query, [
        category_body.id,
        category_body.category_id,
      ]);
      return { success: true, insertedCount: result.changes };
    });
  } catch (error) {
    throw Error("Failed to delete category", error);
  }
}
