import { Button,TextField,Backdrop,CircularProgress,Dialog,DialogActions,DialogContent,DialogTitle } from "@material-ui/core";
import React,{useContext, useState,useEffect} from "react";
import axios from "axios";
import { Route, useHistory,useRouteMatch,Switch } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Question from "./question";
import { ExamName, ExamType, Questions,Modify,Mode } from "./storage";
import Examresult from "./examresult";
function Correction(){
  let { path, url } = useRouteMatch();
    
    const[pasword,setPasword]=useState("");
    const[show2,setShow2]=useState(false);
    const [dialog,setDialog]=useState(false);
    const [questions,setQuestions]=useContext(Questions);
    let history=useHistory();

    const [backdrop,setBackdrop]=useState(false);
    let examtypes=["mains","neet","advanced"];
    const[examName,setExamName]=useContext(ExamName);
    const [examType,setExamType]=useContext(ExamType);
    const[texamName,setTexamName]=useState("");
    const [texamType,setTexamType]=useState("mains");
  
    const [examList,setExamList]=useState([]);
    const [modify,setModify]=useContext(Modify);
   
    const [mode,setMode]=useContext(Mode);
  
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const classes = useStyles();
useEffect(()=>{
  setBackdrop(true);
  setExamType("mains");

  axios.get("/exam/")
  .then(res=>{
    setExamList(res.data);
    setBackdrop(false);
  })

},[]);




   return( 

    <Switch >

<Route exact path={path} >

   
   <div>
    
   
  
  <div>
  {(show2 || mode==="teacher") ?
  <div>
  <Backdrop className={classes.backdrop} open={backdrop} >
    <CircularProgress color="inherit" />
    </Backdrop>
   <TextField
   id="filled-number"
   label="Exam Name"
   type="text"
   InputLabelProps={{
     shrink: true,
   }}
  
   value={texamName}
   onChange={(e)=>{setTexamName(e.target.value);
  }}
 />
 <br />
 <br />
 <TextField
          id="outlined-select-currency-native"
          select
          label="Exam Type"
          value={texamType}
          onChange={(e)=>{setTexamType(e.target.value);
         }}
          SelectProps={{
            native: true,
          }}
          helperText="Please select the exam type"
          variant="outlined"
        >
        {examtypes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          </TextField>
          <br />
          <br />



          
 <Button variant="contained" color="primary" onClick={()=>{

   if(texamName){

     let done=false;

     examList.map((val,i)=>{
       if(texamName===val.examname && texamType===val.examtype) done=true;
     })

     if(!done){
  

  setQuestions([]);

if(texamType==="mains"){


  
     for(let i=0;i<75;i++ ){

         setQuestions(prev=>{
            let dum=[...prev];
            dum.push({answer:"",correct:"",wrong:"",image:null});
            return dum;


         })
         
              

              
}
console.log(questions);
setTexamName("");

history.push(`${url}/paper/1`)
     
     
   }   

     }else{
       alert("This Exam already exists");
     } 
 
   }else{
     alert("please write the exam name");
   }
 
 }} >
    Next
  </Button>


  {examList ? <h2>Modify or Delete previous Exams</h2> :<h2>No Previous Exams Found</h2>}
  <p style={{display:"inline-block",width:"50px",margin:"10px"}}>S.No</p>
  <p style={{display:"inline-block",width:"300px"}}>Exam Name</p>
  <p style={{display:"inline-block",width:"100px"}}>Exam Type</p>

{examList.map((val,i)=>{
  if( val ){
return(
  

  <div>
  <p style={{display:"inline-block",width:"50px",margin:"10px"}}>{i+1}</p>
<p style={{display:"inline-block",width:"300px"}}>{val.examname}</p>
<p style={{display:"inline-block",width:"100px",margin:"10px" }}>{val.examtype}</p>
<Button variant="contained" color="primary" onClick={()=>{
  setExamName(val.examname);
  setExamType(val.examtype);
  setQuestions(val.questions);
  
questions.map((val,i)=>{
  if(i!==0 ){
if(val.image){

   
axios.get(`/images/${val.image}`);



}

  }
});

  setModify(true);
  history.push(`${url}/paper/1`);
}}>
  Modify
</Button>


<Button style={{margin:"20px"}} variant="contained" color="primary" onClick={()=>{
  
  history.push(`${url}/result/${val.examname}_${val.examtype}`)


}}>
  Result
</Button>


<Button style={{margin:"20px"}} variant="contained" color="secondary" onClick={()=>{
  setDialog(i+1);

}}>
  Delete
</Button>



  </div> 
  
);
  }


})}



<Dialog
        open={dialog}
        onClose={()=>{setDialog(false)}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure to Delete"}</DialogTitle>
        <DialogContent>
         Once deleted you cannot get it back again
        </DialogContent>
       
        <DialogActions>
          <Button onClick={()=>{
            setBackdrop(true);
  axios.post("/exam/delete",{examname:examList[dialog-1].examname,examtype:examList[dialog-1].examtype})
  .then(res=>{
    setExamList(prev=>{
      let dum=[...prev];
     dum= dum.map(item=>{
       if(item){
       if (item.examname!==examList[dialog-1].examname || item.examtype!==examList[dialog-1].examtype) return item }
     });
      console.log(dum);
      return dum;
    })

    console.log(examList);
    setBackdrop(false);
  });
          
            
            
            setDialog(false)}} color="primary">
            Yes
          </Button>
          <Button onClick={()=>{setDialog(false)}} color="primary" autoFocus>
           No
          </Button>
        </DialogActions>
      </Dialog>

  
  </div> :<div>
  <TextField
          id="standard-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={pasword}
          onChange={(e)=>setPasword(e.target.value)}
        />
        <br />
        <br />

<Button variant="contained" color="primary" onClick={()=>{

    if(pasword==="sarathi"){
        setMode("teacher");
        setShow2(true);
    }else{
       alert("wrong password, try again")
    }
}} >
    Go
</Button>






  </div> }
</div>  


   </div>
   </Route>
<Route path={`${path}/paper/:ind`}>

<Question   />

</Route>

<Route path={`${path}/result/:examdetails`}>

<Examresult />

</Route>



   </Switch>
   
    );


}


export default Correction;