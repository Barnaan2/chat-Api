const catchAsync = require("../ErrorHandler/catchAsync");
const Admin = require("../General/Models/adminModel");
const AppError = require("../ErrorHandler/appError");
const User = require("../General/Models/userModel");
const bcrypt = require("bcryptjs");

exports.passwordResetAdminphonechecker = catchAsync(async (req, res, next) => {
	const {phoneNumber} = req.body;

	const admin = await Admin.findOne({phoneNumber: phoneNumber});

	if (! admin) {
		next(new AppError("No user with this phone number", 401));
		return;
	}
	res.status(200).json({id: admin._id});
});

exports.passwordResetUserphonechecker = catchAsync(async (req, res, next) => {
	const {phoneNumber} = req.body;

	const user = await User.findOne({phoneNumber: phoneNumber});

	if (! user) {
		next(new AppError("No user with this phone number"), 401);
		return;
	}

	res.status(200).json({id: user._id});
});


exports.adminPasswordReset = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const admin = await Admin.findById(req.params.id);
	if (! admin) {
		next(new AppError("their is no user", 401));
		return;
	}
	const {password} = req.body;
	const passwordNewhash = await bcrypt.hash(password, 12);
	const data = {
		password: passwordNewhash
	};

	const updatedAdmin = await Admin.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: false
	});

	console.log("updated");
	res.status(201).json(updatedAdmin);
	next();
});

// user password reset
exports.userPasswordReset = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const user = await User.findById(req.params.id);
	if (! user) {
		next(new AppError("Their is no user", 401));
	}
	const {password} = req.body;
	const passwordNewhash = await bcrypt.hash(password, 12);
	const data = {
		password: passwordNewhash
	};
	const updatedUser = await User.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: false
	});
	res.status(200).json(updatedUser);
});
