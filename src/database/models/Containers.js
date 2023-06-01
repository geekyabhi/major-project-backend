const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ConatinerSchema = new Schema(
	{
		containerId: { type: String },
		name: { type: String },
		machine: { type: String },
		online: { type: Boolean },
		port: { type: Number },
	},
	{
		toJSON: {
			transform(doc, ret) {
				delete ret.__v;
			},
		},
		timestamps: true,
	}
);

module.exports = mongoose.model("Container", ConatinerSchema);
