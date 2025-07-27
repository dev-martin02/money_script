import { withConnection } from "../../shared/database.js";
import { DatabaseError, UserError } from "../../utils/errors/errors.js";

// TODO: Encrypt user passwords!!!
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
export function create_user(user_info) {
  try {
    validateUserInfo(user_info);

    const { username, email, password } = user_info;
    const query =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?);";

    return withConnection((connection) => {
      const result = connection.prepare(query).run(username, email, password);

      if (!result || result.changes === 0) {
        console.error("No changes made to database. Result:", result);
        throw new UserError("Failed to create user - no changes made");
      }
      return { success: true, userId: result.lastInsertRowid };
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
export function retrieve_user(user_info) {
  try {
    const { email, password } = user_info;

    if (!email || !password) {
      throw new UserError("Email and password are required");
    }

    const query = `SELECT id, username, email FROM users WHERE email = ? AND password = ?`;

    return withConnection((connection) => {
      const result = connection.prepare(query).get(email, password);
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

export function retrieve_user_by_id(id) {
  try {
    if (!id || typeof id !== "number") {
      throw new UserError("Valid user ID is required");
    }

    const query = `SELECT username, email FROM users WHERE id = ?`;

    return withConnection((connection) => {
      const result = connection.prepare(query).get(id);
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
export function delete_user(id) {
  try {
    if (!id || typeof id !== "number") {
      throw new UserError("Valid user ID is required");
    }

    const query = `DELETE FROM users WHERE id = ?`;

    return withConnection((connection) => {
      const result = connection.prepare(query).run(id);
      if (!result || result.changes === 0) {
        throw new UserError("Failed to delete user - no changes made");
      }
      return { success: true, userId: id };
    });
  } catch (error) {
    if (error instanceof UserError || error instanceof DatabaseError) {
      throw error;
    }
    throw new UserError("Failed to delete user", error);
  }
}
