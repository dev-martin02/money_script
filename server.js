import express from "express";
import categories_Router from "./routes/categories.js";
import transactions_Router from "./routes/transactions.js";
import user_Router from "./routes/user.js";
import auth_Router from "./routes/auth/auth.js";

const server = express();
const port = 3000;

server.use(express.json());

let current_user_id; /// assign an id for the current user which is using the app at the moment
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
