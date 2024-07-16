const {
	Register,
	Login,
	Read,
	ReadMany,
	Change,
	Erase,
	ChangePasswordAdmin,
	ResetPassword,
	ForgetPassword,
	StartSystem
} = require("./../Controllers/adminController");

const auth = require("../../Middleware/authorization");
const passwordReset = require("../../Middleware/passwordRest");

const router = require("express").Router();

router.post("/start-system", StartSystem)
router.post("/login/", Login);

router.post("/loginToken", auth.protect, auth.loginTokenAdmin);

router.post("/phoneChecker", passwordReset.passwordResetAdminphonechecker);
router.post("/forget-password/", ForgetPassword)
router.patch("/passwordReset/:id", passwordReset.adminPasswordReset);
router.patch("/reset-password/:token", ResetPassword)
router.patch("/passwordChange/:id", auth.protect, ChangePasswordAdmin);

router.route("/").get(auth.protect, auth.protectAdmin, auth.protectAdmin, ReadMany).post(auth.protect, auth.protectAdmin, Register);

router.route("/:id/").get(auth.protect, auth.protectAdmin, Read).patch(auth.protect, auth.protectAdmin, Change).delete(auth.protect, auth.protectAdmin, Erase);
module.exports = router;
