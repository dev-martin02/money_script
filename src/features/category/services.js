import {
  add_category_query,
  update_category_query,
  delete_category_query,
} from "./dbQuery.js";

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

  return await add_category_query(categories_values);
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

  return await update_category_query(categories_values);
}

export async function delete_category(category_body) {
  return await delete_category_query(
    category_body.id,
    category_body.category_id
  );
}
