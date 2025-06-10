import express from "express";
import { create_user } from "./user.js";

const user_Router = express.Router();

user_Router.route("/register").post(async (req, res) => {
  const response = await create_user(req.body);
  res.status(201).json({ message: response });
});

user_Router.route("/delete").delete(async (req, res) => {
  const response = await delete_user(req.body.id);
  res.status(200).json({ message: response });
});

export default user_Router;
