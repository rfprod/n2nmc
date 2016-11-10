'use strict';

const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

let User = new Schema({
	id:								Number,	// generated
	role:							String,	// generated
	registered:				String,	// generated
	lastLogin:				Number,	// generated
	userExtended: {
		email:					String,	// user input
		salt:						String,	// generated
		pass:						String,	// generated
		passResetToken:	String,	// generated
		firstName:			String,	// user input
		lastName:				String,	// user input
		city:						String,	// user input
		country:				String	// user input
	},
	twitter: {
		id:							String,	// sync
		displayName:		String,	// sync
		username:				String	// sync
	}
});

module.exports = mongoose.model('User', User);
