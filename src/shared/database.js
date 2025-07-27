import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { DatabaseError } from "../utils/errors/errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, "..", "data", "database.sqlite");

let db = null;

export function getDatabase() {
  if (db) return db;

  try {
    db = new Database(dbPath);

    // Enable foreign keys
    db.pragma("foreign_keys = ON");

    // Initialize database schema if not exists
    initializeDatabase(db);

    return db;
  } catch (error) {
    throw new DatabaseError("Failed to establish database connection", error);
  }
}

function initializeDatabase(db) {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
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
    type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
    description TEXT,
    place TEXT,
    date DATETIME NOT NULL,
    notes TEXT,
    method TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

    -- Insert default categories if they don't exist
    INSERT OR IGNORE INTO categories (name, type) VALUES 
      ('Salary', 'income'),
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

  try {
    db.exec(schema);
  } catch (error) {
    throw new DatabaseError("Failed to initialize database schema", error);
  }
}

export function withConnection(operation) {
  try {
    const connection = getDatabase();
    return operation(connection);
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError("Database operation failed", error);
  }
}
