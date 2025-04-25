import express from "express";
import { get_category, add_category } from "../modules/category/category.js";
const categories_Router = express.Router();

categories_Router
  .route("/category")
  .get(async (req, res) => {
    const categories = await get_category();

    console.log(categories);
    res.status(201).json({ message: categories });
  })
  .post(async (req, res) => {
    const new_category = req.body;

    const response = await add_category(new_category);
    res.status(201).json({ message: response });
  });

export default categories_Router;
