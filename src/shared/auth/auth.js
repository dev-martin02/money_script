import express from "express";
import { retrieve_user } from "../../features/user/user.js";

const auth_Router = express.Router();

auth_Router.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    const response = await retrieve_user({ email, password });

    if (response.length > 0) {
      const user = response[0];
      req.session.user_id = user.user_id;

      res.status(200).json({
        success: true,
        message: "Login successful! 🎉",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password. Please try again.",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({
      success: false,
      message:
        "Invalid email or password. Please check your credentials and try again.",
    });
  }
});

// Add logout route
auth_Router.route("/logout").post((req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({
        success: false,
        message: "Error during logout",
      });
    }
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });
});

export default auth_Router;
