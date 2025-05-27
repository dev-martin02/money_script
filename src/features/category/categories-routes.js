import express from "express";
import {
  get_category,
  add_category,
  update_category,
  delete_category,
} from "./category.js";
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
  })
  .post(async (req, res) => {
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
  })
  .put(async (req, res) => {
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
  })
  .delete(async (req, res) => {
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
  });

export default categories_Router;
