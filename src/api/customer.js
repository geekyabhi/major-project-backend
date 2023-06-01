const { auth } = require("../middlewere/index");
const { CustomerService } = require("../services");
const { sendMessage } = require("../utils/sms");
const router = require("express").Router();

module.exports = () => {
	const service = new CustomerService();

	router.post("/", async (req, res, next) => {
		try {
			const { name, email, phone, password } = req.body;
			const data = await service.Register({
				name,
				email,
				phone,
				password,
			});
			return res.json(data);
		} catch (e) {
			next(e);
		}
	});

	router.post("/login", async (req, res, next) => {
		try {
			const { phone, password } = req.body;
			const data = await service.Login({ phone, password });
			return res.json(data);
		} catch (e) {
			next(e);
		}
	});

	router.get("/", auth, async (req, res, next) => {
		try {
			const { _id } = req.user;
			const data = await service.FindById({ _id });
			return res.json(data);
		} catch (e) {
			next(e);
		}
	});

	router.put("/", auth, async (req, res, next) => {
		try {
			const { _id } = req.user;
			const { name, email, password, phone } = req.body;
			const data = await service.Update({
				_id,
				name,
				email,
				phone,
				password,
			});
			return res.json(data);
		} catch (e) {
			next(e);
		}
	});

	router.delete("/logout", auth, async (req, res, next) => {
		try {
			const { all } = req.query;
			const token = req.get("Authorization").split(" ")[1];
			const data = await service.Logout({
				_id: req.user,
				token,
				all: all,
			});
			return res.json({ message: "Successfully logged out" });
		} catch (e) {
			next(e);
		}
	});

	router.post("/otp-send", async (req, res, next) => {
		try {
			const { phone } = req.body;
			await service.SendOTP({ phone });
			return res.json({ message: "OTP send" });
		} catch (e) {
			next(e);
		}
	});

	return router;
};
