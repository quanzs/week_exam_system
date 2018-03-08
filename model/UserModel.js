const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const User = new Schema({
	username: String,
	psw: String,
	create_date: { type: Date, default: Date.now }
});

const UserModel = mongoose.model('user', User);

module.exports = UserModel;