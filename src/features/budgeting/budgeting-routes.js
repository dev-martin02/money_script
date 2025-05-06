import express from "express";
const budgeting_router = express.Router();

categories_Router
  .route("/budgeting")
  .all((req, res, next) => {
    // runs for all HTTP verbs first
    // think of it as route specific middleware!
    next();
  })
  .get(async (req, res) => {
    try {
      const categories = await get_category();
      if (categories.length === 0 || !categories) {
        return res.status(404).json({ message: "No categories found." });
      }
      res.status(201).json({ message: categories });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Problem on the server, please contact support" });
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
