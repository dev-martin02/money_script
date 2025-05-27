import express from "express";
import {
  monthly_totals,
  monthly_yearly,
  weekly_monthly,
} from "./calculations.js";
import { check_user } from "../../shared/middleware/checkUser.js";
import {
  get_month_summary,
  get_transactions,
  submit_transaction,
} from "./transactions-controllers.js";
const transactions_Router = express.Router();

transactions_Router
  .route("/transactions")
  .all(check_user)
  .get(get_transactions)
  .post(submit_transaction);

// Get current month's total income and expenses
transactions_Router
  .route("/transactions/monthly-summary")
  .all(check_user)
  .get(get_month_summary);

// Get weekly breakdown for current month
transactions_Router
  .route("/transactions/weekly-breakdown")
  .all(check_user)
  .get(async (req, res) => {
    try {
      const userId = req.session.user_id;
      const data = await weekly_monthly(userId);
      res.status(200).json({ data });
    } catch (error) {
      console.error("Error fetching weekly breakdown:", error);
      res.status(500).json({
        error: "Problem on the server, please contact support",
        details: error.message,
      });
    }
  });

// Get monthly breakdown for current year
transactions_Router
  .route("/transactions/current-year/monthly")
  .all(check_user)
  .get(async (req, res) => {
    try {
      const userId = req.session.user_id;
      const data = await monthly_yearly(userId);
      res.status(200).json({ data });
    } catch (error) {
      console.error("Error fetching monthly breakdown:", error);
      res.status(500).json({
        error: "Problem on the server, please contact support",
        details: error.message,
      });
    }
  });

export default transactions_Router;
