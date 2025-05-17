import { withConnection } from "../database.js";

export async function check_user(req, res, next) {
  const session = req.session;
  console.log(session);

  // Check if session and user_id exist
  if (!session || !session.user_id) {
    return res.status(401).json({
      message: "Please login to access this resource",
    });
  }

  try {
    const user = await withConnection(async (connection) => {
      const [rows] = await connection.execute(
        "SELECT user_id, name, email FROM users WHERE user_id = ?",
        [session.user_id]
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0];
    });

    if (user) {
      // Only attach necessary user data to the request
      req.user = {
        id: user.user_id,
        name: user.name,
        email: user.email,
      };
      session.user_id = user.user_id;

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
