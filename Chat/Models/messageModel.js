const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({

	sender: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'

	},
	content: {
		type: mongoose.Schema.ObjectId,
		ref: 'Content'
	},

	chat: {
		type: mongoose.Schema.ObjectId,
		ref: 'Chat'
	}
}, {timestamps: true});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
