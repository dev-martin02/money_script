import { DB_connection } from "../database.js";

export async function check_user(req, res, next) {
  const session_id = req.session;

  // Check if session and user_id exist
  if (!session_id || !session_id.user_id) {
    console.log(session_id);

    console.log("No user session found.");

    return next(new Error("Please login!"));
  }

  let connection;
  try {
    connection = await DB_connection();
    const [rows] = await connection.execute(
      "SELECT user_id FROM users WHERE user_id = ?",
      [session_id.user_id]
    );

    if (rows.length > 0) {
      req.user = rows[0];
      console.log("User found in session:", rows[0]);
      return next();
    } else {
      console.log("User ID in session is invalid.");

      // Clear the invalid session data
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
        }
        res.status(401).json({ error: "Unauthorized" }); // Or redirect to login
      });
    }
  } catch (error) {
    console.error("Error in check_user middleware:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Ensure the database connection is released
    if (connection && typeof connection === "function") {
      try {
        await connection.release();
      } catch (releaseError) {
        console.error("Error releasing database connection:", releaseError);
      }
    }
  }
}
