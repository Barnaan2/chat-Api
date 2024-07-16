const catchAsync = require("../../ErrorHandler/catchAsync");
const AppError = require("../../ErrorHandler/appError");
const User = require("../Models/userModel");
const authUtils = require("../../Utils/authUtils");
const Admin = require("../Models/adminModel");
const bcrypt = require("bcryptjs");

// registration controller.
exports.Register = catchAsync(async (req, res, next) => {
	const data = req.body;
	const newUser = await User.create(data);
	const token = authUtils.signToken(newUser._id);
	res.status(201).json({
		data: {
			token,
			newUser
		}
	});
});


exports.Login = catchAsync(async (req, res, next) => {
	console.log("hello"); // ?checking weather phone number and password is provided.
	if (!(req.body.password && req.body.phoneNumber)) {
		next(new AppError("Phone number and password  should be provided to login !", 400));
	}
	const errorMsg = "Either phone number or password is incorrect!";
	// ? selecting the password of the user by provided phoneNumber
	const user = await User.findOne({phoneNumber: req.body.phoneNumber}).select("+password");
	// ? checking if the user exists with the provided phoneNumber.
	if (user) {
		if (user.status == "Inactive") {
			return next(new AppError("The user account is currently inactive. Please reach out to the Admin to regain access", 401));
		}

		const correct = await user.correctPassword(req.body.password, user.password);

		// ? checking if the provided password is correct
		// ? and returning the auth token for user with its phone number.
		if (correct) {
			const token = authUtils.signToken(user._id);
			res.status(200).json({
				status: "Successful",
				data: {
					token,
					user
				}
			});
		} else {
			next(new AppError(errorMsg, 400));
		}
	} else { // ? Handling  incorrect phone number error.
		next(new AppError(errorMsg, 400));
	}
});

exports.Read = catchAsync(async (req, res, next) => { // Retrieve the ID from response locals
	const id = res.locals.id;
	const user = await User.findById(req.params.id);
	if (! user) {
		next(new AppError("No user found", 404));
		return;
	}
	// Find the admin with the retrieved ID
	const admin = await Admin.findById(id);
	// Check if the request ID is not equal to the admin ID or if admin does not exist
	if (req.params.id !== id && ! admin) {
		next(new AppError("Not authorized", 404));
		return;
	}
	// If authorized, send a response with the user data
	res.status(200).json({user});
});

exports.ReadMany = catchAsync(async (req, res, next) => {
	const users = await User.find();
	res.status(200).json(users);
});

exports.Change = catchAsync(async (req, res, next) => { // Retrieve the ID parameter from the request object
	const {
		email,
		phoneNumber,
		secondPhoneNumber,
		status,
		firstName,
		lastName,
		image
	} = req.body;
	const id = req.params.id;
	const user = await User.findById(id);
	if (! user) {
		next(new AppError("User is not found", 404));
		return;
	}
	// Find the admin using the ID stored in response locals
	const admin = await Admin.findById(res.locals.id);
	let data = {};
	if (admin) { // If admin exists, allow changing all fields
		data = {
			email,
			phoneNumber,
			secondPhoneNumber,
			status,
			firstName,
			lastName,
			image
		};
	} else if (res.locals.id === id) { // If admin ID matches user ID, allow changing specific fields for the user's own profile
		data = {
			firstName,
			lastName,
			image
		};
	} else { // If not authorized, pass an error to the error handling middleware
		return next(new AppError("Not authorized", 401));
	}
	const updatedUser = await User.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: false
	});

	res.status(201).json(updatedUser);
});

exports.Erase = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const user = await User.findById(id);
	if (! user) {
		next(new AppError("user do not exist with this id", 404));
		return;
	}
	await User.findByIdAndDelete(id);
	res.status(204).json({});
});

exports.ChangePasswordUser = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	let user = await User.findById(id).select("+password");

	if (! user) {
		next(new AppError("no user found with this id ", 404));
		return;
	}
	console.log(res.locals.id);
	console.log(id);
	if (res.locals.id !== id) { // Check if the admin exists or if the user ID doesn't match the request ID
		next(new AppError("Not authorized", 401));
		return;
	}
	const {oldPassword, newPassword} = req.body;
	const isMatch = await bcrypt.compare(oldPassword, user.password);

	if (! isMatch) {
		next(new AppError("password does not match ", 401));
		return;
	}

	console.log("is match");
	const passwordNewhash = await bcrypt.hash(newPassword, 12);
	const data = {
		password: passwordNewhash
	};

	user = await User.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: false
	});
	res.status(201).json({msg: "password change"});
});
