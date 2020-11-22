const router=require("express").Router();
let Exam=require("../models/exam.model");

router.route("/").get((req,res)=>{
    Exam.find()
    .then(exams=>res.json(exams))
    .catch(err=>console.log(err));
})


router.route("/add").post((req,res)=>{

    const questionscount=req.body.questionscount;
    const questions=req.body.questions; 


const newExam=new Exam({
    questionscount,
    questions
});

newExam.save()
.then(()=>res.json("sucessfully submitted"))
.catch(err=>console.log(err));




});


router.route("/:id").get((req,res)=>{
    Exam.findById(req.params.id)
    .then(exam=>res.json(exam))
    .catch(err=>console.log(err));
});

router.route("/:id").delete((req,res)=>{
    Exam.findByIdAndDelete(req.params.id)
    .then(()=>res.json("submission deleted"))
    .catch(err=>console.log(err));
});

module.exports=router;
