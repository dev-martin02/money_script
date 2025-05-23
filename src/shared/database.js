import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, "..", "data", "database.sqlite");

export class DatabaseError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = "DatabaseError";
    this.originalError = originalError;
  }
}

let db = null;

export async function DB_connection() {
  if (db) return db;

  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(
      dbPath,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        if (err) {
          reject(
            new DatabaseError("Failed to establish database connection", err)
          );
        } else {
          console.log("Database connection successful!");
          // Enable foreign keys
          db.run("PRAGMA foreign_keys = ON");
          // Initialize database schema if not exists
          initializeDatabase(db)
            .then(() => {
              // Promisify db methods we'll use
              db.runAsync = function (sql, params) {
                return new Promise((resolve, reject) => {
                  db.run(sql, params, function (err) {
                    if (err) reject(err);
                    else resolve(this); // 'this' contains lastID and changes
                  });
                });
              };
              db.allAsync = promisify(db.all).bind(db);
              db.getAsync = promisify(db.get).bind(db);
              resolve(db);
            })
            .catch(reject);
        }
      }
    );
  });
}

async function initializeDatabase(db) {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
      color TEXT NOT NULL,
      icon TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      description TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

   CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  category_id INTEGER,
  amount DECIMAL(10,2) NOT NULL,
  transaction_type TEXT CHECK(transaction_type IN ('income', 'expense')) NOT NULL,
  description TEXT,
  place TEXT,
  transaction_date DATETIME NOT NULL,
  notes TEXT,
  method TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

    -- Insert default categories if they don't exist
    INSERT OR IGNORE INTO categories (name, type) VALUES 
      ('Salary', 'income'),
      ('Freelance', 'income'),
      ('Investments', 'income'),
      ('Other Income', 'income'),
      ('Housing', 'expense'),
      ('Transportation', 'expense'),
      ('Food', 'expense'),
      ('Utilities', 'expense'),
      ('Healthcare', 'expense'),
      ('Entertainment', 'expense'),
      ('Shopping', 'expense'),
      ('Other Expenses', 'expense');
  `;

  return new Promise((resolve, reject) => {
    db.exec(schema, (err) => {
      if (err)
        reject(new DatabaseError("Failed to initialize database schema", err));
      else resolve();
    });
  });
}

export async function withConnection(operation) {
  try {
    console.log("Getting database connection...");
    const connection = await DB_connection();
    console.log("Database connection obtained, executing operation...");
    const result = await operation(connection);
    console.log("Operation completed successfully");
    return result;
  } catch (error) {
    console.error("Database operation error:", error);
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError("Database operation failed", error);
  }
}
