import { Button,TextField,Backdrop,CircularProgress,RadioGroup,FormControlLabel,FormControl,FormLabel,Radio,GridList,GridListTile,Grid } from "@material-ui/core";
import React,{useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import { Route, useHistory,useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { ExamName, ExamType, Modify, Questions } from "./storage";
import ScrollToTop from "./scroll";



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



    const [imageloading,setImageloading]=useState(false);
    const [questions,setQuestions]=useContext(Questions);
    const [examName,setExamName]=useContext(ExamName);
    const [examType,setExamType]=useContext(ExamType);
    const [modify,setModify]=useContext(Modify);
   
    const classes = useStyles();
    let questionType;
console.log(questions);
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

useEffect(()=>{
   
   
    setImageloading(true);

   
 },[nind]);


 
    return(
        <div className={classes.root1}>
        <ScrollToTop />
        <Backdrop className={classes.backdrop} open={backdrop} >
    <CircularProgress color="inherit" />
    </Backdrop>
        <Grid container >
        
        <Grid item xl={8} lg={8} md={12}  xs={12} sm={12}  >
        <h2 style={{textAlign:"center"}}>Question {nind}</h2>
        <div>
        <div>
            <input  type="file" name="file" id="file"  onChange={(e)=>{
     
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

 console.log(res);
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
        
      
        <div style={{width: "100%", 
    height:"500px",
    overflowX:"scroll",
    overflowY:"scroll",
    whiteSpace: "nowrap",
    textAlign:"center",
   
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
       

         <Grid item xl={4} lg={4} md={12}  sm={12} xs={12} style={{marginTop:"auto",marginBottom:"auto"}}>
        <div style={{width: "100%", 
    height:"700px",
    overflowY:"scroll",
    margin:"auto"
    }}>
    <div>
    <label>Physics 25 Ques: </label>
    <input  type="file" name="file" id="file" multiple  onChange={(e)=>{
     
     let img=e.target.files;

     if(img.length===25){
   
     const formData =new FormData();

     for (const key of Object.keys(img)) {
            formData.append('file', img[key])
        }

console.log(formData);






setBackdrop(true);
axios.post("/uploadMultiple",formData)
.then(res=>{

 console.log(res);
 
axios.get("/files").then(res=>{
 res.data.slice(1).slice(-2).map((val,i)=>{

  setQuestions(prev=>{
     let dum=[...prev];
dum[i].image=val.filename;
return dum;
 })



 })
 setBackdrop(false);

})

 

})

     }else{
       alert("please select exactly 25 images")
     }
    
   }} /> 

<br />
<br />

<label>Chemistry 25 Ques: </label>
    <input  type="file" name="file" id="file" multiple  onChange={(e)=>{
     
     let img=e.target.files;

     if(img.length===25){
   
     const formData =new FormData();

     for (const key of Object.keys(img)) {
            formData.append('file', img[key])
        }

console.log(formData);






setBackdrop(true);
axios.post("/uploadMultiple",formData)
.then(res=>{

 console.log(res);
 
axios.get("/files").then(res=>{
 res.data.slice(1).slice(-2).map((val,i)=>{

  setQuestions(prev=>{
     let dum=[...prev];
dum[25+i].image=val.filename;
return dum;
 })



 })
 setBackdrop(false);

})

 

})

     }else{
       alert("please select exactly 25 images")
     }
    
   }} /> 

<br />
<br />
<label>Maths 25 Ques: </label>
    <input  type="file" name="file" id="file" multiple  onChange={(e)=>{
     
     let img=e.target.files;

     if(img.length===25){
   
     const formData =new FormData();

     for (const key of Object.keys(img)) {
            formData.append('file', img[key])
        }

console.log(formData);






setBackdrop(true);
axios.post("/uploadMultiple",formData)
.then(res=>{

 console.log(res);
 
axios.get("/files").then(res=>{
 res.data.slice(1).slice(-2).map((val,i)=>{

  setQuestions(prev=>{
     let dum=[...prev];
dum[50+i].image=val.filename;
return dum;
 })



 })
 setBackdrop(false);

})

 

})

     }else{
       alert("please select exactly 25 images")
     }
    
   }} /> 
  
</div>
<br />
        
        {questions.map((tile,i) => (
         
        <Button style={{margin:"5px"}} variant="contained" color={(questions[i].image && questions[i].answer) ? "primary" : "secondary"} onClick={()=>history.push(`/setexam/paper/${i+1}`)}>
            {i+1}
        </Button>
         
        ))}
     </div>
    <br />
    <div style={{textAlign:"center"}}>
    <Button variant="contained" color="primary" onClick={()=>{
      


    if(!modify){
      setBackdrop(true);
    axios.post("/exam/add/",{examname:examName,examtype:examType,questions:questions})
    .then(res=>{
        console.log(res);
       
        setExamName("");
        setExamType("mains");
        setBackdrop(false);
        history.push("/setexam");
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
        history.push("/setexam");
    })
    .catch(err=>{
        console.log(err);
    });



    }

    }}>
        Save
    </Button>
    </div>
   
    </Grid>
</Grid>
</div>


    );




}

export default Question;