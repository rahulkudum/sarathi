import { Button, TextField, Backdrop, CircularProgress } from "@material-ui/core";
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Route, useHistory, useRouteMatch, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Mode } from "./storage";

import Login from "./login";

function Examselect() {
 let { path, url } = useRouteMatch();

 const [pasword, setPasword] = useState("");
 const [show2, setShow2] = useState(false);
 const [show3, setShow3] = useState(false);

 let history = useHistory();

 const [backdrop, setBackdrop] = useState(false);

 const [examList, setExamList] = useState([]);
 const [mode, setMode] = useContext(Mode);

 const useStyles = makeStyles((theme) => ({
  backdrop: {
   zIndex: theme.zIndex.drawer + 1,
   color: "#fff",
  },
 }));

 const classes = useStyles();
 useEffect(() => {
  setBackdrop(true);
  axios.get("/exam/").then((res) => {
   setExamList(res.data);
   setBackdrop(false);
  });
 }, []);

 return (
  <Switch>
   <Route exact path={path}>
    <div>
     <div>
      {show2 || mode === "teacher" ? (
       <div>
        <Backdrop className={classes.backdrop} open={backdrop}>
         <CircularProgress color="inherit" />
        </Backdrop>

        {examList ? <h2>Select a Exam</h2> : <h2>No Exams Found</h2>}
        <p style={{ display: "inline-block", width: "50px", margin: "10px" }}>S.No</p>
        <p style={{ display: "inline-block", width: "300px" }}>Exam Name</p>
        <p style={{ display: "inline-block", width: "100px" }}>Exam Type</p>

        {examList.map((val, i) => {
         let done = false;

         val.questions.map((valu, i) => {
          if (val.examtype.indexOf("advanced") !== -1 && valu.type === "multiple") {
           if (!valu.image || !(valu.answer.one || valu.answer.two || valu.answer.three || valu.answer.four)) done = true;
          } else {
           if (!valu.image || !valu.answer) done = true;
          }
         });

         if (!done) {
          return (
           <div>
            <p style={{ display: "inline-block", width: "50px", margin: "10px" }}>{i + 1}</p>
            <p style={{ display: "inline-block", width: "300px" }}>{val.examname}</p>
            <p style={{ display: "inline-block", width: "150px", margin: "10px" }}>{val.examtype}</p>
            <Button
             variant="contained"
             color="primary"
             style={{ margin: "10px" }}
             onClick={() => {
              history.push(`${url}/${val.examname}_${val.examtype}`);
             }}
            >
             Go
            </Button>

            <Button
             variant="contained"
             color="primary"
             style={{ margin: "10px" }}
             onClick={() => {
              var tempInput = document.createElement("input");
              tempInput.style = "position: absolute; left: -1000px; top: -1000px";
              tempInput.value = encodeURI(`www.sarathikgptest.in${url}/${val.examname}_${val.examtype}`);
              document.body.appendChild(tempInput);
              tempInput.select();
              document.execCommand("copy");
              document.body.removeChild(tempInput);
             }}
            >
             Copy
            </Button>
           </div>
          );
         } else
          return (
           <div>
            <p style={{ display: "inline-block", width: "50px", margin: "10px" }}>{i + 1}</p>
            <p style={{ display: "inline-block", width: "300px" }}>{val.examname}</p>
            <p style={{ display: "inline-block", width: "150px", margin: "10px" }}>{val.examtype}</p>
            <p style={{ display: "inline-block", width: "300px", margin: "10px" }}>preparation is not complete</p>
           </div>
          );
        })}
       </div>
      ) : (
       <div>
        <TextField
         id="standard-password-input"
         label="Password"
         type="password"
         autoComplete="current-password"
         value={pasword}
         onChange={(e) => setPasword(e.target.value)}
        />
        <br />
        <br />

        <Button
         variant="contained"
         color="primary"
         onClick={() => {
          if (pasword === "sarathi@sp123") {
           setMode("teacher");
           setShow2(true);
          } else {
           setShow3(true);
          }
         }}
        >
         Go
        </Button>
        {show3 ? <p>Wrong password try again</p> : null}
       </div>
      )}
     </div>
    </div>
   </Route>
   <Route path={`${path}/:examdetails`}>
    <Login />
   </Route>
  </Switch>
 );
}

export default Examselect;
