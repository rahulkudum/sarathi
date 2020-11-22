import React, { useEffect, useState,useContext } from "react"
import axios from "axios";
import { UserName } from "./storage";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";


function Result(){
    const [result,setResult]=useState({});
    const [name,setName]=useContext(UserName); 
    console.log(name);
    let history=useHistory();

   useEffect(()=>{

    axios.get("/user/")
    .then(res=>{
        for(let i in res.data){
           
            if(res.data[i].username===name){
               
                setResult(prev=>{
                    let dum={...prev};
                    dum.username=res.data[i].username;
                    dum.answers=res.data[i].answers;
                    dum.marks=res.data[i].marks;
                    return dum;
                })
            }
        }

    })

   },[])
   console.log(result,"haribol");

   if(!result.username){
       return(<p>loading...</p>)
   }


   if(result.username){
   return(<div>
   
       <h1>Hi {result.username} you got {result.marks} marks </h1>
       <br />
       <Button variant="contained" color="primary" onClick={()=>history.push("/")} >
    Go to Home Page
  </Button>
   </div>)

   }




}

export default Result;