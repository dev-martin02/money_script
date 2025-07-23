import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { RedisStore } from "connect-redis";
dotenv.config();

// Routes
import transactions_Router from "./features/transactions/transactions-routes.js";
import categories_Router from "./features/category/categories-routes.js";
import auth_Router from "./shared/auth/auth.js";
import user_Router from "./features/user/user-routes.js";
import { redisClient } from "./shared/config/redis.config.js";

process.noDeprecation = true;

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

// Session configuration
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "process.env.SESSION_SECRET",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // true in production
      httpOnly: true,
      maxAge: parseInt(process.env.SESSION_EXPIRATION) || 24 * 60 * 60 * 1000,
      sameSite: "strict", // Helps prevent CSRF attacks
    },
  })
);

// Routes
app.use(user_Router);
app.use(categories_Router);
app.use(transactions_Router);
app.use(auth_Router);

// Error handling middleware ???
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
