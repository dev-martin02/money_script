import { available_money_monthly } from "../../../utils/helpers.js";
import { pdf_maker } from "../../../utils/pdf-maker.js";
import { month_planner } from "./planning/planner.js";

const user_expenses = [
  {
    name: "gym membership",
    cost: 30,
    frequency: "monthly",
    dueDate: 3,
  },
  {
    name: "electric bill",
    cost: 120,
    frequency: "monthly",
    dueDate: 12,
  },
  {
    name: "netflix",
    cost: 15,
    frequency: "monthly",
    dueDate: 18,
  },
  {
    name: "groceries",
    cost: 100,
    frequency: "weekly",
    dueDate: "saturday",
  },
  {
    name: "laundry",
    cost: 25,
    frequency: "bi-weekly",
    dueDate: "tuesday",
  },
  {
    name: "amazon prime",
    cost: 14,
    frequency: "monthly",
    dueDate: 25,
  },
  {
    name: "student loan",
    cost: 200,
    frequency: "monthly",
    dueDate: 28,
  },
  {
    name: "water bill",
    cost: 50,
    frequency: "monthly",
    dueDate: 10,
  },
  {
    name: "apple music",
    cost: 11,
    frequency: "monthly",
    dueDate: 22,
  },
];
const user_paycheck = 1000;

export function create_budgeting_plan(params) {
  // PARAMS -> EXPENSES LIST, USER INCOME (PAY CHECK)
  // user_expenses -> list of json array
  const month_plan = month_planner(user_expenses);

  const money_left = available_money_monthly(user_expenses, user_paycheck);
  pdf_maker(month_plan, money_left);
}

create_budgeting_plan();
