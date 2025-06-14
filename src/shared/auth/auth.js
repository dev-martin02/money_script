import express from "express";
import {
  retrieve_user,
  retrieve_user_by_id,
} from "../../features/user/user.js";
import { check_user } from "../middleware/checkUser.js";
import { saveSession, removeSession, getSession } from "../../utils/cache.js";

const auth_Router = express.Router();

auth_Router.route("/login").post(async (req, res) => {
  //! When the server has too many connections, it would show a msg of 'wrong passwords', design a better error handling!!
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

      req.session.user_id = user.id;
      // Save session to cache
      await saveSession(req.session.id, {
        userId: user.id,
        email: user.email,
        username: user.username,
      });

      res.status(200).json({
        success: true,
        message: "Login successful! 🎉",
        user: {
          name: user.username,
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

auth_Router.route("/refresh").get(check_user, async (req, res) => {
  const sessionId = req.session.id;
  const cachedSession = await getSession(sessionId);
  if (!cachedSession) {
    return res.status(401).json({
      success: false,
      message: "Session not found",
    });
  }

  try {
    const response = await retrieve_user_by_id(cachedSession.userId);
    const user = response;

    req.session.user_id = response.userId;
    res.status(200).json({
      success: true,
      message: "Login successful! 🎉",
      user: {
        name: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

// Add logout route
auth_Router.route("/logout").post(async (req, res) => {
  // Remove session from cache
  await removeSession(req.session.id);

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
