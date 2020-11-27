import { Button,TextField,Backdrop,CircularProgress } from "@material-ui/core";
import React,{useContext, useState,useEffect} from "react";
import axios from "axios";
import { Route, useHistory,useRouteMatch,Switch } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';


import Login from './login';

function Examselect(){
  let { path, url } = useRouteMatch();
    
    const[pasword,setPasword]=useState("");
    const[show2,setShow2]=useState(false);
    const [show3,setShow3]=useState(false);
  
    let history=useHistory();

    const [backdrop,setBackdrop]=useState(false);
   
  
    const [examList,setExamList]=useState([]);
   
  
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const classes = useStyles();
useEffect(()=>{
setBackdrop(true);
  axios.get("/exam/")
  .then(res=>{
    setExamList(res.data);
    setBackdrop(false);
  })

},[])
  


   return( 

    <Switch >

<Route exact path={path} >

   
   <div>
    
  
  <div>

  {show2 ?
    
   
  <div>
  <Backdrop className={classes.backdrop} open={backdrop} >
    <CircularProgress color="inherit" />
    </Backdrop>

 {examList ? <h2>Select a Exam</h2> :<h2>No Exams Found</h2>}
{examList.map((val)=>{

return(

  <div>
<p style={{display:"inline-block",width:"500px"}}>{val.examname}({val.examtype})</p>
<Button variant="contained" color="primary" onClick={()=>{
 
  history.push(`${url}/${val.examname}_${val.examtype}`);
}}>
 Go
</Button>




  </div> 
);



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
<Route path={`${path}/:examdetails`}>

<Login />

</Route>



   </Switch>
   
    );


}


export default Examselect;