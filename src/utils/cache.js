import { redisClient } from "../shared/config/redis.config.js";

/**
 * Save session data to Redis
 * @param {string} sessionId - The session ID
 * @param {Object} sessionData - The session data to store
 */
export async function saveSession(sessionId, sessionData) {
  try {
    // Store session data with 24 hour expiration
    await redisClient.set(`session:${sessionId}`, JSON.stringify(sessionData), {
      EX: 86400, // 24 hours in seconds
    });
  } catch (error) {
    console.error("Error saving session to Redis:", error);
  }
}

/**
 * Get session data from Redis
 * @param {string} sessionId - The session ID to retrieve
 * @returns {Object|null} The session data or null if not found
 */
export async function getSession(sessionId) {
  try {
    const sessionData = await redisClient.get(`session:${sessionId}`);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    console.error("Error reading session from Redis:", error);
    return null;
  }
}

/**
 * Remove session from Redis
 * @param {string} sessionId - The session ID to remove
 */
export async function removeSession(sessionId) {
  try {
    await redisClient.del(`session:${sessionId}`);
  } catch (error) {
    console.error("Error removing session from Redis:", error);
  }
}
