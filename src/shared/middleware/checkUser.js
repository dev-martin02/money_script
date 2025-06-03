import { withConnection } from "../database.js";
import { getSession } from "../../utils/cache.js";

export async function check_user(req, res, next) {
  const sessionId = req.session.id;

  // Get session from cache
  const cachedSession = await getSession(sessionId);

  // Check if session exists in cache
  if (!cachedSession) {
    return res.status(401).json({
      message: "Please login to access this resource",
    });
  }

  req.session.user_id = cachedSession.userId;

  try {
    const user = await withConnection(async (connection) => {
      const result = await connection.getAsync(
        "SELECT id as id, username as name, email FROM users WHERE id = ?",
        [cachedSession.userId]
      );

      if (!result) {
        return null;
      }

      return result;
    });

    if (user) {
      // Only attach necessary user data to the request
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      return next();
    }

    // Clear the invalid session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      res.status(401).json({
        message: "Your session is invalid. Please login again.",
      });
    });
  } catch (error) {
    console.error("Error in check_user middleware:", error);
    res.status(500).json({
      message: "An error occurred while verifying your session",
    });
  }
}
