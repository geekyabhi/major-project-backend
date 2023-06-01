const express = require("express");
const cors = require("cors");

const HandleErrors = require("./utils/error/error-handler");
const { customer, plan, purchase } = require("./api");
const { morgan } = require("./middlewere/index");

module.exports = async (app) => {
	app.use(morgan);
	app.use(express.json({ limit: "1mb" }));
	app.use(express.urlencoded({ extended: true, limit: "1mb" }));
	app.use(cors());

	app.use("/api/customer", customer());
	app.use("/api/plan", plan());

	app.get("/", (req, res) => {
		res.status(200).json({
			message: "Server running properly",
		});
	});

	app.use(HandleErrors);
};
