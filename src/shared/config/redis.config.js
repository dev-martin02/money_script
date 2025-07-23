import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  url: `redis://localhost:6379/`,
});
// Connections events
redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.on("connect", () => {
  console.log("Redis Client Connected");
});

await redisClient.connect();

export { redisClient };
