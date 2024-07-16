const catchAsync = require("./../../ErrorHandler/catchAsync");
const AppError = require("./../../ErrorHandler/appError");
const Admin = require("./../Models/adminModel");
const authUtils = require("./../../Utils/authUtils");
const bcrypt = require("bcryptjs");
const {sendEmail} = require('../../Utils/email');
const {resetTokenGenerator} = require('../../Utils/authUtils');

// used for creating the first user of the system.
exports.StartSystem = catchAsync(async (req, res, next) => {
	let data = req.body;
	// checking if super user is already created .
	const admins = await Admin.find()
	console.log(admins)
	if (admins.length > 1) { // Returning can't find the end point error if the system is already started.
		next(new AppError(`can't find ${
			req.originalUrl
		} on our server`, 404));
		return;
	}
	data.role = "Super Admin";
	const newAdmin = await Admin.create(data);
	const token = authUtils.signToken(newAdmin._id);
	res.status(201).json({
		data: {
			token,
			newAdmin
		}
	});
});
// Registration controller.
exports.Register = catchAsync(async (req, res, next) => {
	const data = req.body;

	const newAdmin = await Admin.create(data);
	const token = authUtils.signToken(newAdmin._id);
	res.status(201).json({
		data: {
			token,
			newAdmin
		}
	});
});

exports.Login = catchAsync(async (req, res, next) => { // ?checking weather phone number and password is provided.
	if (!(req.body.password && req.body.phoneNumber)) {
		next(new AppError("Phone number and password  should be provided to login !", 400));
	}
	// ? selecting the password of the admin by provided phoneNumber
	const admin = await Admin.findOne({phoneNumber: req.body.phoneNumber}).select("+password");

	const errorMsg = "Either phone number or password is incorrect!";
	// ? checking if the admin exists with the provided phoneNumber.
	if (admin) {
		if (admin.status == "Inactive") {
			return next(new AppError("The admin account is currently inactive. Please reach out to the Super Admin to regain access", 401));
		}

		const correct = await admin.correctPassword(req.body.password, admin.password);
		console.log(correct)
		// ? checking if the provided password is correct
		// ? and returning the auth token for admin with its phone number.
		if (correct) {
			const token = authUtils.signToken(admin._id);
			res.status(200).json({
				status: "Successful",
				data: {
					token,
					admin
				}
			});
		} else {
			next(new AppError(errorMsg, 400));
		}
	} else { // ? Handling  incorrect password error.
		next(new AppError(errorMsg, 400));
	}
});

exports.Read = catchAsync(async (req, res, next) => { // Retrieve the ID parameter from the request object
	const id = req.params.id;
	// Retrieve the admin object from the response locals
	const admin = res.locals.admin;
	console.log(admin);
	// Check if the admin's role is "Super Admin" or if the admin ID matches the requested ID
	if (admin.role === "Super Admin" || admin._id.toString() === id) { // If authorized, send a response with the admin data
		res.status(200).json({admin});
	} else { // If not authorized, pass an error to the error handling middleware
		next(new AppError("Not authorized", 401));
	}
});

exports.ReadMany = catchAsync(async (req, res, next) => {
	const admins = await Admin.find();
	res.status(200).json(admins);
});

exports.Change = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const {
		email,
		phoneNumber,
		status,
		role,
		fullName,
		image
	} = req.body;
	const admin = res.locals.admin;
	let data = {};

	if (admin.role === "Super Admin") { // Only Super Admin can change all fields
		data = {
			email,
			phoneNumber,
			status,
			role,
			fullName,
			image
		};
	} else if (admin._id.toString() === id) { // Admin can only change fullName and image for their own profile
		data = {
			fullName,
			image
		};
	} else {
		return next(new AppError("Not authorized", 401));
	}
	const updatedAdmin = await Admin.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: false
	});

	res.status(201).json(updatedAdmin);
});

exports.Erase = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const admin = res.locals.admin;
	if (admin.role !== "Super Admin") {
		next(new AppError("Only Super Admin can delete admins"));
		return;
	}
	await Admin.findByIdAndDelete(id);
	res.status(204).json({});
});

// people are so stupid :)
// ? changing password which is done by the super admin or the admin himself.
exports.ChangePasswordAdmin = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	let admin = await Admin.findById(id).select("+password");
	if (admin.role !== "Super Admin" || admin._id.toString() !== id) { // Check if the admin is not a Super Admin or if the admin ID doesn't match the request ID
		next(new AppError("Not authorized", 401));
		return;
	}
	const {oldPassword, newPassword} = req.body;
	const isMatch = await bcrypt.compare(oldPassword, admin.password);

	if (! isMatch) {
		next(new AppError("password does not match ", 401));
		return;
	}

	console.log("is match");
	const passwordNewhash = await bcrypt.hash(newPassword, 12);
	const data = {
		password: passwordNewhash
	};

	admin = await Admin.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: false
	});
	res.status(201).json({msg: "password changed"});
});


// for reseting password using sms or email.
exports.ResetPassword = catchAsync(async (req, res, next) => {
	const token = req.params.token;

	let admin = {
		role: "none"
	};
	admin = token ? await Admin.findOne({passwordResetToken: token}).select("+password") : admin;

	// if (admin.role !== "Super Admin" || admin._id.toString() !== id) { // Check if the admin is not a Super Admin or if the admin ID doesn't match the request ID
	// next(new AppError("Not authorized", 401));
	// return;
	// }
	console.log(admin);
	// excpet the new password .
	const {newPassword} = req.body;
	admin.password = newPassword;
	admin.passwordResetToken = "None";
	await admin.save({new: true, runValidators: false});

	res.status(201).json({message: "password changed"});
});

exports.ForgetPassword = catchAsync(async (req, res, next) => {
	{
		// hre it better be by phone Number for now.
		// while filling forget password i expect the phone number
		const data = req.body;
		let phoneNumber;
		phoneNumber = data.phoneNumber ? data.phoneNumber : null;
		const admin = await Admin.findOne(
			{phoneNumber: phoneNumber}
		);
		if (! admin) {
			res.status(404).json({status: "404", message: "Admin with this email address/ phone number is not found."})
		}
		// this method should be recreated .
		// const resetToken = admin.createPasswordResetToken();
		// const resetToken = "the new token that has been generated";
		const resetToken = resetTokenGenerator();
		admin.passwordResetToken = resetToken;
		await admin.save(
			{validateBeforeSave: false}
		);
		const resetUrl = `${
			req.protocol
		}://${
			req.get('host')
		}/api/v1/admins/reset-password/${resetToken}`;
		const message = `click this link to reset your password ${resetUrl}
			 if your are don't asked for reseting
			  your password, please ignore this email`;

		try {
			const subject = "Reseting Password in Master template using email.";
			const sendMailResponse = await sendEmail({ // email: admin.email,
				email: "bernabastekkalign@gmail.com",
				subject: "Reseting Password in Master template using email.",
				message: message
			});
			console.log(sendMailResponse);
			// const sendSmsResponse = await sendSMS(message);

		} catch (err) {
			admin.passwordResetToken = undefined;
			await admin.save({validateBeforeSave: false});
			res.status(500).json({status: "cannot send an email please try again", message: err})
		}
		res.status(200).json(
			{status: "success", message: "A reset link is sent to your email"}
		)


	}

});
