import { Button,TextField,Backdrop,CircularProgress,RadioGroup,FormControlLabel,FormControl,FormLabel,Radio,GridList,GridListTile,Grid } from "@material-ui/core";
import React,{useContext, useEffect, useState} from "react";
import axios from "axios";
import { Route, useHistory,useParams, useRouteMatch } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { Answers, ExamName, ExamType, Marks, Questions,Time,Time2,UserName } from "./storage";
import { set } from "mongoose";


function Result(){

let {path,url}=useRouteMatch();
let { ind } = useParams();
let history=useHistory();

let nind= Number(ind);
let questionType;



 
    const [questions,setQuestions]=useContext(Questions);
    const [examName,setExamName]=useContext(ExamName);
    const [examType,setExamType]=useContext(ExamType);
  
   
    const [answers,setAnswers]=useContext(Answers);
    const [mail,setMail]=useContext(UserName);
    const [time,setTime]=useContext(Time);
    const [time2,setTime2]=useContext(Time2);
    const [backdrop,setBackdrop]=useState(false);
    const [imageloading,setImageloading]=useState(false);
    const [marks,setMarks]=useContext(Marks);
    
 
if(examType==="mains"){

  if(nind==5||nind===6||nind===21 || nind===22 || nind===23 || nind===24 || nind===25 
    || nind===46 || nind===47 || nind===48 || nind===49 || nind===50
    || nind===71 || nind===72 || nind===73 || nind===74 || nind===5
    
    
    ){
      questionType="integer";
  }else{
      questionType="single";
  }
}



const useStyles = makeStyles((theme) => ({
  
    root1: {
        flexGrow: 1,
      },
     
  }));

  const classes = useStyles();
  let bcolor;
 
  useEffect(()=>{
   
   
     setImageloading(true);

    
  },[nind]);

  let corrected=0;
  let wronged=0;
  let lefted=0;
 
    return(
        <div className={classes.root1}>
        <Backdrop className={classes.backdrop} open={backdrop} >
    <CircularProgress color="inherit" />
    </Backdrop>
        <Grid container >
        <Grid item lg={12} >
            <h1 style={{display:"inline-block"}}>Sarathi Online Exam </h1>
            <h1 style={{display:"inline-block" ,marginLeft:"20px"}}> You got {marks} marks </h1>
        
            
        </Grid>
        <Grid item lg={8}   xs={12} sm={12} >
        <h2 style={{textAlign:"center"}}>Question {nind}</h2>
      
        
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
 
  <RadioGroup row aria-label="options" name="options" value={answers[nind-1].answer} >
    <FormControlLabel value="1" control={<Radio />} label="1)" />
    <FormControlLabel value="2" control={<Radio />} label="2)" />
    <FormControlLabel value="3" control={<Radio />} label="3)" />
    <FormControlLabel value="4" control={<Radio />} label="4)" />
  </RadioGroup>
</FormControl> :<TextField id="standard-basic" label="Answer" style={{marginBottom:"10px"}} value={answers[nind-1].answer}  />}

 ``

 <p>Correct Answer: {answers[nind-1].correct} </p>

  <hr style={{width:"800px"}}/>

  <Button  variant="contained" style={{margin:"5px",backgroundColor:"#e6e6e6",borderColor: "#adadad"}} onClick={()=>{
    if(nind!==1) history.push(`/writexam/${examName}_${examType}/result/${nind-1}`);
    else history.push(`/writexam/${examName}_${examType}/result/5`);
  }}  >
    Back
  </Button>

  <Button variant="contained" style={{margin:"5px",backgroundColor:"#e6e6e6",borderColor: "#adadad"}} onClick={()=>{
      if(nind!==5) history.push(`/writexam/${examName}_${examType}/result/${nind+1}`);
    else history.push(`/writexam/${examName}_${examType}/result/1`);
  }}  >
    Next
  </Button>

  <Button variant="contained" style={{margin:"5px",backgroundColor:"#43d001",color:"white"}} onClick={()=>{

      

      history.push(`/writexam/${examName}_${examType}`)
     
    }} >
    Exit
  </Button>


  

</div>

        </div>
        
      
        </Grid>
        <Grid item lg={4}  sm={12} xs={12}>
        <div style={{width: "480px", 
    height:"250px",
    
    overflowX:"scroll",
    
   
    margin:"auto"
    }}>
      
        {answers.map((tile,i) => {
 if(tile.status==="correct") corrected=corrected +1;
 else if(tile.status==="wrong") wronged=wronged+1;
 else lefted=lefted+1;

})}

      
        <Button color="primary" style={{margin:"10px"}} variant="contained"  
       
        
        >
            {corrected}
        </Button>

        <p style={{display:"inline-block"}}>Correct Answers</p>
<br /> 

        <Button color="secondary" style={{margin:"10px"}} variant="contained"  
       
        
       >
           {wronged} 
       </Button>
       <p style={{display:"inline-block"}}>Wrong Answers</p>
<br />
       <Button style={{margin:"10px"}} variant="contained"  
       
        
       >
           {lefted} 
       </Button>

       <p style={{display:"inline-block"}}>Unattempted</p>

      
          
       
     </div>
   <br />
        <div style={{width: "480px", 
    height:"400px",
    
    overflowY:"scroll",
    
   
    margin:"auto"
    }}>
      
        {questions.map((tile,i) => {
            if(answers[i].status==="correct") bcolor="primary";
            else if(answers[i].status==="wrong") bcolor="secondary";
            else bcolor="";
  

        return(
        <Button color={bcolor} style={{margin:"5px"}} variant="contained"  onClick={()=>{history.push(`/writexam/${examName}_${examType}/result/${i+1}`)
       
        
        }}>
            {i+1}
        </Button>
        );
          
        })}
     </div>
   
   
    </Grid>
</Grid>
</div>


    );




}

export default Result;