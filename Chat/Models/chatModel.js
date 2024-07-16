const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
	users: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		}
	]


}, {timestamps: true});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
