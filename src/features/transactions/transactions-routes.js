import express from "express";
import { check_user } from "../../shared/middleware/checkUser.js";
import {
  category_breakdown,
  get_month_summary,
  monthly_breakdown_year,
  get_transactions,
  filter_transactions,
  submit_transaction,
} from "./transactions-controllers.js";
const transactions_Router = express.Router();

transactions_Router
  .route("/transactions")
  .all(check_user)
  .get(get_transactions)
  .post(submit_transaction);

transactions_Router
  .route("/transactions/filter")
  .all(check_user)
  .get(filter_transactions);

// Get current month's total income and expenses
transactions_Router
  .route("/transactions/monthly-summary")
  .all(check_user)
  .get(get_month_summary);

// Get months breakdown from current year
transactions_Router
  .route("/transactions/monthly-breakdown")
  .all(check_user)
  .get(monthly_breakdown_year);

// Get weekly breakdown for current month
// transactions_Router
//   .route("/transactions/weekly-breakdown")
//   .all(check_user)
//   .get(monthly_breakdown_yearly);

// Get category breakdown for transactions
transactions_Router
  .route("/transactions/category-breakdown")
  .all(check_user)
  .get(category_breakdown);

export default transactions_Router;
