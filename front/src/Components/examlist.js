import React, { useContext, useState, useEffect } from "react";
import { UserName, ExamName, ExamType, Answers, Marks, Ctime, Time3, Switches, Mode } from "./storage";
import axios from "axios";
import { Route, useHistory, useParams, Switch, useRouteMatch } from "react-router-dom";
import { Button, Backdrop, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import "./styles.css";

function Examlist() {
 let { ind } = useParams();
 let history = useHistory();

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
 const [show, setShow] = useState(false);
 const [mode, setMode] = useContext(Mode);

 console.log("count");

 const useStyles = makeStyles((theme) => ({
  backdrop: {
   zIndex: theme.zIndex.drawer + 1,
   color: "#fff",
  },
 }));

 const classes = useStyles();

 useEffect(() => {
  setMail(ind);
  console.log(ind, mail);
  setBackdrop(true);
  axios.post("/user/find", { mail: ind }).then((res) => {
   console.log(res.data);
   setExamList(res.data.exams);
   setTimeList(res.data.time);
   console.log(examList);
   setBackdrop(false);
  });
 }, []);

 return (
  <div>
   {show || mode === ind || mode === "teacher" ? (
    <div>
     <Backdrop className={classes.backdrop} open={backdrop}>
      <CircularProgress color="inherit" />
     </Backdrop>

     <table id="customers">
      <tr>
       <th>S.No</th>
       <th>Exam Name</th>
       <th>Total</th>
      </tr>
      {examList.map((val, i) => {
       console.log(val);
       if (val) {
        return (
         <tr
          onClick={() => {
           setExamName(val.examname);
           setExamType(val.examtype);
           setAnswers(val.answers);
           setMarks(val.marks);

           val.answers.map((val, i) => {
            if (val.image) {
             axios.get(`/images/${val.image}`);
            }
           });

           let etime = [];

           timeList.map((value, i) => {
            if (value.examname === val.examname && value.examtype === val.examtype) {
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

           history.push(`/writexam/${val.examname}_${val.examtype}/result/1`);
          }}
         >
          <td>{i + 1}</td>
          <td>{val.examname}</td>
          <td>{val.marks.total}</td>
         </tr>
        );
       }
      })}
     </table>
    </div>
   ) : (
    <div style={{ textAlign: "center" }}>
     <p>To see your Dashboard please login through your G-mail </p>

     <GoogleLogin
      onSuccess={(res) => {
       let email=jwt_decode(res.credential).email 
       if (email === ind) {
        setBackdrop(true);
        axios.post("/user/find", { mail: email }).then((resp) => {
         if (resp.data) {
          setMode(email);
          setShow(true);
          setBackdrop(false);
         } else {
          setBackdrop(false);
          alert("Sorry You are not eligible to write Exams");
         }
        });
       } else {
        alert("Email Id does not match");
       }
      }}
      onError={(res) => {
       setBackdrop(false);
       alert("You have failed to login in, Please try again");
      }}
      cookiePolicy={"single_host_origin"}
     />
    </div>
   )}
  </div>
 );
}

export default Examlist;
