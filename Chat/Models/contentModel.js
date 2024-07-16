const mongoose = require('mongoose');

const contentSchema = mongoose.Schema({

	type: {
		type: String
	},
	contnetMessage: {
		type: String
	}

}, {timestamps: true});

const Content = mongoose.model('Content', contentSchema);
module.exports = Content;
