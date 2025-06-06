import { DatabaseError } from "../../shared/database.js";
import {
  ApiError,
  BadRequestError,
  NotFoundError,
} from "../../utils/errors/errors.js";
import {
  month_summary,
  get_transactions_records,
  get_category_breakdown,
} from "./transactions-db.js";
import { add_transactions } from "./transactions-services.js";

function validateTransactionFields(transaction) {
  const requiredFields = [
    "user_id",
    "transaction_date",
    "amount",
    "transaction_type",
    "category_id",
    "method",
  ];

  for (const field of requiredFields) {
    if (!transaction[field]) {
      throw new BadRequestError(`Missing required field: ${field}`);
    }
  }

  transaction.amount = Number(transaction.amount); // modify the string to be a number

  if (typeof transaction.amount !== "number" || isNaN(transaction.amount)) {
    throw new BadRequestError("Amount must be a valid number");
  }

  if (!["income", "expense"].includes(transaction.transaction_type)) {
    throw new BadRequestError(
      "Transaction type must be either income or expense"
    );
  }
}

export async function submit_transaction(req, res) {
  try {
    const transactions = Array.isArray(req.body) ? req.body : [req.body];

    // Add user_id to each transaction
    const transactions_with_user = transactions.map((transaction) => ({
      ...transaction,
      user_id: req.session.user_id || 1,
    }));

    if (transactions_with_user.length === 0) {
      throw new BadRequestError("Transactions can't be empty");
    }

    transactions_with_user.forEach(validateTransactionFields);

    const response = await add_transactions(transactions_with_user);

    res.status(200).json({ message: response });
  } catch (error) {
    res.status(402).json({
      error: "Problem on the server, please contact support",
      details: error.message,
    });
  }
}

export async function get_transactions(req, res) {
  try {
    const id = req.session.user_id;
    if (!id) {
      throw new BadRequestError("User ID is required");
    }
    if (typeof id !== "number" && isNaN(id)) {
      throw new NotFoundError("Invalid User ID");
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const response = await get_transactions_records(id, page, limit);
    res.status(200).json({ message: response });
  } catch (error) {
    if (
      error instanceof BadRequestError ||
      error instanceof DatabaseError ||
      error instanceof NotFoundError
    ) {
      throw error;
    }
    throw new ApiError("Failed to retrieve transactions", error);
  }
}

export async function get_month_summary(req, res) {
  const id = req.session.user_id;
  if (!id) {
    throw new BadRequestError("User ID is required");
  }
  if (typeof id !== "number" && isNaN(id)) {
    throw new NotFoundError("Invalid User ID");
  }

  try {
    const response = await month_summary(id);
    res.status(200).json({ message: response });
  } catch (error) {
    if (
      error instanceof BadRequestError ||
      error instanceof DatabaseError ||
      error instanceof NotFoundError
    ) {
      throw error;
    }
    throw new ApiError("Failed to retrieve transactions", error);
  }
}

export async function monthly_breakdown_yearly(req, res) {
  try {
    const userId = req.session.user_id;
    const data = console.log("surrrpriseeeee");
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching monthly breakdown:", error);
    res.status(500).json({
      error: "Problem on the server, please contact support",
      details: error.message,
    });
  }
}

export async function category_breakdown(req, res) {
  try {
    const userId = req.session.user_id;
    const { month, year } = req.query; // These will be strings or undefined

    const monthNum = month ? parseInt(month, 10) : null;
    const yearNum = year ? parseInt(year, 10) : null;

    const data = await get_category_breakdown(userId, monthNum, yearNum);
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching category breakdown:", error);
    res.status(500).json({
      error: "Problem on the server, please contact support",
      details: error.message,
    });
  }
}
