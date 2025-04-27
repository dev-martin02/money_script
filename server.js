// Packages
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

// Routes
import categories_Router from "./routes/categories.js";
import transactions_Router from "./routes/transactions.js";
import user_Router from "./routes/user.js";
import auth_Router from "./routes/auth/auth.js";

const server = express();
const port = 3000;

server.use(cookieParser());
// Configure sessions (stores session ID in cookie)
server.use(
  session({
    // by default everything is store in memory, try to use something like redis
    secret: "your-secret-key", // Sign the cookie (use a long, random string)
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to `true` if using HTTPS (always in production)
      httpOnly: true, // Block JavaScript access
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "strict", // Prevent CSRF
    },
  })
);
server.use(express.json());

// USER
server.use(user_Router);
// CATEGORY
server.use(categories_Router);
// TRANSACTION
server.use(transactions_Router);
// auth
server.use(auth_Router);

server.listen(port, () => {
  console.log("the server is running in port 3000");
});
