import { Button,Grid } from "@material-ui/core";
import React,{useEffect, useState} from "react"
import { Route, Switch } from 'react-router-dom';
import Options from "./Components/radio"
import Result from "./Components/result"
import Correction from "./Components/correction"
import { useHistory } from "react-router-dom";
import Examselect from "./Components/examselect"
import Dashboard from "./Components/dashboard";
import logo from "./logo.png"; 

function App() {
  
let history=useHistory();




  return(
  <div>
<Grid container>
    <Grid item xl={4} lg={4} md={4} sm={0} xs={0}>
        <div style={{width: "100%"}}></div>
    </Grid>
     <Grid item xl={4} lg={4} md={4} sm={12} xs={12} style={{textAlign:"center"}}>
    <img src={logo} style={{width:"100%",height:"100px",textAlign:"center"}} />
    </Grid>
   
    </Grid>

  <Switch>


<Route  exact path="/">
<div style={{textAlign:"center"}}>
  <Button variant="contained" color="primary" onClick={()=>history.push("/setexam")} >
    Set Exam
  </Button>
  <br />
  <br />
  <Button variant="contained" color="primary" onClick={()=>history.push("/writexam")} >
    Write Exam
  </Button>
<br />
<br />
  <Button variant="contained" color="primary" onClick={()=>history.push("/studentsdashboard")} >
   Students Dashboard
  </Button>
</div>
</Route>

<Route  path="/writexam">
<Examselect />
</Route>
<Route  path="/setexam">
<Correction />
</Route>
<Route  path="/studentsdashboard">
<Dashboard />
</Route>



<Route path="/result">
  <Result />
</Route>



  </Switch>
  
  </div>);
  
}

export default App;
