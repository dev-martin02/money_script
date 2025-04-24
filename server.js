import express from "express";
import {
  get_transactions,
  transactions,
} from "./modules/transactions/transactions.js";
import { add_category, get_category } from "./modules/category/category.js";

const server = express();
const port = 3000;

server.use(express.json());

server.get("/category", async (req, res) => {
  const categories = await get_category();

  console.log(categories);
  res.status(201).json({ message: categories });
});

server.post("/category", async (req, res) => {
  const new_category = req.body;

  const response = await add_category(new_category);
  res.status(201).json({ message: response });
});

server.get("/transactions", async (req, res) => {
  const transactions = await get_transactions();
  res.status(201).json({ message: transactions });
});

server.post("/transaction", (req, res) => {
  const transaction_body = req.body;
  transactions(transaction_body);
  res.status(200).json({ message: "hello world" });
});

server.listen(port, () => {
  console.log("the server is running in port 3000");
});
