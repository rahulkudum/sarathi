import React, { useContext, useEffect, useState } from "react";
import axios from "axios"

import { Button,TextField,Backdrop,CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

import Examlist from "./examlist";
import { Route, useHistory, useParams,Switch,useRouteMatch } from "react-router-dom";
import { Mode } from "./storage";
export default  function Dashboard(){
  let { path, url } = useRouteMatch();
const [studentsList,setStudentsList]=useState([]);
const [studentName,setStudentName]=useState("");
const [studentMail,setStudentMail]=useState("");
const[show2,setShow2]=useState(false);
const[show3,setShow3]=useState(false);
const[pasword,setPasword]=useState("");
const [backdrop,setBackdrop]=useState(false);
const [mode,setMode]=useContext(Mode);

let history=useHistory();
const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));
  
  const classes = useStyles();

useEffect(()=>{
  setMode("teacher");
setBackdrop(true);
axios.get("/user/")
.then(res=>{
    console.log(res);
    setStudentsList(res.data);
    setBackdrop(false);
}) 

},[])


return (
  <Switch>
    <Route exact path={path}>
    <div>
    
   
  
    <div>
    {show2 ?
    <div>
    <Backdrop className={classes.backdrop} open={backdrop} >
      <CircularProgress color="inherit" />
      </Backdrop>
     <TextField
     id="filled-number"
     label="Student Name"
     type="text"
     InputLabelProps={{
       shrink: true,
     }}
    
     value={studentName}
     onChange={(e)=>{setStudentName(e.target.value);
     }}
   />
   <br />
   <br />
  
   <TextField
     id="filled-number"
     label="Student Mail"
     type="text"
     InputLabelProps={{
       shrink: true,
     }}
    
     value={studentMail}
     onChange={(e)=>{setStudentMail(e.target.value);
     }}
   />
  
   <br />
   <br />
            
   <Button variant="contained" color="primary" onClick={()=>{
  setBackdrop(true);
     axios.post("/user/add",{name:studentName,mail:studentMail,exams:[]})
     .then(res=>{
         console.log(res);
         setStudentsList(prev=>{
           let dum=[...prev];
           dum.push({name:studentName,mail:studentMail,exams:[]});
           return dum;
         })
         setBackdrop(false);
     })
  
   
   }} >
      Create Student
    </Button>
  
  
  <br />
  <p>List of Exsisting Users</p>
  
  {studentsList.map((val,i)=>{
    if(val){
  
  
  return(
      <div>
  <p style={{display:"inline-block",marginRight:"500px"}}>name: {val.name} email: {val.mail}</p>
  <Button variant="contained" color="primary" style={{margin:"10px"}} onClick={()=>{
    
    history.push(`${url}/${val.mail}`)
  }}>
      See the dash board
  </Button>
  <Button variant="contained" color="secondary" onClick={()=>{
    setBackdrop(true);
      axios.post("/user/delete",{name:val.name,mail:val.mail})
      .then(res=>{
        setStudentsList(prev=>{
        let dum=[...prev];
       dum= dum.map(item=>{
         if(item){
         if (item.name!==val.name || item.mail!==val.mail) return item }
       }
         
         );
       
        return dum;
      })
  console.log(res);
  setBackdrop(false);
  
      });
  }}>
     Delete Account
  </Button>
  
  </div>
  )
    }
  })}
  
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
          setShow2(true);
      }else{
          setShow3(true);
      }
  }} >
      Go
  </Button>
  {show3 ? <p>Wrong password try again</p>: null}
  
  
  
  
  
  
    </div> }
    </div>
  
  </div>

    </Route>

<Route path={`${path}/:ind`} >

<Examlist />
</Route>




  </Switch>


)



}