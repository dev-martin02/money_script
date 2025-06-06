import express from "express";
import { check_user } from "../../shared/middleware/checkUser.js";
import {
  category_breakdown,
  get_month_summary,
  get_transactions,
  monthly_breakdown_yearly,
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
  .get(monthly_breakdown_yearly);

// Get monthly breakdown for current year
transactions_Router
  .route("/transactions/current-year/monthly")
  .all(check_user)
  .get(monthly_breakdown_yearly);

// Get category breakdown for transactions
transactions_Router
  .route("/transactions/category-breakdown")
  .all(check_user)
  .get(category_breakdown);

export default transactions_Router;
