import express from "express";
import { retrieve_user } from "../../modules/user/user.js";

const auth_Router = express.Router();

auth_Router.route("/login").post(async (req, res) => {
  const response = await retrieve_user(req.body);
  console.log(response);
  res.status(201).json({ message: response });
});

export default auth_Router;
