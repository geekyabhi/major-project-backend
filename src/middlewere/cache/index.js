// const redis = require("redis");
// require("dotenv").config({ path: "./config/.env" });

// let REDIS_CRED = {
// 	host: process.env.REDIS_HOST,
// 	port: process.env.REDIS_PORT,
// 	password: process.env.REDIS_PASSWORD,
// };

// if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
// 	REDIS_CRED = "redis://127.0.0.1:6379";
// }

// const redisClient = redis.createClient(REDIS_CRED);

// const connectRedis = async () => {
// 	try {
// 		// await redisClient.connect();
// 		console.log(`Redis connected to port `.magenta);
// 	} catch (e) {
// 		console.log(REDIS_CRED);
// 		console.log(e);
// 		console.log(`Error while connecting redis ${e}`.red);
// 	}
// };

// module.exports = { redisClient, connectRedis };
