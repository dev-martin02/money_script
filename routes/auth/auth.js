import express from "express";
import { retrieve_user } from "../../modules/user/user.js";

const auth_Router = express.Router();
// FIX THE USE OF COOKIE
auth_Router.route("/login").post(async (req, res) => {
  const response = await retrieve_user(req.body);
  console.log(response);
  if (response) {
    // !Change this for production
    res.cookie("userSession", "user-auth-token", {
      httpOnly: true,
      secure: false, // Set to FALSE for HTTP (development)
      sameSite: "lax", // "strict" breaks non-same-origin clients
      maxAge: 24 * 60 * 60 * 1000,
      path: "/", // Allow cookie on all routes
    });
    res.status(201).json({ message: "Login successful! 🎉", user: response });
  } else {
    res.status(401).send("Invalid email or password ❌");
  }
});

export default auth_Router;
