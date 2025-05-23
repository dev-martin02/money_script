import fs from "fs/promises";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "src", "utils", "sessions.json");

// Initialize cache file if it doesn't exist
async function initializeCache() {
  try {
    await fs.access(CACHE_FILE);
  } catch {
    await fs.writeFile(CACHE_FILE, JSON.stringify({ sessions: {} }));
  }
}

/**
 * Save session data to the cache file
 * @param {string} sessionId - The session ID
 * @param {Object} sessionData - The session data to store
 */
export async function saveSession(sessionId, sessionData) {
  try {
    await initializeCache();
    const cache = JSON.parse(await fs.readFile(CACHE_FILE, "utf-8"));

    cache.sessions[sessionId] = sessionData;
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error("Error saving session to cache:", error);
  }
}

/**
 * Get session data from the cache file
 * @param {string} sessionId - The session ID to retrieve
 * @returns {Object|null} The session data or null if not found
 */
export async function getSession() {
  try {
    await initializeCache();
    const cache = await JSON.parse(await fs.readFile(CACHE_FILE, "utf-8"));

    const session = cache.sessions;
    const user = session["om6ULnZ8mKgoLbsSh8xBgVPmX1y5bXPW"];

    return user;
  } catch (error) {
    console.error("Error reading session from cache:", error);
    return null;
  }
}

/**
 * Remove session from the cache file
 * @param {string} sessionId - The session ID to remove
 */
export async function removeSession(sessionId) {
  try {
    await initializeCache();
    const cache = JSON.parse(await fs.readFile(CACHE_FILE, "utf-8"));
    delete cache.sessions[sessionId];
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error("Error removing session from cache:", error);
  }
}
