const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// the time stamp will create the created and updated.
const adminSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: [true, " full name is required "]
	},
	image: {
		type: String
	},
	email: {
		type: String,
		required: [false, "email is required"]
	},
	// Phone numb
	phoneNumber: {
		type: String,
		unique: true,
		required: [true, "Phone number is required to create a new account "]
	},

	password: {
		type: String,
		required: [
			true, "Password is required!"
		],
		minlength: 6,
		select: false
	},
	// added reset token for user identification  purpose.
	passwordResetToken: {
		type: String,
		default: "None"
	},
	role: {
		type: String,
		enum: ["Super Admin", "Admin"]
	},
	status: {
		type: String,
		enum: [
			"Active", "Inactive"
		],
		default: "Active"
	}
}, {timestamps: true});

adminSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}

	console.log('THIS METHOD RUNS WHEN EVER THE PASSWORD IS CHANGED. ')
	this.password = await bcrypt.hash(this.password, 12);
	// this.confirmPassword = undefined;
	next();
});

// for checking the correctness of user password for logging them in .
adminSchema.methods.correctPassword = async function (canditatePassword, password) {
	return await bcrypt.compare(canditatePassword, password);
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
