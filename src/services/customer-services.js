const CustomerRepository = require("../database/repository/customer-repository");
const {
	FormateData,
	GeneratePassword,
	GenerateSalt,
	GenerateSignature,
	ValidatePassword,
	GenerateOTP,
} = require("../utils/functions");
const { APIError, BadRequestError } = require("../utils/error/app-errors");
const { sendMessage } = require("../utils/sms");

class CustomerService {
	constructor() {
		this.repository = new CustomerRepository();
	}
	async Register(inputs) {
		const { name, email, password, phone } = inputs;
		try {
			const salt = await GenerateSalt();
			const userPassword = await GeneratePassword(password, salt);

			const existingCustomer = await this.repository.FindCustomer({
				phone,
			});

			if (existingCustomer.length > 0) {
				throw new BadRequestError("This Number Already exist");
			}

			const customer = await this.repository.CreaterCustomer({
				name,
				email,
				password: userPassword,
				salt: salt,
				phone,
			});

			const token = await GenerateSignature({
				phone: phone,
				_id: customer._id,
			});
			const tokens = [];
			tokens.push(token);
			const newCustomer = await this.repository.UpdateCustomer({
				token,
				tokens,
				_id: customer._id,
			});

			return FormateData({
				_id: newCustomer._id,
				name: newCustomer.name,
				email: newCustomer.email,
				phone: newCustomer.phone,
				token: newCustomer.token,
				tokens: newCustomer.tokens,
				plans: newCustomer.plans,
			});
		} catch (e) {
			throw new APIError(e, e.statusCode);
		}
	}

	async Login(inputs) {
		const { phone, password } = inputs;
		try {
			const customer = await this.repository.FindOneCustomer({ phone });
			if (!customer) throw new Error("Wrong number or password");
			const validPassword = await ValidatePassword(
				password,
				customer.password,
				customer.salt
			);
			if (!validPassword) throw new Error("Wrong number or password");
			const token = await GenerateSignature({
				phone: phone,
				_id: customer._id,
			});

			const tokens = customer.tokens;
			tokens.push(token);
			const newCustomer = await this.repository.UpdateCustomer({
				token,
				tokens,
				_id: customer._id,
			});

			return FormateData({
				_id: newCustomer._id,
				token: newCustomer.token,
				name: newCustomer.name,
				email: newCustomer.email,
				tokens: newCustomer.tokens,
				plans: newCustomer.plans,
			});
		} catch (e) {
			throw new APIError(e);
		}
	}

	async Find(inputs) {
		const { email, phone, name } = inputs;
		try {
			const customer = await this.repository.FindCustomer({
				email,
				phone,
				name,
			});
			return FormateData(customer);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async FindById(inputs) {
		const { _id } = inputs;
		try {
			const customer = await this.repository.FindCustomerById({ _id });
			return FormateData(customer);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async Update(inputs) {
		let { _id, name, email, phone, password, plans } = inputs;

		try {
			let hashedPassword;
			const customer = await this.repository.FindCustomerById({ _id });
			name = name || customer.name;
			email = email || customer.email;
			let token = customer.token;
			let tokens = customer.tokens || [];

			let plansArr = customer.plans;

			if (plans) {
				plansArr = plansArr.concat(plans);
			}

			if (phone) {
				const existingCustomer = await this.repository.FindOneCustomer({
					phone,
				});
				if (existingCustomer)
					throw new BadRequestError(
						"Sorry this number is registered"
					);
			}
			phone = phone || customer.phone;

			const salt = await GenerateSalt();
			if (password) {
				hashedPassword = await GeneratePassword(password, salt);
				token = "";
				tokens = [];
			}

			const updatedCustomer = await this.repository.UpdateCustomer({
				name,
				email,
				password: hashedPassword,
				_id,
				token,
				tokens,
				plans: plansArr,
				salt,
			});

			return updatedCustomer;
		} catch (e) {
			throw new APIError(e);
		}
	}

	async Logout(inputs) {
		const { _id, token, all } = inputs;
		try {
			const customer = await this.repository.FindCustomerById({ _id });
			let tokens = customer.tokens.filter((t) => {
				return t != token;
			});
			if (all && all == "Y") tokens = [];
			const updatedCustomer = await this.repository.UpdateCustomer({
				tokens: tokens,
				_id: _id,
			});
			return updatedCustomer;
		} catch (e) {
			throw new APIError(e);
		}
	}

	async SendOTP(intputs) {
		try {
			const { phone } = intputs;
			const OTP = GenerateOTP(6);
			const message = `Your one time OTP for the verification is ${OTP}`;
			await sendMessage({ number: phone, message });
		} catch (e) {
			throw new APIError(`Error while sending OTP ${e}`);
		}
	}
}

module.exports = CustomerService;
