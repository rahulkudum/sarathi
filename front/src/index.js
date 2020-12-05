import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter,Route} from "react-router-dom";
import App from './App';
import {TotalStorage} from "./Components/storage";

ReactDOM.render(
  <React.StrictMode>
  <BrowserRouter>
  <TotalStorage>
    <App />
    </TotalStorage>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("/sw.js")
  .then((reg)=>{console.log("sw!!!",reg)})
  .catch((err)=>{console.log("nsw",err)});
}