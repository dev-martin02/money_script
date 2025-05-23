import { DatabaseError } from "../../shared/database.js";
import {
  ApiError,
  BadRequestError,
  NotFoundError,
} from "../../utils/errors/errors.js";
import { get_transactions_records } from "./transactions-db.js";
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
    const transaction_body = req.body;
    transaction_body["user_id"] = req.session.user_id;
    const transaction_arr = [transaction_body];

    if (transaction_arr.length === 0) {
      throw new BadRequestError("Transactions can't be an empty");
    }

    transaction_arr.forEach(validateTransactionFields);

    console.log(transaction_arr.length);
    const response = await add_transactions(transaction_arr);

    res.status(200).json({ message: response });
  } catch (error) {
    console.log("transactions error submitting the from:", error);
    res
      .status(500)
      .json({ message: "Problem on the server, please contact support" });
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

    const response = await get_transactions_records(id);
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
