const { CustomerModel } = require("../models/index");
const {
	APIError,
	BadRequestError,
	STATUS_CODES,
} = require("../../utils/error/app-errors");

class CustomerRepository {
	async CreaterCustomer({
		email,
		password,
		phone,
		salt,
		name,
		token,
		tokens,
		plans,
	}) {
		if (!tokens) tokens = [];
		if (!plans) plans = [];
		try {
			const costumer = new CustomerModel({
				name: name,
				email: email,
				phone: phone,
				password: password,
				token: token,
				tokens: tokens,
				plans: plans,
				salt: salt,
			});
			const customerResult = await costumer.save();

			return customerResult;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Create Customer ${e}`
			);
		}
	}

	async FindCustomer({ email, phone, name }) {
		try {
			let search = {
				email: email,
				phone: phone,
				name: name,
			};
			if (!email) delete search.email;
			if (!phone) delete search.phone;
			if (!name) delete search.name;
			const customerResult = await CustomerModel.find(search);
			return customerResult;
		} catch (e) {
			throw APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Find Customer ${e}`
			);
		}
	}

	async FindCustomerById({ _id }) {
		try {
			const customerResult = await CustomerModel.findById(_id).populate([
				{
					path: "plans",
					populate: [
						{
							path: "plan",
							select: " -customers -updatedAt -createdAt",
						},
					],
				},
			]);
			return customerResult;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Find Customer ${e}`
			);
		}
	}

	async FindOneCustomer({ phone }) {
		try {
			const customerResult = await CustomerModel.findOne({ phone });
			return customerResult;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Find Customer ${e}`
			);
		}
	}

	async UpdateCustomer({
		email,
		password,
		phone,
		salt,
		name,
		token,
		tokens,
		plans,
		_id,
	}) {
		try {
			const customer = await CustomerModel.findById(_id);
			let tokensArr = [];
			if (tokens) tokensArr = [...tokens];
			tokensArr = [...customer.tokens];

			let planArr = [];
			if (plans) planArr = [...plans];
			planArr = [...customer.plans];

			customer.name = name || customer.name;
			customer.email = email || customer.email;
			customer.phone = phone || customer.phone;
			customer.salt = salt || customer.salt;
			customer.password = password || customer.password;
			customer.token = token || customer.token;
			customer.tokens = tokens;
			customer.plans = planArr;

			const newCustomer = await customer.save();
			return newCustomer;
		} catch (e) {
			throw new APIError(
				"API error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Update Customer ${e}`
			);
		}
	}

	async DeleteCustomer({ _id }) {
		try {
			const customerResult = await CustomerModel.findById(_id);
			await customerResult.remove();
			return customerResult;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Delete Customer ${e}`
			);
		}
	}
	// planId,
	// 			started: currDate,
	// 			activeTill: new Date(moment(currDate).add(plan.period, "M")),
	// 			customerId,
	async AddPlantoCustomer({ planId, customerId, started, activeTill }) {
		try {
			const customer = await CustomerModel.findById(customerId);
			const plans = customer.plans;
			plans.push({
				plan: planId,
				started,
				activeTill,
			});
			const updatedCustomer = await customer.save();
			return updatedCustomer;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Add Plan to Customer ${e}`
			);
		}
	}
}

module.exports = CustomerRepository;
