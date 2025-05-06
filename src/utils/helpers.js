// rEAD files with X format to get expenses
export function parse_expense(text) {
  const fields = text.split(",").map((item) => item.trim());

  const expense = {};

  for (const field of fields) {
    const [rawKey, rawValue] = field.split(": ").map((str) => str.trim());

    let value;
    switch (rawKey) {
      case "cost":
        value = parseFloat(rawValue.replace("$", ""));
        break;
      case "dueDate":
        value = parseInt(rawValue);
        if (isNaN(value)) {
          value = rawValue;
        }
        break;
      default:
        value = rawValue;
    }

    expense[rawKey] = value;
  }

  return expense;
}

// User money after all expenses
export function available_money_monthly(user_expenses, user_pay_check) {
  let total_expenses_sum = 0;
  user_expenses.forEach((bill) => {
    if (!bill)
      if (bill.frequency === "bi-weekly") {
        total_expenses_sum += bill.cost * 2;
      } else if (bill.frequency === "weekly") {
        total_expenses_sum += bill.cost * 4;
      }
  });

  const after_expenses = user_pay_check - total_expenses_sum;

  return after_expenses;
}
