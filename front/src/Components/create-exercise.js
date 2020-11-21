import React, { useState,useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

function CreateExercises(){
const [exercise,setExersise]=useState({
    username:'',
    description:'',
    duration:0,
    date: new Date(),
    users:[]
});



useEffect(() => {

axios.get("http://localhost:5000/user/")
.then(res=>{
    if(res.data.length>0){
        setExersise(prev=>{
            let dum={...prev};
            dum.users=res.data.map(user=>user.username);
            dum.username=res.data[0].username;
            return dum;
        })
    }
})



}, [])

function onsubmit(e){
e.preventDefault();
console.log(exercise);

axios.post("http://localhost:5000/exercises/add",exercise)
.then(res=>console.log(res.data));






}


    return(
        <div>
        <p>hari hari</p>
            <form onSubmit={onsubmit}>
         
  <div class="form-group">
    <label for="exampleInputEmail1">Username</label>
    <select 
    required
    className="form-control"
    value={exercise.username}
    onChange={(e)=>{
        setExersise(prev=>{
            let dum={...prev};
            dum.username=e.target.value;
            return dum;
        })
    }}>
    {exercise.users.map((user)=>{
        return <option>
           {user}
        </option>;
    })}



    </select>
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">description</label>
    <input type="text" class="form-control" id="exampleInputPassword1" value={exercise.description} onChange={(e)=>{
        setExersise(prev=>{
            let dum={...prev};
            dum.description=e.target.value;
            return dum;
        })
    }}  />
  </div>
  <div class="form-group ">
  <label for="exampleInputEmail1">Duration</label>
    <input type="text" class="form-control" id="exampleInputEmail1" value={exercise.duration} aria-describedby="emailHelp" onChange={(e)=>{
        setExersise(prev=>{
            let dum={...prev};
            dum.duration=e.target.value;
            return dum;
        })
    }}/>
  </div>
  <div class="form-group ">
  <label for="exampleInputEmail1">Date</label>
   <div>
       <DatePicker
       selected={exercise.date}
       onChange={(date)=>{
        setExersise(prev=>{
            let dum={...prev};
            dum.date=date;
            return dum;
        }) 
       }} />
   </div>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>

</form>
        </div>



    );


}

export default CreateExercises;