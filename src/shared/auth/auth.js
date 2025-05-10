import express from "express";
import { retrieve_user } from "../../features/user/user.js";

const auth_Router = express.Router();

auth_Router.route("/login").post(async (req, res) => {
  const response = await retrieve_user(req.body);

  if (response.length > 0) {
    req.session.user_id = response[0].user_id;
    res.status(201).json({ message: "Login successful! 🎉", user: response });
  } else {
    res.status(401).json({ message: "Invalid email or password ❌" });
  }
});

export default auth_Router;
