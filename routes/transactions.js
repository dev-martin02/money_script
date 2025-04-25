import express from "express";
import {
  get_transactions,
  transactions,
} from "../modules/transactions/transactions.js";
const transactions_Router = express.Router();

transactions_Router
  .route("/transaction")
  .get(async (req, res) => {
    const transactions = await get_transactions();
    res.status(201).json({ message: transactions });
  })
  .post((req, res) => {
    const transaction_body = req.body;
    transactions(transaction_body);
    res.status(200).json({ message: "hello world" });
  });

export default transactions_Router;
