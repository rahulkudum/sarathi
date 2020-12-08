import React, { useContext,useEffect,useState } from "react";
import { Route, useHistory, useParams,Switch,useRouteMatch } from "react-router-dom";
import axios from "axios";
import { Answers, ExamName, ExamType,Questions,UserName,Time, Time2, Mode, Time3,Switches } from "./storage";

import { Backdrop,CircularProgress,Grid } from "@material-ui/core";
import Options from "./radio";

import {GoogleLogin} from "react-google-login";
import { makeStyles } from '@material-ui/core/styles';
import Result from "./result";
import logo from "../logo.png"; 

// export let equestions;

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
const [time3,setTime3]=useContext(Time3);
const [mode,setMode]=useContext(Mode);
const [switches,setSwitches]=useContext(Switches);
const [finished,setFinished]=useState(false);


// equestions=questions;

let history=useHistory();
const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));
  
  const classes = useStyles();

useEffect(() => {
    
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



function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  }






    return(
   
    <Switch>
<Route exact path={path}>
<div style={{textAlign:"center"}}>
<Backdrop className={classes.backdrop} open={backdrop} >
    <CircularProgress color="inherit" />
    </Backdrop>
   
    <div style={{border: "1px solid black"}}>
<p>To write {examName} please login through your G-mail</p>
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

if(exsists  ) {
    setBackdrop(false);
    alert("Sorry you can only write the exam once");

}

if(!exsists ){
    
    

setAnswers([]);


setMail(res.profileObj.email);

questions.map((val,i)=>{

setAnswers(prev=>{
   let dum=[...prev];
   dum.push({answer:"",danswer:"",visited:false,review:false,status:"",correct:"",time:0,image:val.image});
   return dum;
})
})

let exams = resp.data.exams;

let ptime=resp.data.time;

 ptime.push({examname:examName,examtype:examType,stime: new Date().toLocaleTimeString("en-US"),dur:msToTime(time2-time)});    



setMode(res.profileObj.email);

setTime3({time:0,physics:0,chemistry:0,maths:0});
setSwitches(0);



questions.map((val,i)=>{
if(i!==0 ){

if(val.image){


axios.get(`/images/${val.image}`);



}
}


});

axios.post("/user/updat", { mail: res.profileObj.email , exams: exams,time:ptime  })
  .then(res => {
    console.log(res);

})

setTime(Date.now());
setTime2(Date.now()+10800000);
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

<br />
<br />
<br />


<p>To see your Dashboard please login through your G-mail </p>

<GoogleLogin

    clientId="526565895378-u0tum8dtdjgvjmpp46ait2ojo8o0q2qi.apps.googleusercontent.com"
    buttonText="Login through Gmail"
    onSuccess={(res)=>{
        setBackdrop(true);
        axios.post("/user/find",{mail:res.profileObj.email})
        .then(resp=>{
            if(resp.data){
                setMode(res.profileObj.email);
                setBackdrop(false);
        history.push(`/studentsdashboard/${res.profileObj.email}`)
            }else{
                setBackdrop(false);
                               alert("Sorry You are not eligible to write Exams");
            }
        })
    }}
    onFailure={(res)=>{
        setBackdrop(false);
        alert("You have failed to login in, Please try again");
    }}
    cookiePolicy={'single_host_origin'}
   
/>

<p>(you may see it after writing the exam)</p>


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



// local 526565895378-md97pueiv8m2t3c682eamv293tt4gaa6.apps.googleusercontent.com

// floating 526565895378-u0tum8dtdjgvjmpp46ait2ojo8o0q2qi.apps.googleusercontent.com