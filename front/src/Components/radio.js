import React,{useState,useContext,useEffect} from "react"
import {FormControl,FormLabel,RadioGroup,FormControlLabel,Radio,Button,TextField,Backdrop,CircularProgress} from "@material-ui/core"

import axios from"axios"
import { useHistory } from "react-router-dom";
import { UserName } from "./storage";
import { makeStyles } from '@material-ui/core/styles';


export default function Options() {
    const [name,setName]=useContext(UserName);
    const [questions,setQuestions]=useState([]);
    const [answers, setAnswers] = useState([]);
    let history =useHistory();
    const [backdrop,setBackdrop]=useState(false);
    const [show,setShow]=useState(false);
    const[show2,setShow2]=useState(false);
  
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const classes = useStyles();

useEffect(()=>{

if(show){
  setBackdrop(true);
  axios.get("/exam/")
  .then(res=>{
    console.log(res);
    let questionscount=res.data[res.data.length-1].questionscount;
    setQuestions(prev=>{
      return res.data[res.data.length-1].questions
    })
    for(let i=0; i<Number(questionscount);i++ ){
      setAnswers(prev=>{
        let dum=[...prev];
        dum.push("none");
        return dum;
      })
     
    } 

    setBackdrop(false);
    console.log(questionscount,questions,answers);
  })

  
}

},[show])






  
    return (
      <div>
       <Backdrop className={classes.backdrop} open={backdrop} >
        <CircularProgress color="inherit" />
      </Backdrop>

{show ?
<div>



   
      {questions.map((que,i)=>{
  
        return(
          <div>
        
          <FormControl component="fieldset">
        <FormLabel component="legend">{`${i+1} question`}</FormLabel>
        <RadioGroup aria-label="gender" name="gender1" value={Number(answers[i])} onChange={(e)=>{
  
          setAnswers(prev=>{
           
            let dum=[...prev];
            
            dum[i]=e.target.value;
            return dum;
          })
  
  
        }}>
          <FormControlLabel value={1} control={<Radio />} label="1" />
          <FormControlLabel value={2} control={<Radio />} label="2" />
          <FormControlLabel value={3} control={<Radio />} label="3" />
          <FormControlLabel value={4} control={<Radio />} label="4" />
        </RadioGroup>
      </FormControl>
          <br />
          </div>);
  
      })}
  
      <Button variant="contained" color="primary" onClick={()=>{
        setBackdrop(true);
       
  
        console.log(answers,questions);
        let tmarks=0;
  
        for(let i in answers ){
         if(!isNaN(Number(answers[i]))){
          if(Number(answers[i])===Number(questions[i].answer)){
            console.log("correct",i);
            tmarks=tmarks+Number(questions[i].correct);
          }
         else{
            console.log("wrong",i);
           tmarks=tmarks+Number(questions[i].wrong);
          }
          }
        }
  
  
        axios.post("/user/add/",{username:name,answers:answers,marks:tmarks})
        .then(res=>{
          
          setBackdrop(false);
          
          console.log(res)
        
          history.push("/result");
        
        });
  
       
        

       
  
  
       
  
  
  
  
  
  
  
      }} >
          Submit
        </Button>

        </div>  :<div>

        <TextField id="standard-basic" label="Your Name" value={name} onChange={(e)=>{
          
            setName(e.target.value)
          }}  />
       <Button variant="contained" color="primary" onClick={()=>{
         setBackdrop(true);
         axios.get("/user/")
         .then(res=>{
           let exsists=false;
           setBackdrop(false);
          
           for(let i=0;i<res.data.length;i++){
             
             if(res.data[i].username===name){
               console.log("working");              
              exsists=true;
              setShow2(true);
             }
           }

           if(!exsists){
             setShow(true);
           }

          
         })
       }} >
         GO
       </Button>

       {show2 ? <p>Sorry, you have already written the exam</p> :null}






        </div>}
  
      </div>
    );
}