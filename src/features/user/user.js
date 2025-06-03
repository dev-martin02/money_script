import { withConnection, DatabaseError } from "../../shared/database.js";

class UserError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = "UserError";
    this.originalError = originalError;
  }
}
// TODO: Encryp user passwords!!!
function validateUserInfo(userInfo) {
  const { username, email, password } = userInfo;
  if (
    !username ||
    typeof username !== "string" ||
    username.trim().length === 0
  ) {
    throw new UserError("Name is required and must be a non-empty string");
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    throw new UserError("Valid email is required");
  }

  if (!password || typeof password !== "string" || password.length < 4) {
    throw new UserError("Password must be at least 4 characters long");
  }
}

// Create user
export async function create_user(user_info) {
  try {
    validateUserInfo(user_info);

    const { username, email, password } = user_info;
    const query =
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?);";

    return await withConnection(async (connection) => {
      const result = await connection.runAsync(query, [
        username,
        email,
        password,
      ]);
      console.log("SQLite result:", result);

      if (!result || result.changes === 0) {
        console.error("No changes made to database. Result:", result);
        throw new UserError("Failed to create user - no changes made");
      }
      return { success: true, userId: result.lastID };
    });
  } catch (error) {
    console.error("Error in create_user:", error);
    if (error instanceof UserError || error instanceof DatabaseError) {
      throw error;
    }
    throw new UserError("Failed to create user", error);
  }
}

// Retrieve user
export async function retrieve_user(user_info) {
  try {
    const { email, password } = user_info;

    if (!email || !password) {
      throw new UserError("Email and password are required");
    }

    const query = `SELECT id, username, email FROM users WHERE email = ? AND password_hash = ?`;

    return await withConnection(async (connection) => {
      const result = await connection.getAsync(query, [email, password]);
      if (!result) {
        throw new UserError("Invalid email or password");
      }
      return [result];
    });
  } catch (error) {
    if (error instanceof UserError || error instanceof DatabaseError) {
      throw error;
    }
    throw new UserError("Failed to retrieve user", error);
  }
}

export async function retrieve_user_by_id(id) {
  try {
    if (!id || typeof id !== "number") {
      throw new UserError("Valid user ID is required");
    }

    const query = `SELECT username, email FROM users WHERE id = ?`;

    return await withConnection(async (connection) => {
      const result = await connection.getAsync(query, [id]);
      if (!result) {
        throw new UserError("User does not exist!");
      }
      return result;
    });
  } catch (error) {
    if (error instanceof UserError || error instanceof DatabaseError) {
      throw error;
    }
    throw new UserError("Failed to retrieve user", error);
  }
}

// Update user
// Delete user
