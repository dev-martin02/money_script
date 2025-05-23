import express from "express";
import {
  weekly_expenses,
  weekly_monthly,
  weekly_yearly,
} from "./calculations.js";
import { check_user } from "../../shared/middleware/checkUser.js";
import {
  get_transactions,
  submit_transaction,
} from "./transactions-controllers.js";
const transactions_Router = express.Router();

transactions_Router
  .route("/transactions")
  .all(check_user)
  .get(get_transactions)
  .post(submit_transaction);

// ✅ New route: Total income/expense this month
transactions_Router
  .route("/transactions/summary")
  .all(check_user)
  .get(async (req, res) => {
    try {
      const user = req.session.id;
      const data = await weekly_expenses(user);
      res.status(200).json({ message: data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Problem on the server, please contact support" });
    }
  });

// ✅ New route: Weekly summary (this month)
transactions_Router
  .route("/transactions/weekly")
  .all(check_user)
  .get(async (req, res) => {
    try {
      const user = req.session.id;
      const data = await weekly_monthly(user);
      res.status(200).json({ message: data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Problem on the server, please contact support" });
    }
  });

// ✅ New route: Monthly summary (this year)
transactions_Router
  .route("/transactions/monthly")
  .all(check_user)
  .get(async (req, res) => {
    try {
      const user = req.session.id;
      const data = await weekly_yearly(user);
      res.status(200).json({ message: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Problem on the server, please contact support",
        error: error,
      });
    }
  });

export default transactions_Router;
