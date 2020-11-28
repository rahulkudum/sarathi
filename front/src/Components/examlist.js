
import React, { useContext, useState,useEffect } from "react";
import { UserName,ExamName,ExamType,Answers,Marks } from "./storage";
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
  
   
    const [answers,setAnswers]=useContext(Answers);
    const [marks,setMarks]=useContext(Marks);
    const [backdrop,setBackdrop]=useState(false);


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
        
        axios.post("/user/find",{mail:mail})
        .then(res=>{
            console.log(res.data);
            setExamList(res.data.exams);
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
                history.push(`/writexam/${examName}_${examType}/result/1`);

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