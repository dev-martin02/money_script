import express from "express";
import { create_user, delete_user } from "./user.js";
import { check_user } from "../../shared/middleware/checkUser.js";

const user_Router = express.Router();

user_Router.route("/users/register").post(async (req, res) => {
  const response = await create_user(req.body);
  res.status(201).json({ message: response });
});

user_Router
  .route("/users/delete")
  .all(check_user)
  .delete(async (req, res) => {
    console.log(req.session);
    const id = req.session.user_id;
    console.log(id);
    const response = await delete_user(req.session.user_id);
    res.status(200).json({ message: response });
  });

export default user_Router;
