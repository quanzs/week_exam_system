var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var ExamModel = require('../model/ExamModel');
var AnswerModel = require('../model/AnswerModel');

router.get('/list', function(req, res, next) {
	ExamModel.find({author: "作者A"}, '_id eTitle author', function(err, docs) {
		console.log(docs);
		res.render("exam_list", {list: docs});
	})
});

router.get('/exam_add', function(req, res, next) {
  res.render("exam_add", {eid: ""});
});

router.get('/exam_edit/:eid', function(req, res, next) {
  res.render("exam_add", {eid: req.params.eid});
});

router.get('/exam_results/:eid', function(req, res, next) {
  res.render("exam_results", {eid: req.params.eid});
});

router.get('/api/getExamData', function(req, res, next) {
	ExamModel.findOne({_id: req.query.eid}, function(err, doc) {
		res.send(doc);
	})
})

router.get('/api/getAnswerData', function(req, res, next) {
	AnswerModel.find({eid: req.query.eid}, function(err, docs) {
		res.send(docs);
	})
})

router.post('/api/save_exam', function(req, res, next) {
	// console.log(req.body.exam);
	var upsertData = {
		author : "作者A",
		eTitle : req.body.eTitle,
		content : req.body.exam,
		create_date : Date.now()
	};
	var eid = req.body.eid != "" ? req.body.eid : new mongoose.mongo.ObjectID();
	ExamModel.findOneAndUpdate({_id: eid}, upsertData, {upsert: true}, (err)=>{
		console.log(err);
		var result = {
			status: 1,
			message: "保存成功"
		};
		if(err && err.name != "CastError") {
			result = {
				status: -2,
				message: "保存失败"
			};
		}
		res.send(result);
	})
	
});

module.exports = router;
