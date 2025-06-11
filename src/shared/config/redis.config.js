import { createClient } from "redis";
import { promisify } from "node:util";
import dotenv from "dotenv";

dotenv.config();

// const redisClient = createClient({
//   url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
//   password: process.env.REDIS_PASSWORD || undefined,
// });
const redisClient = createClient({
  url: `redis://localhost:6379/`,
});
// Connections events
redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.on("connect", () => {
  console.log(1);
  console.log("Redis Client Connected");
});

await redisClient.connect();

export { redisClient };
