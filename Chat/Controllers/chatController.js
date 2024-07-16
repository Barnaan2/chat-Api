const catchAsync = require("../../ErrorHandler/catchAsync");
const AppError = require("../../ErrorHandler/appError");
const Chat = require("../Models/chatModel");
const Content = require("../Models/contentModel");
const Message = require("../Models/messageModel")

/*
Creating Chat means :
{
users:[
"userId1",
"userId2"
]
}

*/
exports.Create = catchAsync(async (req, res, next) => {
	const data = req.body;
	const chat = await Chat.create(data);
	res.status(200).json({chat});

});
exports.Read = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const chat = await Chat.findById(id);
	// it should also return messages in the chat.
	const messages = await Message.find({chat: id});
	if (! chat) {
		next(new AppError("No chat found", 404));
		return;
	}

	res.status(200).json({messages});

});


exports.ReadMany = catchAsync(async (req, res, next) => {
	const chats = await Chat.find();
	res.status(200).json(chats);
});

exports.Change = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const chat = await Chat.findById(id);
	if (! chat) {
		next(new AppError("Chat is not found", 404));
		return;
	}

	const data = {
		approvedBy: req.body.approvedBy,
		status: req.body.status
	};
	const updatedChat = await Chat.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: false
	})

	res.status(201).json(updatedChat);

});

exports.Erase = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const chat = await Chat.findById(id);
	if (! chat) {
		next(new AppError("Chat do not exist with this id", 404));
		return;
	}
	await Chat.findByIdAndDelete(id);
	res.status(204).json({});

});
