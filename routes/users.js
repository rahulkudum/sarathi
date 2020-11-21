const router=require("express").Router();
let User=require("../models/user.model");

router.route("/").get((req,res)=>{
    User.find()
    .then(users=>res.json(users))
    .catch(err=>console.log(err));
})


router.route("/add").post((req,res)=>{

const username=req.body.username;
const answers=req.body.answers;
const marks=Number(req.body.marks);


const newUser=new User({
    username,
    answers,
    marks
});

newUser.save()
.then(()=>res.json("sucessfully submitted"))
.catch(err=>console.log(err));




});


router.route("/:id").get((req,res)=>{
    User.findById(req.params.id)
    .then(user=>res.json(user))
    .catch(err=>console.log(err));
});

router.route("/:id").delete((req,res)=>{
    User.findByIdAndDelete(req.params.id)
    .then(()=>res.json("submission deleted"))
    .catch(err=>console.log(err));
});

module.exports=router;
