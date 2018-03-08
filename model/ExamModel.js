const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const Exam = new Schema({
	author: String,
	eTitle: String,
	content: String,
	create_date: Date,
	last_update_date: { type: Date, default: Date.now }
});

const ExamModel = mongoose.model('exam', Exam);

module.exports = ExamModel;