import { Button,TextField,Backdrop,CircularProgress } from "@material-ui/core";
import React,{useState} from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

function Correction(){

    const [questionscount,setQuestionscount]=useState(0);
    const [show,setShow]=useState(false);
    const [questions,setQuestions]=useState([]);
    let history=useHistory();

    const [backdrop,setBackdrop]=useState(false);
  
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const classes = useStyles();

   return( 
   <div>
    <Backdrop className={classes.backdrop} open={backdrop} >
    <CircularProgress color="inherit" />
    </Backdrop>
   
  {!show ?
  <div>
  
   <TextField
   id="filled-number"
   label="Number of Questions"
   type="number"
   InputLabelProps={{
     shrink: true,
   }}
   variant="filled"
   value={questionscount}
   onChange={(e)=>{setQuestionscount(e.target.value)}}
 />
 <br />
 <br />
 <Button variant="contained" color="primary" onClick={()=>{
     for(let i=0;i<questionscount;i++ ){

         setQuestions(prev=>{
            let dum=[...prev];
            dum.push({answer:"",correct:"",wrong:""});
            return dum;


         })
         
              }
     
     
     setShow(true)
 
 
 
 }} >
    Next
  </Button>
</div>  : <div>

{questions.map((val,i)=>{

    return(
        <div>

<p>Question No {i+1} </p>


    <TextField
   id="filled-number"
   label="Answer"
   type="number"
   InputLabelProps={{
     shrink: true,
   }}
   variant="filled"
   value={val.answer}
   onChange={(e)=>{
    setQuestions(prev=>{
            let dum=[...prev];
            dum[i].answer=e.target.value;
            return dum;


         })
   }}
 />

<TextField
   id="filled-number"
   label="Correct Marks"
   type="number"
   InputLabelProps={{
     shrink: true,
   }}
   variant="filled"
   value={val.correct}
   onChange={(e)=>{
    setQuestions(prev=>{
            let dum=[...prev];
            dum[i].correct=e.target.value;
            return dum;


         })
   }}
 />


<TextField
   id="filled-number"
   label="Wrong Marks"
   type="number"
   InputLabelProps={{
     shrink: true,
   }}
   variant="filled"
   value={val.wrong}
   onChange={(e)=>{
    setQuestions(prev=>{
            let dum=[...prev];
            dum[i].wrong=e.target.value;
            return dum;


         })
   }}
 />

<br />

 </div>

    );





})}
<br />
<Button variant="contained" color="primary" onClick={()=>{
    console.log(questions);
    axios.post("/exam/add",{questionscount:questionscount,questions:questions})
    .then(res=>{
        console.log(res);
        setBackdrop(false);
        history.push("/");
    })
    




}} >
    Submit
</Button>




</div>



}



 

   </div>
   
   
    );


}


export default Correction;