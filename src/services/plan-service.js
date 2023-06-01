const { ContainerRepository } = require("../database/repository");
const { APIError } = require("../utils/error/app-errors");
const { FormateData } = require("../utils/functions");
class PlanService {
	constructor() {
		this.repository = new ContainerRepository();
	}
	async CreateMachine({ machine, name }) {
		try {
			const port = await this.repository.FindNextPort({ machine, name });
			console.log(port);
			const data = await this.repository.CreateContainer({
				machine,
				name,
				port,
			});
			return FormateData(data);
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}
}

module.exports = PlanService;
