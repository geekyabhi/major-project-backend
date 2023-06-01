const mongoose = require("mongoose");
const { DB_URL } = require("../../config");

const connect = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { connection } = await mongoose.connect(DB_URL);
      console.log(
        `Database connected on port ${connection.port} on host ${connection.host}`
          .cyan
      );
      resolve("Database connected");
    } catch (e) {
      console.log(e);
      reject("DB error while connecting");
    }
  });
};

module.exports = { connect };
