const { PlanService } = require("../services");

const router = require("express").Router();

module.exports = () => {
	const service = new PlanService();
	router.post("/", async (req, res, next) => {
		try {
			const { machine, name } = req.body;
			const data = await service.CreateMachine({ machine, name });
			return res.send(data);
		} catch (e) {
			next(e);
		}
	});

	return router;
};
