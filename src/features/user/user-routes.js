import express from "express";
import { create_user } from "./user.js";
// import { create_user } from "../modules/user/user.js";

const user_Router = express.Router();

user_Router.route("/user").post(async (req, res) => {
  const response = await create_user(req.body);
  console.log(response);
  res.status(201).json({ message: response });
});

export default user_Router;
