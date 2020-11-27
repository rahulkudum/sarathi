import { Button,TextField,Backdrop,CircularProgress,RadioGroup,FormControlLabel,FormControl,FormLabel,Radio,GridList,GridListTile,Grid } from "@material-ui/core";
import React,{useContext, useEffect, useState} from "react";
import axios from "axios";
import { Route, useHistory,useParams, useRouteMatch } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { Answers, ExamName, ExamType, Marks, Questions,Time,Time2,UserName } from "./storage";
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';

function Options(){

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
    const [tmarks,setMarks]=useContext(Marks);
 
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
  let tcolor;
  let notvisited=0;
  let unanswered=0;
  let review=0;
  let answered=0;
  let areview=0;

  useEffect(()=>{
    console.log("gyhbj")
   setAnswers(prev=>{
     let dum=[...prev];
     dum[nind-1].visited=true;
     dum[nind-1].color="secondary"
     return dum;
   })
  
    console.log(answers[nind-1].visited);
     setImageloading(true);

    
  },[nind]);

  function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + ":" + minutes + ":" + seconds ;
  }

  useEffect(()=>{

 let rtime= setInterval(() => {

       setTime2(Date.now());
  
     if(Date.now()-time>=300000) {
       setBackdrop(true);

      let marks=0;

      questions.map((val,i)=>{
        if(answers[i].answer){
          if(val.answer===answers[i].answer){
              marks=marks+Number(val.correct);
              setAnswers(prev=>{
                let dum=[...prev];
                dum[i].status="correct";
                return dum;
              })
          }else{
            marks=marks+Number(val.wrong);
              setAnswers(prev=>{
                let dum=[...prev];
                dum[i].status="wrong";
                return dum;
              })

          }
        }else{
          setAnswers(prev=>{
                let dum=[...prev];
                dum[i].status="left";
                return dum;
              })


        }
      })



     axios.post("/user/find",{mail:mail})
     .then(res=>{

      let exsists=false;
      console.log(res,mail);
     
               
for(let i=0;i<res.data.exams.length;i++ ){
   if(res.data.exams[i].examname===examName && res.data.exams[i].examtype===examType) exsists=true; 
}

if(exsists) {
  
  setBackdrop(false);
  clearInterval(rtime);
  alert("sorry you have already submitted answers for this exam");

history.push(`/writexam/${examName}_${examType}`);
}else{



      let exams=res.data.exams;
      exams.push({
        examname:examName,
        examtype:examType,
        answers:answers,
        marks:marks
      });

      console.log(marks,exams); 

      axios.post("/user/updat",{mail:mail,exams:exams})
      .then(res=>{
        console.log(res);
        setMarks(marks);
        setBackdrop(false);
        clearInterval(rtime);
        history.push(`/writexam/${examName}_${examType}/result/1`)
      })
}

            })


        


     }
     
      
  
  
  
    }, 1000);
    

  },[]);

  
 
 
    return(
        <div className={classes.root1}>
        <Backdrop className={classes.backdrop} open={backdrop} >
    <CircularProgress color="inherit" />
    </Backdrop>
        <Grid container >
        <Grid item lg={12} >
            <h1 style={{display:"inline-block"}}>Sarathi Online Exam </h1>
            <h1 style={{display:"inline-block"}}>{examName}({examType}) </h1>
            <h1 style={{display:"inline-block"}}>{msToTime(10800000-(time2-time))}</h1>
            
        </Grid>
        <Grid item lg={8}   xs={12} sm={12}  >
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
 
  <RadioGroup row aria-label="options" name="options" value={answers[nind-1].danswer} onChange={(e)=>{
    
    console.log(answers);
    setAnswers(prev=>{

let dum=[...prev];
dum[nind-1].danswer=e.target.value;


return dum;

  })}}>
    <FormControlLabel value="1" control={<Radio />} label="1)" />
    <FormControlLabel value="2" control={<Radio />} label="2)" />
    <FormControlLabel value="3" control={<Radio />} label="3)" />
    <FormControlLabel value="4" control={<Radio />} label="4)" />
  </RadioGroup>
</FormControl> :<TextField id="standard-basic" label="Answer" style={{marginBottom:"10px"}} value={answers[nind-1].danswer} onChange={(e)=>{setAnswers(prev=>{
  
  let dum=[...prev];
  dum[nind-1].danswer=e.target.value;
 
  
  return dum;
  
    })}} />}

  <br />

  <Button variant="contained" style={{backgroundColor:"#43d001",color:"white",fontSize:15,margin:"5px"}} onClick={()=>{
    if(answers[nind-1].danswer || answers[nind-1].answer){

    setAnswers(prev=>{
      let dum=[...prev];
      dum[nind-1].answer=dum[nind-1].danswer;
     
      return dum;
    })
    if(nind!==5)     history.push(`/writexam/${examName}_${examType}/paper/${nind+1}`);
    else history.push(`/writexam/${examName}_${examType}/paper/1`);

    }else{
      alert("Please Select a Option");
    }
  }}>
  Save and Next
  </Button>

 
  <Button variant="contained" style={{fontSize:15,margin:"5px",backgroundColor:"#e6e6e6",borderColor: "#adadad"}} onClick={()=>{
    setAnswers(prev=>{
      let dum=[...prev];
      dum[nind-1].answer="";
      dum[nind-1].danswer="";
      
     
      return dum;
    })
     
  }}>
  Clear
  </Button>

  <Button variant="contained"  style={{backgroundColor:"#ec971f",color:"white",fontSize:15,margin:"5px"}}  onClick={()=>{
   
   if(answers[nind-1].danswer || answers[nind-1].answer){
    setAnswers(prev=>{
      let dum=[...prev];
      dum[nind-1].answer=dum[nind-1].danswer;
      dum[nind-1].review=true;
      return dum;
    })
    if(nind!==5) history.push(`/writexam/${examName}_${examType}/paper/${nind+1}`);
    else history.push(`/writexam/${examName}_${examType}/paper/1`);

    }else{
      alert("Please Select a Option");
    }
  }}>
 Save and Mark for Review
  </Button>

  <Button variant="contained"  style={{backgroundColor:"#286090",color:"white",fontSize:15,margin:"5px"}}  onClick={()=>{
    setAnswers(prev=>{
      let dum=[...prev];
     
      dum[nind-1].review=true;
      return dum;
    })
    if(nind!==5) history.push(`/writexam/${examName}_${examType}/paper/${nind+1}`);
    else history.push(`/writexam/${examName}_${examType}/paper/1`);
  }}>
 Mark for Review and Next 
  </Button>

  <hr style={{width:"800px"}}/>

  <Button  variant="contained" style={{margin:"5px",backgroundColor:"#e6e6e6",borderColor: "#adadad"}} onClick={()=>{
    if(nind!==1) history.push(`/writexam/${examName}_${examType}/paper/${nind-1}`);
    else history.push(`/writexam/${examName}_${examType}/paper/5`);
  }}  >
    Back
  </Button>

  <Button variant="contained" style={{margin:"5px",backgroundColor:"#e6e6e6",borderColor: "#adadad"}} onClick={()=>{
      if(nind!==5) history.push(`/writexam/${examName}_${examType}/paper/${nind+1}`);
    else history.push(`/writexam/${examName}_${examType}/paper/1`);
  }}  >
    Next
  </Button>

  <Button variant="contained" style={{margin:"5px",backgroundColor:"#43d001",color:"white"}} onClick={()=>{
      let marks=0;
      setBackdrop(true);

      questions.map((val,i)=>{
        if(answers[i].answer){
          if(val.answer===answers[i].answer){
              marks=marks+Number(val.correct);
              setAnswers(prev=>{
                let dum=[...prev];
                dum[i].status="correct";
                dum[i].correct=val.answer;
                return dum;
              })
          }else{
            marks=marks+Number(val.wrong);
              setAnswers(prev=>{
                let dum=[...prev];
                dum[i].status="wrong";
                dum[i].correct=val.answer;
                return dum;
              })

          }
        }else{
          setAnswers(prev=>{
                let dum=[...prev];
                dum[i].status="left";
                dum[i].correct=val.answer;
                return dum;
              })


        }
      })

     axios.post("/user/find",{mail:mail})
     .then(res=>{
       let exsists=false;
       console.log(res,mail);
      
               
for(let i=0;i<res.data.exams.length;i++ ){
    if(res.data.exams[i].examname===examName && res.data.exams[i].examtype===examType) exsists=true; 
}

if(exsists) {setBackdrop(false);
  alert("sorry you have already submitted answers for this exam");
history.push(`/writexam/${examName}_${examType}`);
}else{



       let exams=res.data.exams;
       exams.push({
         examname:examName,
         examtype:examType,
         answers:answers,
         marks:marks
       });

       console.log(marks,exams); 

       axios.post("/user/updat",{mail:mail,exams:exams})
       .then(res=>{
         console.log(res);
         setMarks(marks);
         setBackdrop(false);
         history.push(`/writexam/${examName}_${examType}/result/1`)
       })
}

            })

     

    }} >
    Submit
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
  if (answers[i].answer && answers[i].review) areview=areview+1;       
  else if(answers[i].answer ) answered=answered+1;
  else if (answers[i].review) review=review+1;
  else if(answers[i].visited) unanswered=unanswered+1; 
  else notvisited=notvisited+1;

  if(answers[i].visited) tcolor="white";
  else tcolor=""
})}

      
        <Button style={{margin:"10px"}} variant="contained"  
       
        
        >
            {notvisited}
        </Button>

        <p style={{display:"inline-block",marginRight:"20px"}}>Not Visited</p>


        <Button style={{backgroundColor:"red",color:"white",margin:"10px"}} variant="contained"  
       
        
       >
           {unanswered} 
       </Button>
       <p style={{display:"inline-block"}}>Not Answered</p>
