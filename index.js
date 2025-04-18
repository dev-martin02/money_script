import { available_money_monthly } from "./modules/debt/financialCalculations.js";
import { month_planner } from "./modules/planning/planner.js";
import { pdf_maker } from "./utils/pdf-maker.js";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import fs from "node:fs";

// Ask user for input using readline/promises
async function ask_question(text) {
  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(text);
  rl.close();
  return answer;
}

// Read all lines from the user's expense file
async function getFileLines(filePath) {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
  });

  // rl has an event called 'lines' this event wont trigger the event 'end' once is finish, causing us to write it manually which will make the code more verbose.
  // Best purpose is use a loop
  const lines = [];
  for await (const line of rl) {
    if (line.trim()) {
      lines.push(line.trim());
      console.log(`Received: ${line}`);
    }
  }
  return lines;
}

// Ask user for income, frequency, and file name, then get expense lines
async function collect_info() {
  let user_income, frequency, expenses_file;

  while (isNaN(Number(user_income))) {
    user_income = await ask_question(
      "How much money do you usually get paid? $"
    );
  }

  while (isNaN(Number(frequency))) {
    frequency = await ask_question(
      "How many times in a month do you get paid? (only numbers): "
    );
  }

  while (!expenses_file) {
    expenses_file = await ask_question(
      "What is the name of the file with all your expenses?: "
    );
  }

  const file_path = `user-expenses/${expenses_file}.txt`;

  if (!fs.existsSync(file_path)) {
    console.error(
      "🚨 File not found. Please make sure the file exists in user-expenses/"
    );
    return;
  }

  const expenseLines = await getFileLines(file_path);

  console.log("\n✅ Summary:");
  console.log(`Income: $${user_income}`);
  console.log(`Pay Frequency: ${frequency} times/month`);
  console.log("Expenses from file:");
  console.log(expenseLines);
}

collect_info();
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

// pdf_maker(user_month_planner, remaining_money);
