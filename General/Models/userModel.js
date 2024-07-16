const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// the time stamp will create the created and updated.
const userSchema = new mongoose.Schema({
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	email: {
		type: String,
		required: [false, "email is required"]
	},
	phoneNumber: {
		type: String,
		unique: true,
		required: [true, "Phone number is required to create a new account "]
	},
	image: {
		type: String
	},
	password: {
		type: String,
		required: [
			true, "Password is required!"
		],
		minlength: 6,
		select: false
	},
	passwordResetToken: {
		type: String,
		default: "None"
	},
	status: {
		type: String,
		enum: [
			"Active", "Inactive"
		],
		default: "Active"
	}
}, {timestamps: true});


userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	this.password = await bcrypt.hash(this.password, 12);
	// this.confirmPassword = undefined;
	next();
});

// for checking the correctness of user password for logging them in .
userSchema.methods.correctPassword = async function (canditatePassword, password) {
	return await bcrypt.compare(canditatePassword, password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
