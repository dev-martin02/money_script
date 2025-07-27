import { AppError } from "../../utils/errors/errors.js";
import {
  month_summary,
  get_transactions_records,
  get_category_breakdown,
  get_monthly_breakdown,
  filter_records,
} from "./transactions-db.js";

import { add_transactions } from "./transactions-services.js";

// --------- Transactions Operations ----------
export function submit_transaction(req, res, next) {
  try {
    // No need for manual validation - Zod middleware handles it
    const transactions = Array.isArray(req.body) ? req.body : [req.body];
    const userID = req.session.user_id;

    if (!userID) {
      throw AppError.unauthorized("User session not found");
    }

    // Add user_id to the transactions
    const transactions_with_user = transactions.map((transaction) => ({
      ...transaction,
      user_id: userID,
    }));

    const response = add_transactions(transactions_with_user);

    res.status(201).json({
      message: "Transactions created successfully",
      data: response,
    });
  } catch (error) {
    next(error); // Pass to global error handler
  }
}

export function get_transactions(req, res, next) {
  try {
    const userID = req.session.user_id;
    if (!userID) {
      throw AppError.unauthorized("User session not found");
    }

    const { page, limit } = req.query; // Already validated by Zod middleware
    const transactions = get_transactions_records(userID, page, limit);

    res.status(200).json({
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
}

export function filter_transactions(req, res, next) {
  try {
    const userID = req.session.user_id;
    if (!userID) {
      throw AppError.unauthorized("User session not found");
    }

    const { category_id } = req.query; // Already validated by Zod middleware
    const filtered_transactions = filter_records(userID, category_id);

    res.status(200).json({
      message: "Filtered transactions retrieved successfully",
      data: filtered_transactions,
    });
  } catch (error) {
    next(error);
  }
}

// --------- Analytics Operations ----------
export function get_month_summary(req, res, next) {
  try {
    const userID = req.session.user_id;
    if (!userID) {
      throw AppError.unauthorized("User session not found");
    }

    const summary = month_summary(userID);

    res.status(200).json({
      message: "Monthly summary retrieved successfully",
      data: summary,
    });
  } catch (error) {
    next(error);
  }
}

export function category_breakdown(req, res, next) {
  try {
    const userID = req.session.user_id;
    if (!userID) {
      throw AppError.unauthorized("User session not found");
    }

    const { month, year } = req.query; // Already validated by Zod middleware
    const breakdown = get_category_breakdown(userID, month, year);

    res.status(200).json({
      message: "Category breakdown retrieved successfully",
      data: breakdown,
    });
  } catch (error) {
    next(error);
  }
}

export function monthly_breakdown_year(req, res, next) {
  try {
    const userID = req.session.user_id;
    if (!userID) {
      throw AppError.unauthorized("User session not found");
    }

    const breakdown = get_monthly_breakdown(userID);

    res.status(200).json({
      message: "Monthly breakdown retrieved successfully",
      data: breakdown,
    });
  } catch (error) {
    next(error);
  }
}
