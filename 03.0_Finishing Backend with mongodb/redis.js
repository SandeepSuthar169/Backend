import Redis from "ioredis";
const redis = new Redis(
    process.env.REDIS_URL || "redis://localhost:6379"
)

redis.on("connect", () => console.log("redis connected"))
redis.on("error", (err) => console.log("redis connection failed", err))

redis.connect();


export default redis