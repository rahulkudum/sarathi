
import React, { useContext, useState,useEffect } from "react";
import { UserName,ExamName,ExamType,Answers,Marks, Ctime, Time3, Switches,Mode } from "./storage";
import axios from "axios";
import { Route, useHistory, useParams,Switch,useRouteMatch } from "react-router-dom";
import { Button,Backdrop,CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import {GoogleLogin} from "react-google-login";
function Examlist(){

    let {ind}=useParams();
    let history=useHistory();

    const [mail,setMail]=useContext(UserName);
    const [examList,setExamList]=useState([]);
    const [examName,setExamName]=useContext(ExamName);
    const [examType,setExamType]=useContext(ExamType);
    const [timeList,setTimeList]=useState([]);  
    const [answers,setAnswers]=useContext(Answers);
    const [marks,setMarks]=useContext(Marks);
    const [backdrop,setBackdrop]=useState(false);
    const [ctime,setCtime]=useContext(Ctime);
    const [time3,setTime3]=useContext(Time3);
    const [switches,setSwitches]=useContext(Switches);
    const [show,setShow]=useState(false);
    const [mode,setMode]=useContext(Mode);

    console.log("count");

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));
  
  const classes = useStyles();
    useEffect(()=>{
      
        setMail(ind);
        
        console.log(ind,mail)
        setBackdrop(true);
        
        axios.post("/user/find",{mail:ind})
        .then(res=>{
            console.log(res.data);
            setExamList(res.data.exams);
            setTimeList(res.data.time);
            console.log(examList);
            setBackdrop(false);
        })


    },[])

    return(<div>
    {(show || mode===ind || mode==="teacher") ?
    <div>
    <Backdrop className={classes.backdrop} open={backdrop} >
      <CircularProgress color="inherit" />
      </Backdrop>
{examList ? 
<div>

<h1>Select an Exam</h1> 
<p style={{display:"inline-block",width:"50px",margin:"10px"}}>S.No</p>
  <p style={{display:"inline-block",width:"300px"}}>Exam Name</p>
  <p style={{display:"inline-block",width:"100px"}}>Exam Type</p>
</div>:
<h1>You haven't written any exam yet</h1>}

    {examList.map((val,i)=>{
        if(val){
        console.log(val.examname,val.examtype);
        return(
    <div>
    <p style={{display:"inline-block",width:"50px",margin:"10px"}}>{i+1}</p>
<p style={{display:"inline-block",width:"300px"}}>{val.examname}</p>
<p style={{display:"inline-block",width:"100px",margin:"10px" }}>{val.examtype}</p>
       

        <Button variant="contained" color="primary" onClick={()=>{
                
                setExamName(val.examname);
                setExamType(val.examtype);
                setAnswers(val.answers);
                setMarks(val.marks);
                  
val.answers.map((val,i)=>{
 
 if(val.image){
 
    
 axios.get(`/images/${val.image}`);
 
 
 
 }
 
   
 });
 
                let etime=[];

                timeList.map((value,i)=>{
                    if(value.examname===val.examname && value.examtype===val.examtype){
                        etime.push({stime:value.stime,dur:value.dur});
                    }

                });

                setCtime(etime);
                if(val.time){ setTime3(val.time);}
                else setTime3({});
                if(val.switches){
                setSwitches(val.switches);}
                else setSwitches(0);


                history.push(`/writexam/${val.examname}_${val.examtype}/result/1`);
               

        }}>
            Go
        </Button>

        </div>

        );
        
        }
    })}
    </div> :
    
    <div style={{textAlign: 'center'}}>
    
<p>To see your Dashboard please login through your G-mail </p>

<GoogleLogin

    clientId="526565895378-u0tum8dtdjgvjmpp46ait2ojo8o0q2qi.apps.googleusercontent.com"
    buttonText="Login through Gmail"
    onSuccess={(res)=>{
        if(res.profileObj.email===ind){
        setBackdrop(true);
        axios.post("/user/find",{mail:res.profileObj.email})
        .then(resp=>{
            if(resp.data){
                setMode(res.profileObj.email);
                setShow(true);
                setBackdrop(false);
            }else{
                setBackdrop(false);
               alert("Sorry You are not eligible to write Exams");
            }
        })
        }else{
            alert("Email Id does not match");
        }
    }}
    onFailure={(res)=>{
        setBackdrop(false);
        alert("You have failed to login in, Please try again");
    }}
    cookiePolicy={'single_host_origin'}
   
/>



    </div>
    
    
    
    
    }

    </div>);

}

export default Examlist;