const catchAsync = require("./../../ErrorHandler/catchAsync");
const AppError = require("./../../ErrorHandler/appError");
const Setting = require("./../Models/settingModel");

exports.Create = catchAsync(async (req, res, next) => {
	const data = req.body;
	const newSetting = await Setting.create(data);

	res.status(201).json({newSetting});
});

exports.Read = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const setting = await Setting.findById(id);
	if (! setting) {
		next(new AppError("No setting found", 404));
		return;
	}

	res.status(200).json({setting});
});

exports.ReadMany = catchAsync(async (req, res, next) => {
	const settings = await Setting.find();
	res.status(200).json(settings);
});

exports.Change = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const data = req.body;

	// Retrieve the setting by ID
	const setting = await Setting.findById(id);
	if (! setting) { // If setting is not found, throw an error
		throw new AppError("Setting not found", 404);
	}

	setting.findByIdAndUpdate(id, data);
	// Save the updated setting
	await setting.save();

	// Respond with the updated setting
	res.status(200).json(setting); // Changed status code to 200 OK for an update operation
});


exports.Erase = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const setting = await Setting.findById(id);
	if (! setting) {
		next(new AppError("Setting do not exist with this id", 404));
		return;
	}
	await Setting.findByIdAndDelete(id);
	res.status(201).json({msg: "Success"});
});

exports.FindByName = catchAsync(async (req, res, next) => {
	const {name} = req.query;
	let listOfItems = [];
	if (name) {
		listOfItems = await Setting.find({name: name, status: "Active"});
	}
	res.status(200).json({listOfItems});
});
