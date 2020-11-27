const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const studentSchema=new Schema({

name:{
    type:String,
    required:true,
   
},
mail:{
    type:String,
    required:true,
},
exams:{
    type:Array,
    required:true
}

},{timestamps:true,}
);

const User=mongoose.model("Student",studentSchema);

module.exports=User;