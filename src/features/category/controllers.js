import { get_category_query } from "./dbQuery.js";
import { add_category, update_category, delete_category } from "./services.js";

export async function get_category(req, res) {
  try {
    const user = req.session.user_id;

    const categories = await get_category_query(user);
    if (categories.length === 0 || !categories) {
      return res
        .status(200)
        .json({ message: "No categories found.", data: [] });
    }
    res.status(201).json({ message: "Categories of user", data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Problem on the server, please contact support",
      error,
    });
  }
}

export async function post_category(req, res) {
  try {
    const category_body = req.body;
    const user = req.session.user_id;

    category_body["user_id"] = user;
    const response = await add_category([category_body]);
    res.status(201).json({ message: response });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Problem on the server, please contact support" });
  }
}

export async function put_category(req, res) {
  try {
    const category_body = req.body;
    const user = req.session.id;
    category_body["id"] = user;
    const response = await update_category(category_body);

    res.status(201).json({ message: response });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Problem on the server, please contact support" });
  }
}

export async function delete_categorys(req, res) {
  try {
    const category_body = req.body;
    const user = req.session.id;
    category_body["id"] = user;

    const response = await delete_category(category_body);

    res.status(201).json({ message: response });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Problem on the server, please contact support" });
  }
}
