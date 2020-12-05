const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const examSchema=new Schema({
examname:{
    type:String,required:true
},
examtype:{
    type:String,required:true
},
questions:{
    type:Array,
    required:true

},
time:{
    type:Array
    
}

},{timestamps:true}
);

const Exam=mongoose.model("Exam",examSchema);

module.exports=Exam;