import { withConnection, DatabaseError } from "../../shared/database.js";

class UserError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = "UserError";
    this.originalError = originalError;
  }
}

function validateUserInfo(userInfo) {
  const { name, email, password } = userInfo;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
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

    const { name, email, password } = user_info;
    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?);";

    return await withConnection(async (connection) => {
      const [result] = await connection.execute(query, [name, email, password]);
      return { success: true, userId: result.insertId };
    });
  } catch (error) {
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

    const query = `SELECT user_id, name, email FROM users WHERE email = ? AND password = ?`;

    return await withConnection(async (connection) => {
      const [result] = await connection.execute(query, [email, password]);
      if (result.length === 0) {
        throw new UserError("Invalid email or password");
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
export async function retrieve_user_by_id(user_id) {
  try {
    if (!user_id && typeof user_id === "number") {
      throw new UserError("Needs to have an user id");
    }

    const query = `SELECT name, email FROM users WHERE user_id = ?`;

    return await withConnection(async (connection) => {
      const [result] = await connection.execute(query, [user_id]);
      if (result.length === 0) {
        throw new UserError("User is don't exist!");
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