<br />
       <Button style={{backgroundColor:"#43d001",color:"white",margin:"10px"}} variant="contained"  
       
        
       >
           {answered} 
       </Button>

       <p style={{display:"inline-block",marginRight:"20px"}}>Answered</p>

       <Button style={{backgroundColor:"#52057b",color:"white",margin:"10px"}} variant="contained"  
       
        
       >
           {review} 
       </Button>
       <p style={{display:"inline-block"}}>Marked for Review</p>
<br />
       <Button style={{backgroundColor:"#52057b",color:"white",margin:"10px"}} variant="contained"  
       
        
       >
           {areview}  <CheckCircleOutlineRoundedIcon style={{fontSize:15,backgroundColor:"green"}} /> 
       </Button>
        
       <p style={{display:"inline-block"}}>Answered & Marked for Review </p>
        
          
       
     </div>
   <br />
     <div style={{width: "480px", 
    height:"400px",
    
    overflowY:"scroll",
    
   
    margin:"auto"
    }}>
      
        {questions.map((tile,i) => {
  if (answers[i].answer && answers[i].review) bcolor="#52057b";       
  else if(answers[i].answer ) bcolor="#43d001";
  else if (answers[i].review) bcolor="#52057b";
  else if(answers[i].visited) bcolor="red"; 
  else bcolor="";

  if(answers[i].visited) tcolor="white";
  else tcolor=""
  

        return(
        <Button style={{backgroundColor:`${bcolor}`,color:`${tcolor}`,margin:"5px"}} variant="contained"  onClick={()=>{history.push(`/writexam/${examName}_${examType}/paper/${i+1}`)
       
        
        }}>
            {i+1} {(answers[i].answer && answers[i].review) ? <CheckCircleOutlineRoundedIcon style={{fontSize:15,backgroundColor:"green"}} /> :null }
        </Button>
        );
          
        })}
     </div>
   
   
    </Grid>
</Grid>
</div>


    );




}

export default Options;