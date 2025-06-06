import { DB_connection, DatabaseError } from "../../shared/database.js";

export async function add_category_query(categories_values) {
  try {
    const db = await DB_connection();
    const placeholders = categories_values
      .map(() => "(?, ?, ?, ?, ?, ?)")
      .join(", ");

    const query = `
    INSERT INTO categories (user_id, name, type, description, icon, color)
    VALUES ${placeholders}`;

    const result = await db.runAsync(query, categories_values.flat());
    return { success: true, insertedCount: result.changes };
  } catch (err) {
    if (err instanceof DatabaseError) {
      throw err;
    }
    throw new DatabaseError("Failed to add categories", err);
  }
}

export async function get_category_query(user) {
  try {
    const db = await DB_connection();
    const query =
      "SELECT id, name, type, description, icon, color FROM categories WHERE user_id = ?;";

    const result = await db.allAsync(query, [user]);
    return result;
  } catch (err) {
    if (err instanceof DatabaseError) {
      throw err;
    }
    throw new DatabaseError("Failed to get categories", err);
  }
}

export async function update_category_query(categories_values) {
  try {
    const db = await DB_connection();
    const query = `UPDATE categories
    SET name = ?, icon = ?, color = ?, description = ?, type = ? 
    WHERE id = ? AND id = ?;`;

    const result = await db.runAsync(query, categories_values);
    return { success: true, insertedCount: result.changes };
  } catch (err) {
    if (err instanceof DatabaseError) {
      throw err;
    }
    throw new DatabaseError("Failed to update categories", err);
  }
}

export async function delete_category_query(category_id, category_id2) {
  try {
    const db = await DB_connection();
    const query = "DELETE FROM categories WHERE id = ? AND id = ?;";

    const result = await db.runAsync(query, [category_id, category_id2]);
    return { success: true, insertedCount: result.changes };
  } catch (err) {
    if (err instanceof DatabaseError) {
      throw err;
    }
    throw new DatabaseError("Failed to delete category", err);
  }
}
