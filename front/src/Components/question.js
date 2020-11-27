import { Button,TextField,Backdrop,CircularProgress,RadioGroup,FormControlLabel,FormControl,FormLabel,Radio,GridList,GridListTile,Grid } from "@material-ui/core";
import React,{useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import { Route, useHistory,useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { ExamName, ExamType, Modify, Questions } from "./storage";



const useStyles = makeStyles((theme) => ({
  
  root1: {
      flexGrow: 1,
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    }
   
}));


function Question(){


let { ind } = useParams();
let history=useHistory();

let nind= Number(ind);
const [backdrop,setBackdrop]=useState(false);



    //const [img,setImg]=useState();
  
    const [imageloading,setImageloading]=useState(false);
    const [questions,setQuestions]=useContext(Questions);
    const [examName,setExamName]=useContext(ExamName);
    const [examType,setExamType]=useContext(ExamType);
    const [modify,setModify]=useContext(Modify);
    const [warning,setWarning]=useState(false);
    const cont=useRef();
    const classes = useStyles();
    let questionType;
console.log(questions);
if(examType==="mains"){

    if(nind==5||nind===6||nind===21 || nind===22 || nind===23 || nind===24 || nind===25 
      || nind===46 || nind===47 || nind===48 || nind===49 || nind===50
      || nind===71 || nind===72 || nind===73 || nind===74 || nind===75
      
      
      ){
        questionType="integer";
    }else{
        questionType="single";
    }
}

useEffect(()=>{
   
   
    setImageloading(true);

   
 },[nind]);


 
    return(
        <div className={classes.root1}>
        <Backdrop className={classes.backdrop} open={backdrop} >
    <CircularProgress color="inherit" />
    </Backdrop>
        <Grid container >
        <Grid item lg={12} >
            <h1 style={{textAlign:"center"}}>Sarathi Exam paper setting</h1>
        </Grid>
        <Grid item lg={8}   xs={12} sm={12}  >
        <h2 style={{textAlign:"center"}}>Question {nind}</h2>
        <div>
        <div>
            <input type="file" name="file" id="file"  onChange={(e)=>{
     
     let img=e.target.files[0];
     const formData =new FormData();




 formData.append(
 "file",
 img,
 examName+"_"+examType+"_"+ind
);





setBackdrop(true);
axios.post("/upload",formData)
.then(res=>{

 console.log(res.data.file.filename);
 setQuestions(prev=>{
     let dum=[...prev];
dum[nind-1].image=res.data.file.filename;
return dum;
 })
 setBackdrop(false);

})


    
   }} /> 
  



        </div>
        <br />
        <br />
        
        
        
        {!questions[nind-1].image ? null :
        <div>
        
      
        <div style={{width: "800px", 
    height:"500px",
    overflowX:"scroll",
    overflowY:"scroll",
    whiteSpace: "nowrap",
   
    margin:"auto"
    }}>
       {imageloading ? <div> <CircularProgress />  <img src={`/images/${questions[nind-1].image}`} onLoad={()=>{
         setImageloading(false);
         console.log(imageloading);
        }} />
        </div>:<img src={`/images/${questions[nind-1].image}`}  />
        }
        </div>
        
      
<br />
      <div style={{textAlign:"center"}}>  
{questionType==="single" ?
        <FormControl component="fieldset">
  <FormLabel component="legend">Correct Option</FormLabel>
  <RadioGroup row aria-label="options" name="options" value={questions[nind-1].answer} onChange={(e)=>{setQuestions(prev=>{

let dum=[...prev];
dum[nind-1].answer=e.target.value;
dum[nind-1].correct=4;
dum[nind-1].wrong=-1;

return dum;

  })}}>
    <FormControlLabel value="1" control={<Radio />} label="1)" />
    <FormControlLabel value="2" control={<Radio />} label="2)" />
    <FormControlLabel value="3" control={<Radio />} label="3)" />
    <FormControlLabel value="4" control={<Radio />} label="4)" />
  </RadioGroup>
</FormControl>
:<TextField id="standard-basic" label="Answer" value={questions[nind-1].answer} onChange={(e)=>{setQuestions(prev=>{
  
let dum=[...prev];
dum[nind-1].answer=e.target.value;
dum[nind-1].correct=4;
dum[nind-1].wrong=0;
return dum;

  })}} />}

 
</div>

        </div>
        
        }
        
        </div>
        </Grid>
        <Grid item lg={4}  sm={12} xs={12} style={{marginTop:"auto",marginBottom:"auto"}}>
        <div style={{width: "480px", 
    height:"700px",
    
   
    
   
    margin:"auto"
    }}>
        
        {questions.map((tile,i) => (
         
        <Button style={{margin:"5px"}} variant="contained" color={(questions[i].image && questions[i].answer) ? "primary" : "secondary"} onClick={()=>history.push(`/setexam/${i+1}`)}>
            {i+1}
        </Button>
         
        ))}
     </div>
    <br />
    <div style={{textAlign:"center"}}>
    <Button variant="contained" color="primary" onClick={()=>{
        console.log(questions);
let done=true;
questions.forEach((val)=>{

if(!(val.answer && val.image)){
   done=false;
}

})

if(done){

 

    if(!modify){
      setBackdrop(true);
    axios.post("/exam/add/",{examname:examName,examtype:examType,questions:questions})
    .then(res=>{
        console.log(res);
       
        setExamName("");
        setExamType("mains");
        setBackdrop(false);
        history.push("/");
    })
    .catch(err=>{
        console.log(err);
    });
    }else{

      setBackdrop(true);
      axios.post("/exam/update/",{examname:examName,examtype:examType,questions:questions})
    .then(res=>{
        console.log(res);
       
        setExamName("");
        setExamType("mains");
       setModify(false);
       setBackdrop(false);
        history.push("/");
    })
    .catch(err=>{
        console.log(err);
    });



    }



}else{
   alert("You havent filled all the questions ")
}




    }}>
        Submit
    </Button>
    </div>
   
    </Grid>
</Grid>
</div>


    );




}

export default Question;