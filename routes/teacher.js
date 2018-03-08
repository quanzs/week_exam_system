var express = require('express');
const mongoose = require('mongoose');
const md5 = require('md5');
var router = express.Router();
var ExamModel = require('../model/ExamModel');
var AnswerModel = require('../model/AnswerModel');
var UserModel = require('../model/UserModel');

router.get('/list', function(req, res, next) {
	if(req.session == null || req.session.username == null) {
		res.redirect("/teacher/login");
		return;
	}

	ExamModel.find({author: req.session.username}, '_id eTitle author', function(err, docs) {
		console.log(docs);
		res.render("exam_list", {list: docs});
	})
});

router.get('/regist', function(req, res, next) {
  res.render("regist", {});
});

router.get('/', function(req, res, next) {
  res.redirect("/teacher/login");
});


router.get('/login', function(req, res, next) {
  res.render("login", {});
});

router.post('/api/login', function(req, res, next) {
	var result = {
		status: 1,
		message: "登录成功"
	};
	UserModel.find({username: req.body.username, psw: md5(req.body.psw)}, function(err, docs) {
		if(docs != null && docs.length > 0) {
			req.session.username = req.body.username;
			res.send(result);
			console.log(req.session.username);
			return;
		} else {
			result = {
				status: -4,
				message: "登录失败，请检查您的用户名或者密码!"
			};
		} 
		res.send(result);
	})
});

router.post('/api/regist', function(req, res, next) {
	var result = {
		status: 1,
		message: "注册成功"
	};
	UserModel.find({username: req.body.username}, function(err, docs) {
		if(docs != null && docs.length > 0) {
			result = {
				status: -4,
				message: "该用户名已经注册了。"
			};
			res.send(result);
			return;
		}
		var um = new UserModel();
		um.username = req.body.username;
		um.psw = md5(req.body.psw);

		um.save(function(err){
			if(err) {
				result = {
					status: -3,
					message: "注册失败"
				};
			}
			res.send(result);
		})
	})
});

router.get('/exam_add', function(req, res, next) {
	if(req.session == null || req.session.username == null) {
		res.redirect("/teacher/login");
		return;
	}
	res.render("exam_add", {eid: ""});
});

router.get('/exam_edit/:eid', function(req, res, next) {
	if(req.session == null || req.session.username == null) {
		res.redirect("/teacher/login");
		return;
	}
	res.render("exam_add", {eid: req.params.eid});
});

router.get('/exam_results/:eid', function(req, res, next) {
	if(req.session == null || req.session.username == null) {
		res.redirect("/teacher/login");
		return;
	}
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
		author : req.session.username,
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
