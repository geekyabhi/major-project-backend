const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const config = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  APP_SECRET: process.env.APP_SECRET,
  FAST2SMS: process.env.FAST2SMS,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  NODE_ENV: process.env.NODE_ENV,
  RAZORPAY_API_KEY: process.env.RAZORPAY_API_KEY,
  RAZORPAY_API_SECRET: process.env.RAZORPAY_API_SECRET,
};

module.exports = config;
