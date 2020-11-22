import { Button } from "@material-ui/core";
import React,{useState} from "react"
import { Route, Switch } from 'react-router-dom';
import Options from "./Components/radio"
import Result from "./Components/result"
import Correction from "./Components/correction"
import { useHistory } from "react-router-dom";
function App() {
let history=useHistory();

  

  return(<Switch>


<Route  exact path="/">
  <Button variant="contained" color="primary" onClick={()=>history.push("/setexam")} >
    Set Exam
  </Button>
  <br />
  <br />
  <Button variant="contained" color="primary" onClick={()=>history.push("/writexam")} >
    Write Exam
  </Button>

</Route>

<Route  path="/writexam">
<Options />
  
</Route>
<Route  path="/setexam">
<Correction />
</Route>



<Route path="/result">
  <Result />
</Route>



  </Switch>);
  
}

export default App;
