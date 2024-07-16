const auth = require("../../Middleware/authorization");

const {
	Create,
	Read,
	ReadMany,
	Change,
	Erase,
	FindByName
} = require("./../Controllers/settingController");

const router = require("express").Router();
router.route("/").get(ReadMany).post(auth.protect, auth.protectAdmin, Create);
router.route("/:id").get(Read).patch(auth.protect, auth.protectAdmin, Change).delete(auth.protect, auth.protectAdmin, Erase);
router.route("/filter/name").get(FindByName);
module.exports = router;
