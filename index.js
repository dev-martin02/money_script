import { available_money_monthly } from "./modules/debt/financialCalculations.js";
import { month_planner } from "./modules/planning/planner.js";
import { pdf_maker } from "./utils/pdf-maker.js";
import { parse_expense } from "./utils/helpers.js";
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
  let user_income, frequency, expenses_file, file_path;
  const paycheck_info = {};

  while (isNaN(Number(user_income))) {
    user_income = await ask_question(
      "How much money do you usually get paid? $"
    );
    if (user_income) {
      paycheck_info["paycheck_amount"] = user_income;
    }
  }

  while (isNaN(Number(frequency))) {
    frequency = await ask_question(
      "How many times in a month do you get paid? (only numbers): "
    );

    if (frequency) {
      paycheck_info["monthly_frequency"] = frequency;
    }
  }

  while (true) {
    expenses_file = await ask_question(
      "What is the name of the file with all your expenses?: "
    );
    file_path = `user-expenses/${expenses_file}.txt`;

    if (fs.existsSync(file_path)) {
      break;
    } else {
      console.error(
        "🚨 File not found. Please make sure the file exists in user-expenses/"
      );
    }
  }

  const expenseLines = await getFileLines(file_path);

  console.log("\n✅ Summary:");
  const expenses_arr = expenseLines.map((lines) => parse_expense(lines));
  expenses_arr.push(paycheck_info);

  return expenses_arr;
}

const user_expenses = await collect_info();

const user_month_planner = month_planner(user_expenses);
const { paycheck_amount } = user_expenses[user_expenses.length - 1];

const remaining_money = available_money_monthly(user_expenses, paycheck_amount);

pdf_maker(user_month_planner, remaining_money); // Will create a plan for the month
