import express from "express";
import { retrieve_user } from "../../modules/user/user.js";

const auth_Router = express.Router();
// FIX THE USE OF COOKIE
auth_Router.route("/login").post(async (req, res) => {
  const response = await retrieve_user(req.body);
  console.log(response);
  if (response) {
    // !Change this for production
    res.cookie("myCookie", "myValue", {
      httpOnly: true, // Prevent JavaScript access
      secure: false, // change this
      sameSite: "strict", // Prevent cross-site usage
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    res.status(201).json({ message: "Login successful! 🎉", user: response });
  } else {
    res.status(401).send("Invalid email or password ❌");
  }
});

export default auth_Router;
