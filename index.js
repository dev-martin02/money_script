import { available_money_monthly } from "./modules/debt/financialCalculations.js";
import { month_planner } from "./modules/planning/planner.js";
import { pdf_maker } from "./utils/pdf-maker.js";
// Get the user income
const user_pay_check = 1000 * 2;

// Get the user expenses
const user_expenses = [
  { name: "rent", cost: 500, frequency: "monthly", dueDate: 1 },
  { name: "car", cost: 178, frequency: "bi-weekly", dueDate: "wednesday" },
  { name: "car insurance", cost: 311, frequency: "monthly", dueDate: 15 },
  { name: "gas", cost: 40, frequency: "weekly", dueDate: "monday" },
  { name: "haircut", cost: 40, frequency: "bi-weekly", dueDate: "friday" },
  { name: "phone_bill", cost: 45, frequency: "monthly", dueDate: 5 },
  { name: "internet", cost: 70, frequency: "monthly", dueDate: 1 },
  { name: "spotify", cost: 12, frequency: "monthly", dueDate: 20 },
  { name: "blink fitness", cost: 25, frequency: "monthly", dueDate: 16 },
];
// Get the user current debt, break down all the debt
const user_debt = [
  { name: "chase_credit_card", amount: 2600, type: "credit_card" },
  { name: "apple_credit_card", amount: 190, type: "credit_card" },
  { name: "amazon_credit_card", amount: 250, type: "credit_card" },
  { name: "car_loan", amount: 11000, type: "loan" },
];

// map of user expenses
const user_month_planner = month_planner(user_expenses);
const remaining_money = available_money_monthly(user_expenses, user_pay_check);

pdf_maker(user_month_planner, remaining_money);
