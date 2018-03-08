const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const Answer = new Schema({
	eid: String,
	student_name: String,
	answers: String,
	create_date: { type: Date, default: Date.now }
});

const AnswerModel = mongoose.model('answer', Answer);

module.exports = AnswerModel;