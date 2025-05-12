import express from "express";
import { get_category, add_category } from "./category.js";
import { check_user } from "../../shared/middleware/checkUser.js";
const categories_Router = express.Router();

categories_Router
  .route("/categories")
  .all(check_user)
  .get(async (req, res) => {
    try {
      const user = req.session.user_id;

      const categories = await get_category(user);
      if (categories.length === 0 || !categories) {
        return res.status(404).json({ message: "No categories found." });
      }
      res.status(201).json({ message: categories });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Problem on the server, please contact support",
        error,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const category_body = req.body;
      const user = req.session.user_id;

      category_body["user_id"] = user;
      console.log(user);
      const response = await add_category([category_body]);
      res.status(201).json({ message: response });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Problem on the server, please contact support" });
    }
  })
  .put(async (req, res) => {
    const category_body = req.body;
    console.log(category_body);
  });

export default categories_Router;
