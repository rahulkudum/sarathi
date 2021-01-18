const router = require("express").Router();
let Exam = require("../models/exam.model");

router.route("/").get((req, res) => {
 Exam.find()
  .then((exams) => res.json(exams))
  .catch((err) => console.log(err));
});

router.route("/add").post((req, res) => {
 const examname = req.body.examname;
 const examtype = req.body.examtype;
 const questions = req.body.questions;
 const time = req.body.time;

 const newExam = new Exam({
  examname,
  examtype,
  questions,
  time,
 });

 newExam
  .save()
  .then(() => res.json("sucessfully submitted"))
  .catch((err) => console.log(err));
});

router.route("/update/").post((req, res) => {
 Exam.updateOne({ examname: req.body.examname, examtype: req.body.examtype }, { questions: req.body.questions }, (err) => {
  if (!err) res.send("secesfully updated");
 });
});

router.route("/:id").get((req, res) => {
 Exam.findById(req.params.id)
  .then((exam) => res.json(exam))
  .catch((err) => console.log(err));
});

router.route("/delete").post((req, res) => {
 Exam.deleteOne({ examname: req.body.examname, examtype: req.body.examtype }, (err) => {
  if (!err) res.send("sucessfulluy deleted");
 });
});

router.route("/find").post((req, res) => {
 Exam.findOne({ examname: req.body.examname, examtype: req.body.examtype }, (err, file) => {
  res.json(file);
 });
});

module.exports = router;
