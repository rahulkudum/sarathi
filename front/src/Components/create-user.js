import React, { useState,useEffect } from "react";
import axios from "axios";


function CreateUser(){
const [username,setUsername]=useState("");




function onsubmit(e){
e.preventDefault();
console.log(username);

axios.post("/user/add",{username:username})
.then(res=>console.log(res.data));

setUsername("");







}


    return(
        <div>
        <p>hari bol</p>
            <form onSubmit={onsubmit}>
         
 
  <div class="form-group ">
  <label for="exampleInputEmail1">username</label>
    <input type="text" class="form-control" id="exampleInputEmail1" value={username} aria-describedby="emailHelp" onChange={(e)=>{
        setUsername(e.target.value)
    }}/>
  </div>
  
  <button type="submit" class="btn btn-primary">Submit</button>

</form>
        </div>



    );


}


export default CreateUser;