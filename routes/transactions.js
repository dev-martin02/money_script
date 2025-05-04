import express from "express";
import {
  get_transactions,
  add_transactions,
} from "../modules/transactions/transactions.js";
const transactions_Router = express.Router();

transactions_Router
  .route("/transactions")
  .all((req, res, next) => {
    next();
  })
  .get(async (req, res) => {
    try {
      const transactions = await get_transactions();
      res.status(201).json({ message: transactions });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Problem on the server, please contact support" });
    }
  })
  .post(async (req, res) => {
    try {
      const transaction_body = req.body;
      const response = await add_transactions(transaction_body);
      res.status(200).json({ message: response });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Problem on the server, please contact support" });
    }
  });

export default transactions_Router;
