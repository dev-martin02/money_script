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

import fs from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import path from "node:path";

const transactions_Router = express.Router();

transactions_Router
  .route("/transactions")
  .all(check_user)
  .get(get_transactions)
  .post(submit_transaction);

transactions_Router
  .route("/transactions/category")
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

transactions_Router
  .route("/transactions/upload")
  .all(check_user)
  .post(async (req, res) => {
    const file = req.headers.filename;
    const extensionPoint = file.indexOf(".");

    const name = file.slice(0, extensionPoint);
    const extensionType = file.slice(extensionPoint + 1);

    const videoId = crypto.randomUUID();

    const storagePath = "./src/data/storage";
    try {
      await fs.mkdir(`${storagePath}/${videoId}`, { recursive: true });
      const fullPath = `${storagePath}/${videoId}/${file}`;
      const originalPath = path.resolve(fullPath);
      const writeStream = createWriteStream(fullPath);

      await pipeline(req, writeStream);

      console.log("File uploaded successfully");

      console.log("About to spawn Python script...");

      const pythonProcess = spawn("python", [
        "./src/utils/python/fileParser/parser.py",
        originalPath,
      ]);

      console.log("Python process spawned:", pythonProcess.pid);

      pythonProcess.stdout.on("data", (data) => {
        console.log("Python output:", data.toString());
      });

      pythonProcess.stderr.on("data", (data) => {
        console.log("Python error:", data.toString());
      });
      pythonProcess.on("error", (error) => {
        console.log("Failed to start Python process:", error);
      });

      pythonProcess.on("exit", (code) => {
        console.log("Python process exited with code:", code);
      });
      res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
      console.log(error);
    }
  });

export default transactions_Router;
