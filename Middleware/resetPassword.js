const User = require('./../models/userModel');
const {sendEmail} = require('../Utils/email')
const crypto = require('crypto')


/**
 *  What is the logic beyond the reset password method/function.
 *  1. finding the user who is trying to reset his/her password.
 * 2.send the reset url to the user
 * 3.find the user by the reset password token
 * 4. update password to the new password inserted by the user.
 * -- figure out the way of using this by using both phone number and email.
 * -- create this im DRY way for both user and other user types.
 * 
 * 
 * 
 * 
 */

exports.forgotPassword = async (req, res) => {
	try {

		// hre it better be by phone Number for now.
		// while filling forget password i expect the phone number
		const data = req.body;
		let phoneNumber;
		phoneNumber = data.phoneNumber ? data.phoneNumber : null;
		const user = await User.findOne({phoneNumber: phoneNumber});
		if (! user) {
			res.status(404).json({status: "404", message: "User with this email address/ phone number is not found."})
		}
		// this method should be recreated .
		// const resetToken = user.createPasswordResetToken();
		const resetToken = "the new token that has been generated";
		user.passwordResetToken = resetToken;
		await user.save({validateBeforeSave: false});
		const resetUrl = `${
			req.protocol
		}://${
			req.get('host')
		}/api/v1/users/reset-password/${resetToken}`

		const message = `click this link to reset your password ${resetUrl}
         if your are don't asked for reseting
          your password please ignore this email`;

		try {
			await sendEmail({ // email: user.email,
				email: "bernabastekkalign@gmail.com",
				subject: "Reseting Password in Master template using email.",
				message: message
			});
		} catch (err) {
			user.passwordResetToken = undefined;
			user.passwordResetExpires = undefined;
			await user.save({validateBeforeSave: false});
			res.status(500).json({status: "cannot send an email please try again", message: err})
		}
		res.status(200).json({status: "success", message: "A reset link is sent to your email"})

	} catch (err) {
		console.log("error");
	}
}
