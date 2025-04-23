import { connectToDatabase } from "../../config/database";

export async function category(categories) {
  let connection = await connectToDatabase();
  // 1. Insert Categories (if needed)
  //    This part assumes you might need to insert categories.  If your categories
  //    are already in the database, you can skip this part or modify it.
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
        // Consider if you want to continue inserting other categories or stop.
        // Here, we continue to the next category.  You might want to throw the error.
      }
    }
  }
}
