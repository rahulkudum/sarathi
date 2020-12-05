
import React, { useContext, useState,useEffect } from "react";
import { UserName,ExamName,ExamType,Answers,Marks, Ctime, Time3, Switches } from "./storage";
import axios from "axios";
import { Route, useHistory, useParams,Switch,useRouteMatch } from "react-router-dom";
import { Button,Backdrop,CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
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
    <Backdrop className={classes.backdrop} open={backdrop} >
      <CircularProgress color="inherit" />
      </Backdrop>
<h1>Please Select an Exam from your Previously Written Exams </h1>
    {examList.map((val)=>{
        if(val){
        console.log(val.examname,val.examtype);
        return(
    <div>

        <p style={{display:"inline-block", marginRight:"50px"}}>{val.examname} ({val.examtype})</p>

        <Button variant="contained" color="primary" onClick={()=>{
                setExamName(val.examname);
                setExamType(val.examtype);
                setAnswers(val.answers);
                setMarks(val.marks);
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

    </div>);

}

export default Examlist;