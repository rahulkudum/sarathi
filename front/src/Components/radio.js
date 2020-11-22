import React,{useState,useContext} from "react"
import {FormControl,FormLabel,RadioGroup,FormControlLabel,Radio,Button,TextField,Backdrop,CircularProgress} from "@material-ui/core"

import axios from"axios"
import { useHistory } from "react-router-dom";
import { UserName } from "./storage";
import { makeStyles } from '@material-ui/core/styles';

export default function Options() {
    const [name,setName]=useContext(UserName);
    const [questions,Setquestions]=useState([1,2,3,4,5,6,7,8,9,10]);
    const [answers, setAnswers] = useState(["none","none","none","none","none","none","none","none","none","none"]);
    let history =useHistory();
    const [backdrop,setBackdrop]=useState(false);
  
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const classes = useStyles();
  
    return (
      <div>
       <Backdrop className={classes.backdrop} open={backdrop} >
        <CircularProgress color="inherit" />
      </Backdrop>
    <TextField id="standard-basic" label="Your Name" value={name} onChange={(e)=>{
            setName(e.target.value)
          }}  />
          <br />
          <br />
      {questions.map((que,i)=>{
  
        return(
          <div>
        
          <FormControl component="fieldset">
        <FormLabel component="legend">{`${que} question`}</FormLabel>
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
        console.log(name);
  
        console.log(answers);
        let tmarks=0;
  
        for(let i in answers ){
         if(!isNaN(Number(answers[i]))){
          if(Number(answers[i])===1){
            console.log("correct");
            tmarks=tmarks+4;
          }
         else{
            console.log("rong");
           tmarks=tmarks-1;
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
  
      </div>
    );
}