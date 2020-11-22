import React, { useEffect, useState,useContext } from "react"
import axios from "axios";
import { UserName } from "./storage";


function Result(){
    const [result,setResult]=useState({});
    const [name,setName]=useContext(UserName); 
    console.log(name);

   useEffect(()=>{

    axios.get("http://localhost:5000/user/")
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
   </div>)

   }




}

export default Result;