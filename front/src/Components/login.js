import React, { useContext, useEffect, useState } from "react";
import { Route, useHistory, useParams, Switch, useRouteMatch } from "react-router-dom";
import axios from "axios";
import { Answers2, ExamName2, ExamType2, ExamName, ExamType, Questions, UserName, Time, Time2, Mode, Time3, Switches, ExamTime } from "./storage";

import { Backdrop, CircularProgress, Grid } from "@material-ui/core";
import Options from "./radio";

import { GoogleLogin } from "@react-oauth/google";
import { makeStyles } from "@material-ui/core/styles";
import Result from "./result";
import jwt_decode from "jwt-decode";


// export let equestions;

function Login() {
 let { path, url } = useRouteMatch();

 let { examdetails } = useParams();
 let examname = examdetails.slice(0, examdetails.indexOf("_"));
 let examtype = examdetails.slice(examdetails.indexOf("_") + 1);

 const [examName, setExamName] = useContext(ExamName2);
 const [examType, setExamType] = useContext(ExamType2);
 const [examName2, setExamName2] = useContext(ExamName);
 const [examType2, setExamType2] = useContext(ExamType);
 const [examTime, setExamTime] = useContext(ExamTime);
 const [questions, setQuestions] = useState([]);
 const [answers, setAnswers] = useContext(Answers2);
 const [mail, setMail] = useContext(UserName);
 const [backdrop, setBackdrop] = useState(false);
 const [time, setTime] = useContext(Time);
 const [time2, setTime2] = useContext(Time2);
 const [time3, setTime3] = useContext(Time3);
 const [mode, setMode] = useContext(Mode);
 const [switches, setSwitches] = useContext(Switches);
 const [finished, setFinished] = useState(false);

 let history = useHistory();
 const useStyles = makeStyles((theme) => ({
  backdrop: {
   zIndex: theme.zIndex.drawer + 1,
   color: "#fff",
  },
 }));

 const classes = useStyles();

 useEffect(() => {
  setBackdrop(true);
  axios.post("/exam/find", { examname: examname, examtype: examtype }).then((res) => {
   console.log(res);

   setQuestions(res.data.questions);
   if (res.data.time && !isNaN(res.data.time)) {
    setExamTime(Number(res.data.time) * 60000);
   } else {
    console.log("fine2");
    setExamTime("defined");
   }
   setBackdrop(false);
  });
 }, []);

 function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
   seconds = Math.floor((duration / 1000) % 60),
   minutes = Math.floor((duration / (1000 * 60)) % 60),
   hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
 }

 return (
  <Switch>
   <Route exact path={path}>
    <div style={{ textAlign: "center" }}>
     <Backdrop className={classes.backdrop} open={backdrop}>
      <div style={{ textAlign: "center" }}>
       <CircularProgress color="inherit" />
       <br />
       <p style={{ color: "white" }}>Please Wait, it might take some time</p>
      </div>
     </Backdrop>

     <div style={{ border: "1px solid black" }}>
      {examName === examname && examType === examtype && mode !== "teacher" ? (
       <p>To resume {examname} please login through your G-mail</p>
      ) : (
       <p>To write {examname} please login through your G-mail</p>
      )}
      <GoogleLogin
       onSuccess={(res) => {
        let email=jwt_decode(res.credential).email
        console.log(email)
        setBackdrop(true);

        axios.post("/user/find", { mail: email }).then((resp) => {
         if (resp.data) {
          let exsists = false;
          for (let i = 0; i < resp.data.exams.length; i++) {
           if (resp.data.exams[i].examname === examname && resp.data.exams[i].examtype === examtype) exsists = true;
          }

          if (exsists) {
           setBackdrop(false);
           alert("Sorry you can only write the exam once");
          }

          if (!exsists) {
           if (examName === examname && examType === examtype && mode === email) {
            setExamName2(examname);
            setExamType2(examtype);
            console.log("gv");
           } else {
            setMode(email);
            setExamName(examname);
            setExamType(examtype);
            setExamName2(examname);
            setExamType2(examtype);
            setAnswers([]);

            questions.map((val, i) => {
             if (examtype.indexOf("advanced") !== -1) {
              setAnswers((prev) => {
               let dum = [...prev];
               dum.push({
                answer: val.type.indexOf("multiple") !== -1 ? { one: false, two: false, three: false, four: false } : "",
                danswer: val.type.indexOf("multiple") !== -1 ? { one: false, two: false, three: false, four: false } : "",
                visited: false,
                review: false,
                status: "",
                correct: "",
                time: 0,
                image: val.image,
                type: val.type,
                secname: val.secname,
                cmarks: val.correct,
                wmarks: val.wrong,
               });
               return dum;
              });
             } else {
              setAnswers((prev) => {
               let dum = [...prev];
               dum.push({ answer: "", danswer: "", visited: false, review: false, status: "", correct: "", type: val.type, time: 0, image: val.image });
               return dum;
              });
             }
            });
           }

           setMail(email);

           let exams = resp.data.exams;

           let ptime = resp.data.time;

           ptime.push({
            examname: examname,
            examtype: examtype,
            stime: new Date().toLocaleTimeString("en-US"),
            date: new Date().toLocaleDateString(),
            dur: msToTime(time2 - time),
           });

           setTime3({ time: 0, physics: 0, chemistry: 0, maths: 0, on: 0, qon: 0, no: 0, subtime: 0 });
           setSwitches(0);

           questions.map((val, i) => {
            if (i !== 0) {
             if (val.image) {
              axios.get(`/images/${val.image}`);
             }
            }
           });

           axios
            .post("/user/updat", { mail: email, exams: exams, time: ptime })
            .then((res) => {
             console.log(res);
             setTime(Date.now());
             setTime2(Date.now());
             setBackdrop(false);
             history.push(`${url}/paper/1`);
            })

            .catch((err) => {
             setBackdrop(false);
             alert("Sorry, something went wrong please try again");
            });
          }
         } else {
          setBackdrop(false);
          alert("Sorry You are not eligible to write the exam");
         }
        });
       }}
       onError={(res) => {
        console.log(res)
        setBackdrop(false);
       }}
       cookiePolicy={"single_host_origin"}
      />
      <br />
      <br />
      <br />
      <p>To see your Dashboard please login through your G-mail </p>
      <GoogleLogin
       onSuccess={(res) => {
        let email=jwt_decode(res.credential).email
        setBackdrop(true);
        axios.post("/user/find", { mail: email }).then((resp) => {
         if (resp.data) {
          setMode(email);
          setBackdrop(false);
          history.push(`/studentsdashboard/${email}`);
         } else {
          setBackdrop(false);
          alert("Sorry You are not eligible to write Exams");
         }
        });
       }}
       onError={(res) => {
        console.log(res)
        setBackdrop(false);
        alert("You have failed to login in, Please try again");
       }}
       cookiePolicy={"single_host_origin"}
      />
      <p>(you may see it after writing the exam)</p>
      {questions.length > 0 ? (
       <img
        style={{ position: "absolute", opacity: 0 }}
        src={`/images/${questions[0].image}`}
        onLoad={() => {
         console.log("imageloading");
        }}
       />
      ) : null}
     </div>
    </div>
   </Route>

   <Route path={`${path}/paper/:ind`}>
    <Options />
   </Route>

   <Route path={`${path}/result/:ind`}>
    <Result />
   </Route>
  </Switch>
 );
}

export default Login;

