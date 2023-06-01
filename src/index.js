const express = require("express");
let { PORT } = require("./config/index.js");
const { connect } = require("./database/connection/index.js");
const app = express();
require("colors");
require("dotenv").config({ path: "./config/.env" });

const expressEngine = require("./express-engine.js");

if (!PORT) PORT = 5000;

const StartServer = async () => {
	await connect();

	await expressEngine(app);

	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`.yellow);
	}).on("error", (err) => {
		process.exit();
	});
};

StartServer();
