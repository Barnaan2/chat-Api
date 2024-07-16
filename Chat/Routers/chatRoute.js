const {
	Read,
	ReadMany,
	Change,
	Erase,
	Create
} = require("../Controllers/chatController");

const router = require("express").Router();
router.route("/").get(ReadMany).post(Create);
router.route("/:id").get(Read).patch(Change).delete(Erase);

module.exports = router;
