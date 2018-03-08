var express = require('express');
var router = express.Router();
var ExamModel = require('../model/ExamModel');
var AnswerModel = require('../model/AnswerModel');

router.get('/doit/:eid', function(req, res, next) {
  res.render("exam_doit", {eid: req.params.eid});
});

router.get('/api/getExamData', function(req, res, next) {
	ExamModel.findOne({_id: req.query.eid}, function(err, doc) {
		res.send(doc);
	})
});

router.post('/api/save_answer', function(req, res, next) {
	// console.log(req.body.exam);
	var condition = {
		eid: req.body.eid,
		student_name: req.body.student_name
	};

	var upsertData = {
		eid: req.body.eid,
		student_name: req.body.student_name,
		answers : req.body.answers
	};

	console.log(condition);
	AnswerModel.findOne(condition, function(err, doc) {
		console.log("成绩", doc);
		var result = {
			status: 1,
			message: "成绩提交成功"
		}
		if(doc) {
			result = {
				status: -3,
				message: "您已经提交过了。不能再次提交"
			}
			res.send(result);
			return;
		}
		var am = new AnswerModel();
		am.eid = req.body.eid;
		am.student_name = req.body.student_name;
		am.answers  = req.body.answers;
		am.save((err)=>{
			console.log(err);
			if(err && err.name != "CastError") {
				result = {
					status: -2,
					message: "保存失败"
				};
			}
			res.send(result);
		})
	})
});

module.exports = router;
