const router=require("express").Router();
let User=require("../models/user.model");

router.route("/").get((req,res)=>{
    User.find()
    .then(users=>res.json(users))
    .catch(err=>console.log(err));
})


router.route("/add").post((req,res)=>{

const name=req.body.name;
const mail=req.body.mail;
const exams=req.body.exams;
const time=[];


const newUser=new User({
    name,
    mail,
    exams,
    time
});

newUser.save()
.then(()=>res.json("sucessfully submitted"))
.catch(err=>console.log(err));

});

router.route("/updat").post((req,res)=>{

   
    const mail=req.body.mail;
    const exams=req.body.exams;
    const time=req.body.time;
    
   User.updateOne({mail:mail},{exams:exams,time:time},(err)=>{
       if(!err) res.send("sucessfully updated");
   })
    
    });
    



router.route("/delete").post((req,res)=>{
   User.deleteOne({mail:req.body.mail},(err)=>{
       if(!err) res.send("secessfully deleted");
   })
});

router.route("/find").post((req,res)=>{
    User.findOne({mail:req.body.mail},(err,file)=>{
        res.json(file);
    })
 });

module.exports=router;
