
import React, { useContext, useState,useEffect } from "react";
import { UserName,ExamName,ExamType,Answers,Marks, Ctime, Time3, Switches } from "./storage";
import axios from "axios";
import { Route, useHistory, useParams,Switch,useRouteMatch } from "react-router-dom";
import { Button,Backdrop,CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';


function Examresult(){


 
    let history=useHistory();
  
let {examdetails}=useParams();
let examname= examdetails.slice(0,examdetails.indexOf("_"));
let examtype=examdetails.slice(examdetails.indexOf("_")+1);


    const [studentsList,setStudentsList]=useState([]);
    const [backdrop,setBackdrop]=useState(false);


    const useStyles = makeStyles((theme) => ({
        backdrop: {
          zIndex: theme.zIndex.drawer + 1,
          color: '#fff',
        },
      }));
      
      const classes = useStyles();


      
useEffect(()=>{
  
    setBackdrop(true);
    axios.get("/user/")
    .then(res=>{
        console.log(res);
        setStudentsList(res.data);
        setBackdrop(false);
    }) 
    
    },[])
   
    let result=[];
    
studentsList.map((valu,j)=>{

    

 valu.exams.map((val,i)=>{

    if(val.examname===examname && val.examtype===examtype){

        let smarks={...val.marks};
        smarks.name=valu.name;
        smarks.mail = valu.mail;
       
        result.push(smarks);
    }

})




}); 

function compare(a, b) {
 
    const totalA = a.total;
    const totalB = b.total;
  
    let comparison = 0;
    if (totalA > totalB) {
      comparison = -1;
    } else if (totalA < totalB) {
      comparison = 1;
    }
    return comparison;
  }

result.sort(compare);

console.log(result);


return(
    <div>
    <Backdrop className={classes.backdrop} open={backdrop} >
      <CircularProgress color="inherit" />
      </Backdrop>
      <p style={{ margin:"10px" ,display:"inline-block",width:"100px"}}>S.NO</p>
      <p style={{width:"250px",display:"inline-block"}}>Name</p>
      <p style={{width:"450px",display:"inline-block"}}>MailId</p>
  
    <p style={{ margin:"10px" ,display:"inline-block",width:"100px"}}>Total</p>
    <p style={{ margin:"10px" ,display:"inline-block",width:"100px"}}>Physics</p>
    <p style={{ margin:"10px" ,display:"inline-block",width:"100px"}}>Chemistry</p>
    <p style={{ margin:"10px" ,display:"inline-block",width:"100px"}}>Maths</p>
{result.map((val,i)=>{
    return(
<div>
    <p style={{ margin:"10px" ,display:"inline-block",width:"100px"}}>{i+1}</p>    
    <p style={{width:"250px",display:"inline-block"}}>{val.name}</p>
    <p style={{width:"450px",display:"inline-block"}}>{val.mail}</p>
    
    <p style={{ margin:"10px" ,display:"inline-block",width:"100px"}}>{val.total}</p>
    <p style={{ margin:"10px" ,display:"inline-block",width:"100px"}}>{val.physics}</p>
    <p style={{ margin:"10px" ,display:"inline-block",width:"100px"}}>{val.maths}</p>
    <p style={{ margin:"10px" ,display:"inline-block",width:"100px"}}>{val.chemistry}</p>
    </div>
    );

})}
    </div>
    
);




}


export default Examresult;