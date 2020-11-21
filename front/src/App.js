import React,{useState} from "react"
import { Route, Switch } from 'react-router-dom';
import Options from "./Components/radio"
import Result from "./Components/result"
function App() {

  return(<Switch>
<Route exact path="/">
  <Options />
</Route>
<Route path="/result">
  <Result />
</Route>



  </Switch>);
  
}

export default App;
