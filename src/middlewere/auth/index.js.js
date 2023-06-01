const CustomerRepository = require("../../database/repository/customer-repository");
const { ValidateSignature } = require("../../utils/functions");
const { AuthorizationError } = require("../../utils/error/app-errors");

const auth = async (req, res, next) => {
	try {
		const isAuthorized = await ValidateSignature(req);
		const customerRepo = new CustomerRepository();
		const token = req.get("Authorization").split(" ")[1];
		const costumer = await customerRepo.FindCustomerById({ _id: req.user });
		if (costumer.tokens && !costumer.tokens.includes(token)) {
			throw new AuthorizationError("Token Expired Login in Again");
		}
		if (isAuthorized) return next();
	} catch (e) {
		next(e);
	}
};

module.exports = auth;
