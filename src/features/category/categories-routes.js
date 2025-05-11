import express from "express";
import { get_category, add_category } from "./category.js";
import { check_user } from "../../shared/middleware/checkUser.js";
const categories_Router = express.Router();

categories_Router
  .route("/categories")
  .all(check_user)
  .get(async (req, res) => {
    try {
      const categories = await get_category();
      if (categories.length === 0 || !categories) {
        return res.status(404).json({ message: "No categories found." });
      }
      res.status(201).json({ message: categories });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({
          message: "Problem on the server, please contact support",
          error,
        });
    }
  })
  .post(async (req, res) => {
    try {
      const new_category = req.body;

      const response = await add_category(new_category);
      res.status(201).json({ message: response });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Problem on the server, please contact support" });
    }
  });

export default categories_Router;
