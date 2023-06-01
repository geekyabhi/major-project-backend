const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
	{
		name: {
			type: String,
			require: true,
		},
		email: {
			type: String,
		},
		password: {
			type: String,
			require: true,
		},
		phone: {
			type: String,
			require: true,
			unique: true,
		},
		token: {
			type: String,
		},
		salt: {
			type: String,
		},
		tokens: [
			{
				type: String,
			},
		],
		plans: [
			{
				plan: {
					type: Schema.Types.ObjectId,
					ref: "Plan",
					require: true,
				},
				started: { type: Date },
				activeTill: { type: Date },
			},
		],
	},
	{
		toJSON: {
			transform(doc, ret) {
				delete ret.password;
				delete ret.salt;
				delete ret.__v;
			},
		},
		timestamps: true,
	}
);

module.exports = mongoose.model("Customer", CustomerSchema);
