import React, { useContext, useState, useEffect } from "react";
import { UserName, ExamName, ExamType, Answers, Marks, Ctime, Time3, Switches, Mode, StudentList } from "./storage";
import axios from "axios";
import { Route, useHistory, useParams, Switch, useRouteMatch } from "react-router-dom";
import { Button, Backdrop, CircularProgress, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "./styles.css";

function Examresult() {
 let history = useHistory();

 let { examdetails } = useParams();
 let examname = examdetails.slice(0, examdetails.indexOf("_"));
 let examtype = examdetails.slice(examdetails.indexOf("_") + 1);

 const [studentsList, setStudentsList] = useContext(StudentList);
 const [mail, setMail] = useContext(UserName);
 const [examList, setExamList] = useState([]);
 const [examName, setExamName] = useContext(ExamName);
 const [examType, setExamType] = useContext(ExamType);
 const [timeList, setTimeList] = useState([]);
 const [answers, setAnswers] = useContext(Answers);
 const [marks, setMarks] = useContext(Marks);
 const [backdrop, setBackdrop] = useState(false);
 const [ctime, setCtime] = useContext(Ctime);
 const [time3, setTime3] = useContext(Time3);
 const [switches, setSwitches] = useContext(Switches);
 const [mode, setMode] = useContext(Mode);
 const [sort, setSort] = useState("total");

 const useStyles = makeStyles((theme) => ({
  backdrop: {
   zIndex: theme.zIndex.drawer + 1,
   color: "#fff",
  },
 }));

 const classes = useStyles();

 useEffect(() => {
  if (studentsList.length === 0) {
   setBackdrop(true);
   axios.get("/user/").then((res) => {
    setStudentsList(res.data);
    setBackdrop(false);
   });
  }
 }, []);

 let result = [];
 let login = [];

 studentsList.map((valu, j) => {
  let submitted = "";
  valu.time.map((valt, i) => {
   if (submitted !== "done") {
    if (valt.examname === examname && valt.examtype === examtype) {
     if (submitted !== "not done") {
      valu.exams.map((val, i) => {
       if (val.examname === examname && val.examtype === examtype) {
        let smarks = { ...val.marks };
        smarks.name = valu.name;
        smarks.mail = valu.mail;
        smarks.answers = val.answers;
        smarks.marks = val.marks;
        smarks.timelist = valu.time;
        smarks.time = val.time;
        smarks.switches = val.switches;
        submitted = "done";
        result.push(smarks);
       }
      });
     }

     if (submitted !== "done") {
      let slogin = { ...valt };
      slogin.name = valu.name;
      slogin.mail = valu.mail;
      submitted = "not done";
      login.push(slogin);
     }
    }
   }
  });
 });

 function compare(a, b) {
  let totalA;
  let totalB;

  if (sort === "total") {
   totalA = a.total;
   totalB = b.total;
  } else if (sort === "physics") {
   totalA = a.physics;
   totalB = b.physics;
  } else if (sort === "chemistry") {
   totalA = a.chemistry;
   totalB = b.chemistry;
  } else if (sort === "maths") {
   totalA = a.maths;
   totalB = b.maths;
  }

  let comparison = 0;
  if (totalA > totalB) {
   comparison = -1;
  } else if (totalA < totalB) {
   comparison = 1;
  }
  return comparison;
 }

 result.sort(compare);

 console.log(login);

 return (
  <div>
   <Backdrop className={classes.backdrop} open={backdrop}>
    <CircularProgress color="inherit" />
   </Backdrop>

   {examtype.indexOf("single") === -1 ? (
    <TextField
     id="outlined-select-currency-native"
     select
     label="Sort By"
     value={sort}
     onChange={(e) => {
      if (e.target.value === "biology") setSort("maths");
      else setSort(e.target.value);
     }}
     SelectProps={{
      native: true,
     }}
     variant="outlined"
    >
     {["total", "physics", "chemistry", examtype === "neet" ? "biology" : "maths"].map((option) => (
      <option key={option} value={option}>
       {option}
      </option>
     ))}
    </TextField>
   ) : null}

   <br />
   <br />

   <table id="customers">
    <thead>
     <tr>
      <th style={{ textAlign: "center" }} colspan="7">
       Sarathi Academy Results: {examname}
      </th>
     </tr>
    </thead>
    <tbody>
     <tr>
      <th>S.NO</th>
      <th>Name</th>
      <th>MailId</th>

      <th>Total</th>
      {examtype.indexOf("single") === -1 ? (
       <>
        <th>Physics</th>
        <th>Chemistry</th>
        {examtype === "neet" ? <th>Biology</th> : <th>Maths</th>}
       </>
      ) : null}
     </tr>

     {result.map((val, i) => {
      return (
       <tr
        onClick={() => {
         setMode("teacher");
         setMail(val.mail);
         setExamName(examname);
         setExamType(examtype);
         setAnswers(val.answers);
         setMarks(val.marks);

         val.answers.map((val, i) => {
          if (val.image) {
           axios.get(`/images/${val.image}`);
          }
         });

         let etime = [];

         val.timelist.map((value, i) => {
          if (value.examname === examname && value.examtype === examtype) {
           etime.push({ stime: value.stime, dur: value.dur });
          }
         });

         setCtime(etime);
         if (val.time) {
          setTime3(val.time);
         } else setTime3({});
         if (val.switches) {
          setSwitches(val.switches);
         } else setSwitches(0);

         history.push(`/writexam/${examname}_${examtype}/result/1`);
        }}
       >
        <td>{i + 1}</td>
        <td>{val.name}</td>
        <td>{val.mail}</td>

        <td>{val.total}</td>
        {examtype.indexOf("single") === -1 ? (
         <>
          <td>{val.physics}</td>
          <td>{val.chemistry}</td>
          <td>{val.maths}</td>
         </>
        ) : null}
       </tr>
      );
     })}
    </tbody>
   </table>
   <br />
   <br />
   <br />
   <br />
   <p>Logged in but not Submitted</p>
   <table>
    <tr>
     <td>Name</td>
     <td>MailId</td>
     <td>Logged in time</td>
     <td>Logged in Date</td>
     <td>Duration</td>
    </tr>

    {login.map((val, i) => {
     return (
      <tr>
       <th>{val.name}</th>
       <th>{val.mail}</th>
       <th>{val.stime}</th>
       <th>{val.date}</th>
       <th> {i < login.length - 1 ? login[i + 1].dur : "not known"}</th>
      </tr>
     );
    })}
   </table>
  </div>
 );
}

export default Examresult;
