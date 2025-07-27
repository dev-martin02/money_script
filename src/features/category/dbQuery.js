import { getDatabase } from "../../shared/database.js";
import { DatabaseError } from "../../utils/errors/errors.js";

export function add_category_query(categories_values) {
  try {
    const db = getDatabase();
    const placeholders = categories_values
      .map(() => "(?, ?, ?, ?, ?, ?)")
      .join(", ");

    const query = `
    INSERT INTO categories (user_id, name, type, description, icon, color)
    VALUES ${placeholders}`;

    const result = db.prepare(query).run(...categories_values.flat());
    return { success: true, insertedCount: result.changes };
  } catch (err) {
    if (err instanceof DatabaseError) {
      throw err;
    }
    throw new DatabaseError("Failed to add categories", err);
  }
}

export function get_category_query(user) {
  try {
    const db = getDatabase();
    const query =
      "SELECT id, name, type, description, icon, color FROM categories WHERE user_id = ?;";

    const result = db.prepare(query).all(user);
    return result;
  } catch (err) {
    if (err instanceof DatabaseError) {
      throw err;
    }
    throw new DatabaseError("Failed to get categories", err);
  }
}

export function update_category_query(categories_values) {
  try {
    const db = getDatabase();
    const query = `UPDATE categories
    SET name = ?, icon = ?, color = ?, description = ?, type = ? 
    WHERE id = ?;`;

    const result = db.prepare(query).run(...categories_values);
    return { success: true, insertedCount: result.changes };
  } catch (err) {
    if (err instanceof DatabaseError) {
      throw err;
    }
    throw new DatabaseError("Failed to update categories", err);
  }
}

export function delete_category_query(category_id) {
  try {
    const db = getDatabase();
    const query = "DELETE FROM categories WHERE id = ?;";

    const result = db.prepare(query).run(category_id);
    return { success: true, insertedCount: result.changes };
  } catch (err) {
    if (err instanceof DatabaseError) {
      throw err;
    }
    throw new DatabaseError("Failed to delete category", err);
  }
}
