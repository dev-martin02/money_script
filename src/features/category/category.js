import { withConnection } from "../../shared/database.js";

export async function add_category(categories) {
  if (categories.length === 0 || !categories) {
    throw Error("No categories provided for insertion");
  }

  const categories_values = categories.map((values) => [
    values.user_id,
    values.category_name,
    values.transaction_type,
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
    INSERT INTO categories (user_id, category_name, transaction_type, description, icon, color)
    VALUES ${placeholders}`;

    return await withConnection(async (connection) => {
      const [result] = await connection.query(
        categoryInsertQuery,
        categories_values.flat()
      );

      return { success: true, insertedCount: result.affectedRows };
    });
  } catch (error) {
    console.error("Error inserting categories:", error);
    throw Error("Failed to add categories", error);
  }
}

const category_table = [
  "category_id",
  "category_name",
  "color",
  "description",
  "icon",
  "transaction_type",
];

export async function get_category(user) {
  const query =
    "SELECT category_id, category_name, color, description, transaction_type, icon FROM categories WHERE user_id = ?;";

  try {
    return await withConnection(async (connection) => {
      const [result] = await connection.execute(query, [user]);
      console.log(result);
      return result;
    });
  } catch (error) {
    throw Error("Failed to get categories", error);
  }
}

export async function update_category(category_body) {
  const query = `UPDATE category
  SET category_name = ?, icon = ?, color = ?, description = ?, transaction_type = ? 
  WHERE user_id = ? AND category_id = ?;`;
  let user_id, categories_id;
  // for(let i = 0; i < category_body.length)
}
