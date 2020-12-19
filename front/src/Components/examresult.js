import React, { useContext, useState, useEffect } from "react";
import { UserName, ExamName, ExamType, Answers, Marks, Ctime, Time3, Switches, Mode } from "./storage";
import axios from "axios";
import { Route, useHistory, useParams, Switch, useRouteMatch } from "react-router-dom";
import { Button, Backdrop, CircularProgress, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

function Examresult() {
 let history = useHistory();

 let { examdetails } = useParams();
 let examname = examdetails.slice(0, examdetails.indexOf("_"));
 let examtype = examdetails.slice(examdetails.indexOf("_") + 1);

 const [studentsList, setStudentsList] = useState([]);
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
  setBackdrop(true);
  axios.get("/user/").then((res) => {
   console.log(res);
   setStudentsList(res.data);
   setBackdrop(false);
  });
 }, []);

 let result = [];

 studentsList.map((valu, j) => {
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

    result.push(smarks);
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

 console.log(result);

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

   <p style={{ margin: "10px", display: "inline-block", width: "100px" }}>S.NO</p>
   <p style={{ width: "250px", display: "inline-block" }}>Name</p>
   <p style={{ width: "450px", display: "inline-block" }}>MailId</p>

   <p style={{ margin: "10px", display: "inline-block", width: "100px" }}>Total</p>
   {examtype.indexOf("single") === -1 ? (
    <>
     <p style={{ margin: "10px", display: "inline-block", width: "100px" }}>Physics</p>
     <p style={{ margin: "10px", display: "inline-block", width: "100px" }}>Chemistry</p>
     {examtype === "neet" ? (
      <p style={{ margin: "10px", display: "inline-block", width: "100px" }}>Biology</p>
     ) : (
      <p style={{ margin: "10px", display: "inline-block", width: "100px" }}>Maths</p>
     )}
    </>
   ) : null}
   {result.map((val, i) => {
    return (
     <div>
      <p style={{ margin: "10px", display: "inline-block", width: "100px" }}>{i + 1}</p>
      <p style={{ width: "250px", display: "inline-block" }}>{val.name}</p>
      <p style={{ width: "450px", display: "inline-block" }}>{val.mail}</p>

      <p style={{ margin: "10px", display: "inline-block", width: "100px" }}>{val.total}</p>
      {examtype.indexOf("single") === -1 ? (
       <>
        <p style={{ margin: "10px", display: "inline-block", width: "100px" }}>{val.physics}</p>
        <p style={{ margin: "10px", display: "inline-block", width: "100px" }}>{val.chemistry}</p>
        <p style={{ margin: "10px", display: "inline-block", width: "100px" }}>{val.maths}</p>
       </>
      ) : null}
      <Button
       variant="contained"
       color="primary"
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
       Responses
      </Button>
     </div>
    );
   })}
  </div>
 );
}

export default Examresult;
