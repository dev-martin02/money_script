import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import transactions_Router from "./features/transactions/transactions-routes.js";
import categories_Router from "./features/category/categories-routes.js";
import auth_Router from "./shared/auth/auth.js";
import user_Router from "./features/user/user-routes.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:8080", // Replace with your frontend origin
    credentials: true,
  })
);

// Session configuration
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Routes
// USER
app.use(user_Router);
// CATEGORY
app.use(categories_Router);
// TRANSACTION
app.use(transactions_Router);
// auth
app.use(auth_Router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal Server Error",
    details: err.details,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
