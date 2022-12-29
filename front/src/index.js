import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter,Route} from "react-router-dom";
import App from './App';
import {TotalStorage} from "./Components/storage";
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.render(
  <React.StrictMode>
  <BrowserRouter>
  <TotalStorage>
   <GoogleOAuthProvider clientId="526565895378-hppc60g312os30ae7ct6d7pec915op77.apps.googleusercontent.com">
    <App />
   </GoogleOAuthProvider>
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

// local 526565895378-mqhfg5dceb6e4d7jta7qte8sfki2vdpa.apps.googleusercontent.com

// floating 526565895378-u0tum8dtdjgvjmpp46ait2ojo8o0q2qi.apps.googleusercontent.com

// sarathikgptest 526565895378-erq5sbu7kkpeonhqgjvdemgtncbpep42.apps.googleusercontent.com

// render 526565895378-hppc60g312os30ae7ct6d7pec915op77.apps.googleusercontent.com
