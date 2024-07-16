// userRoute.js

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         id: d5fE_asz
 *         name: Leanne Graham
 *         email: leanne.graham@example.com
 *         password: secret
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The user managing API
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Some error happened
 */

// Your route handlers here

const {
	Register,
	Login,
	Read,
	ReadMany,
	Change,
	Erase,
	ChangePasswordUser
} = require("../Controllers/userController");
const auth = require("../../Middleware/authorization");
const passwordReset = require("../../Middleware/passwordRest");

const router = require("express").Router();
router.post("/loginToken", auth.protect, auth.loginTokenUser);

router.post("/phoneChecker", passwordReset.passwordResetUserphonechecker);
router.patch("/passwordReset/:id", passwordReset.userPasswordReset);
router.patch("/passwordChange/:id", auth.protect, ChangePasswordUser);
router.route("/").get(auth.protect, auth.protectAdmin, ReadMany).post(Register);
router.post("/login/", Login);
router.route("/:id/").get(auth.protect, Read).patch(auth.protect, Change).delete(auth.protect, auth.protectAdmin, Erase);
module.exports = router;
