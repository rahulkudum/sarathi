import { Button,TextField,Backdrop,CircularProgress,RadioGroup,Chip,FormControlLabel,FormControl,FormLabel,Radio,GridList,GridListTile,Grid } from "@material-ui/core";
import React,{useContext, useEffect, useState} from "react";
import axios from "axios";
import { Route, useHistory,useParams, useRouteMatch } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { Answers, Ctime, ExamName, ExamType, Marks,Mode,Switches,Time,Time2,Time3,UserName } from "./storage";
import ScrollToTop from "./scroll";
import logo from "../logo.png"; 
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';


function Result(){

let {path,url}=useRouteMatch();
let { ind } = useParams();
let history=useHistory();

let nind= Number(ind);
let questionType;



 
   
    const [examName,setExamName]=useContext(ExamName);
    const [examType,setExamType]=useContext(ExamType);
  
   
    const [answers,setAnswers]=useContext(Answers);
    const [mail,setMail]=useContext(UserName);
    const [time,setTime]=useContext(Time);
    const [time2,setTime2]=useContext(Time2);
    const [time3,setTime3]=useContext(Time3);
    
    const [backdrop,setBackdrop]=useState(false);
    const [imageloading,setImageloading]=useState(false);
    const [marks,setMarks]=useContext(Marks);
    const [mode,setMode]=useContext(Mode);
    const [ctime,setCtime]=useContext(Ctime);
    const [switches,setSwitches]=useContext(Switches);
    
 
if(examType==="mains"){

  if(  nind===21 || nind===22 || nind===23 || nind===24 || nind===25 
    || nind===46 || nind===47 || nind===48 || nind===49 || nind===50
    || nind===71 || nind===72 || nind===73 || nind===74 || nind===75
    
    
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

answers.map((val,i)=>{

  if(i<25){
    setTime3(prev=>{
      let dum = { ...prev};
      dum.physics=dum.physics+val.time;
      return dum;

    })
  }else if(i<50){

    setTime3(prev=>{
      let dum = { ...prev};
      dum.chemistry=dum.chemistry+val.time;
      return dum;

    })

    
  }else{

    setTime3(prev=>{
      let dum = { ...prev};
      dum.maths=dum.maths+val.time;
      return dum;

    })


  }





})


},[])





  useEffect(()=>{
   
   
     setImageloading(true);

    
  },[nind]);

  let corrected=0;
  let wronged=0;
  let lefted=0;

  function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return  "Time: "+minutes + ":" + seconds ;
  };

  function msToTime2(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return  hours +":"+minutes + ":" + seconds ;
  };

  let butcolor;
  if(answers[nind-1].status==="correct") butcolor="primary";
  else if(answers[nind-1].status==="wrong") butcolor="secondary";
  else butcolor=""; 
 
    return(
        <div className={classes.root1}>
        <ScrollToTop />
        <Backdrop className={classes.backdrop} open={backdrop} >
    <CircularProgress color="inherit" />
    </Backdrop>
        <Grid container >
        
        <Grid item xl={8} lg={8} md={12} sm={12} xs={12}>
       
        <div style={{display:"flex",justifyContent:"space-around"}}>
            <Chip size="large"
            label={examName}
            color="primary"
           


          />
          
          <h3 style={{ textAlign: "center",display:"inline-block",marginTop:"0px" }}>Question {nind}</h3>

          <Chip size="large"
            label={`${marks.total} marks`}
            color="primary"
           


          />
 </div>
           
        
            
        </Grid>
        <Grid item  xl={8} lg={8}   md={12} sm={12} xs={12} >
      
      
        
        <div>
       
       
        <div style={{width: "100%", 
    height:"360px",
    overflowX:"scroll",
    overflowY:"scroll",
    whiteSpace: "nowrap",
    textAlign:'center',
   
    margin:"auto"
    }}>

    {imageloading ? <div> <CircularProgress />  <img src={`/images/${answers[nind-1].image}`} onLoad={()=>{
         setImageloading(false);
         
        }} />
        </div>:<img src={`/images/${answers[nind-1].image}`}  />
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

 <br />
 <div style={{display:"flex",justifyContent:"space-around"}}>

 <Chip size="large" 
 label={msToTime(answers[nind-1].time)} 
 color="primary"


 />

<Chip size="large" 
 label={`Correct Answer: ${answers[nind-1].correct}`} 
 color="primary"


 />

<Chip size="large" 
 label={answers[nind-1].status} 
 color={butcolor}

 />




 </div>

  <hr style={{width:"100%"}}/>

  <div style={{backgroundColor:"#f1f6f9"}}>

  <Button  variant="contained" style={{margin:"5px",backgroundColor:"#e6e6e6",borderColor: "#adadad"}} onClick={()=>{
    if(nind!==1) history.push(`/writexam/${examName}_${examType}/result/${nind-1}`);
    else history.push(`/writexam/${examName}_${examType}/result/75`);
  }}  >
    Back
  </Button>

  <Button variant="contained" style={{margin:"5px",backgroundColor:"#e6e6e6",borderColor: "#adadad"}} onClick={()=>{
      if(nind!==75) history.push(`/writexam/${examName}_${examType}/result/${nind+1}`);
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

        </div>
        
      
        </Grid>
        <Grid item xl={4} lg={4} md={12}  sm={12} xs={12}>
        <div style={{width: "100%", 
    height:"200px",
    
    overflowX:"scroll",
    
    whiteSpace: "nowrap",
    border: "1px solid black",
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

        <p style={{display:"inline-block",width:"140px"}}>Correct Answers</p>
        <Chip size="large" 
 label={`Positve marks: ${marks.positive}`} 
 color="primary"
  style={{marginLeft:"15px",width:"180px"}}

 />

<Chip size="large" 
 label={`Physics marks: ${marks.physics}`} 
 color="primary"
  style={{marginLeft:"15px",width:"190px"}}

 />

<Chip size="large" 
 label={`Physics time: ${msToTime2(time3.physics)}`} 
 color="primary"
  style={{marginLeft:"15px",width:"220px"}}

 />



<br /> 

        <Button color="secondary" style={{margin:"10px"}} variant="contained"  
       
        
       >
           {wronged} 
       </Button>
       <p style={{display:"inline-block",width:"140px"}}>Wrong Answers</p>
       <Chip size="large" 
 label={`Negative marks: ${marks.negative}`} 
 color="secondary"
 style={{marginLeft:"15px",width:"180px"}}

 />

<Chip size="large" 
 label={`Chemistry marks: ${marks.chemistry}`} 
 color="primary"
  style={{marginLeft:"15px",width:"190px"}}

 />

<Chip size="large" 
 label={`Chemistry time: ${msToTime2(time3.chemistry)}`} 
 color="primary"
  style={{marginLeft:"15px",width:"220px"}}

 />

        
<br />
       <Button style={{margin:"10px"}} variant="contained"  
       
        
       >
           {lefted} 
       </Button>

       <p style={{display:"inline-block",width:"140px"}}>Unattempted</p>
       <Chip size="large" 
 label={`Total marks: ${marks.total}`} 
 
 style={{marginLeft:"15px",width:"180px"}}

 />

<Chip size="large" 
 label={`Maths marks: ${marks.maths}`} 
 color="primary"
  style={{marginLeft:"15px",width:"190px"}}

 />
 
 <Chip size="large" 
 label={`Maths time: ${msToTime2(time3.maths)}`} 
 color="primary"
  style={{marginLeft:"15px",width:"220px"}}

 />

        

      
          
       
     </div>
   
   {mode==="teacher"? 
   
   <div style={{width: "100%", 
    height:"150px",
    
    overflowY:"scroll",
    
    whiteSpace: "nowrap",
    border: "1px solid black",
    margin:"auto"
    }}>

<Chip size="large" 
 label={`No of Tab switches: ${switches-0.5}`} 
 color="primary"
 style={{margin:"5px",width:"220px"}}



 />
 <br />

 <Chip size="large" 
 label={`Total Time: ${time3.totaltime}`} 
 color="primary"
 style={{margin:"5px",width:"220px"}}


 />

<Chip size="large" 
 label={`actual Time: ${time3.actualtime}`} 
 color="primary"
style={{margin:"5px",width:"200px"}}

 />

<br />


{ctime.map((val,i)=>{

if(i===ctime.length-1){

  return(

  <Chip size="large" 
 label={`submitted at: ${val.stime}`} 
 color="primary"
 style={{margin:"5px",width:"220px"}}
 />
  );

}else{
  return(

    <div>
  <Chip size="large" 
 label={`attempt no ${i+1}: ${val.stime}`} 
 color="primary"
 style={{margin:"5px",width:"220px"}}

 />
 <Chip size="large" 
 label={`duration : ${ctime[i+1].dur}`} 
 color="primary"
 style={{margin:"5px",width:"200px"}}

 />
 </div>

  );

}


 }) 


}




    </div>
   
   
    : null}
        <div style={{width: "100%", 
    height:"400px",
    
    overflowY:"scroll",
    
   
    margin:"auto"
    }}>
      
        {answers.map((val,i) => {
            if(val.status==="correct") bcolor="primary";
            else if(val.status==="wrong") bcolor="secondary";
            else bcolor="";
  

        return(
        <Button color={bcolor} style={{margin:"5px"}} variant="contained"  onClick={()=>{history.push(`/writexam/${examName}_${examType}/result/${i+1}`)
       
        
        }}>
            {i+1}
            {val.review ? <BookmarkBorderIcon style={{ fontSize: 13, backgroundColor: "#52057b",color: "white"}} /> : null}
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