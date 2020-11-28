import React, { useContext,useEffect,useState } from "react";
import { Route, useHistory, useParams,Switch,useRouteMatch } from "react-router-dom";
import axios from "axios";
import { Answers, ExamName, ExamType,Questions,UserName,Time, Time2 } from "./storage";

import { Backdrop,CircularProgress } from "@material-ui/core";
import Options from "./radio";

import {GoogleLogin} from "react-google-login";
import { makeStyles } from '@material-ui/core/styles';
import Result from "./result";


function Login(){

    let { path, url } = useRouteMatch(); 

let {examdetails}=useParams();
let examname= examdetails.slice(0,examdetails.indexOf("_"));
let examtype=examdetails.slice(examdetails.indexOf("_")+1);

const [examName,setExamName]=useContext(ExamName);
const [examType,setExamType]=useContext(ExamType);
const [questions,setQuestions]=useContext(Questions);
const [answers,setAnswers]=useContext(Answers);
const [mail,setMail]=useContext(UserName);
const [backdrop,setBackdrop]=useState(false);
const [time,setTime]=useContext(Time);
const [time2,setTime2]=useContext(Time2);

let history=useHistory();
const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));
  
  const classes = useStyles();

useEffect(() => {
    console.log("gvhbjn");
    setBackdrop(true);
    axios.post("/exam/find",{examname:examname,examtype:examtype})
    .then(res=>{

        console.log(res)
        setExamName(examname);
        setExamType(examtype);
        setQuestions(res.data.questions);
        setBackdrop(false);
   })
   
}, [])








    return(
   
    <Switch>
<Route exact path={path}>
<div style={{textAlign:"center"}}>
<Backdrop className={classes.backdrop} open={backdrop} >
    <CircularProgress color="inherit" />
    </Backdrop>
    <h1 style={{fontFamily:"cursive"}}>Sarthi Academy</h1>
    <div style={{border: "1px solid blue"}}>
<p>To write {examName} ({examType}) Please Login through your G-mail</p>
<GoogleLogin

    clientId="526565895378-u0tum8dtdjgvjmpp46ait2ojo8o0q2qi.apps.googleusercontent.com"
    buttonText="Login through Gmail"
    onSuccess={(res)=>{
        setBackdrop(true);
        axios.post("/user/find",{mail:res.profileObj.email})
        .then(resp=>{
            if(resp.data){
                let exsists=false;
for(let i=0;i<resp.data.exams.length;i++ ){
    if(resp.data.exams[i].examname===examName && resp.data.exams[i].examtype===examType) exsists=true; 
}

if(exsists) {
    setBackdrop(false);
    alert("Sorry you can only write the exam once");

}

if(!exsists){
setAnswers([]);


setMail(res.profileObj.email);

questions.map((val,i)=>{

setAnswers(prev=>{
   let dum=[...prev];
   dum.push({answer:"",danswer:"",visited:false,review:false,status:"",correct:"",time:0,image:val.image});
   return dum;
})
})


setTime(Date.now());
setTime2(Date.now()+10800000);
console.log(time,Date.now());
setBackdrop(false);
history.push(`${url}/paper/1`);

}

            }else{
                setBackdrop(false);
               alert("Sorry You are not eligible to write the exam");
               
            }
        })
    }}
    onFailure={(res)=>{
        setBackdrop(false);
        alert("You have failed to login in, Please try again");
    }}
    cookiePolicy={'single_host_origin'}
   
/>

<p>To see your Dahboard Please Login through your G-mail </p>

<GoogleLogin

    clientId="526565895378-u0tum8dtdjgvjmpp46ait2ojo8o0q2qi.apps.googleusercontent.com"
    buttonText="Login through Gmail"
    onSuccess={(res)=>{
        setBackdrop(true);
        axios.post("/user/find",{mail:res.profileObj.email})
        .then(resp=>{
        history.push(`/studentsdashboard/${res.profileObj.email}`)
        })
    }}
    onFailure={(res)=>{
        setBackdrop(false);
        alert("You have failed to login in, Please try again");
    }}
    cookiePolicy={'single_host_origin'}
   
/>

<br />


</div>


</div>
    


</Route>

<Route path={`${path}/paper/:ind`} >
<Options />


</Route>

<Route path={`${path}/result/:ind`} >
<Result />


</Route>


    </Switch>
   
    
   ) 
}

export default Login;