import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { Button, TextField, Backdrop, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Examlist from "./examlist";
import { Route, useHistory, useParams, Switch, useRouteMatch } from "react-router-dom";
import { Mode } from "./storage";
export default function Dashboard() {
 let { path, url } = useRouteMatch();
 const [studentsList, setStudentsList] = useState([]);
 const [studentName, setStudentName] = useState("");
 const [studentMail, setStudentMail] = useState("");
 const [show2, setShow2] = useState(false);
 const [show3, setShow3] = useState(false);
 const [pasword, setPasword] = useState("");
 const [backdrop, setBackdrop] = useState(false);
 const [mode, setMode] = useContext(Mode);
 const [dialog, setDialog] = useState(false);

 let history = useHistory();
 const useStyles = makeStyles((theme) => ({
  backdrop: {
   zIndex: theme.zIndex.drawer + 1,
   color: "#fff",
  },
 }));

 const classes = useStyles();

 useEffect(() => {
  // localStorage.setItem('theme', JSON.stringify(JSON.stringify({data:"fhgj"})));
  // console.log(JSON.parse(localStorage.getItem('theme')));

  setBackdrop(true);
  axios.get("/user/").then((res) => {
   console.log(res);
   setStudentsList(res.data);
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
        <TextField
         id="filled-number"
         label="Student Name"
         type="text"
         InputLabelProps={{
          shrink: true,
         }}
         style={{ width: "250px" }}
         value={studentName}
         onChange={(e) => {
          setStudentName(e.target.value);
         }}
        />
        <br />
        <br />

        <TextField
         id="filled-number"
         label="Student Mail"
         type="text"
         InputLabelProps={{
          shrink: true,
         }}
         style={{ width: "450px" }}
         value={studentMail}
         onChange={(e) => {
          setStudentMail(e.target.value);
         }}
        />

        <br />
        <br />

        <Button
         variant="contained"
         color="primary"
         onClick={() => {
          let done = false;
          console.log(studentsList);
          studentsList.map((val, i) => {
           if (val) {
            if (studentMail === val.mail) done = true;
           }
          });

          if (!done) {
           setBackdrop(true);
           axios.post("/user/add", { name: studentName, mail: studentMail, exams: [] }).then((res) => {
            console.log(res);
            setStudentsList((prev) => {
             let dum = [...prev];
             dum.push({ name: studentName, mail: studentMail, exams: [] });
             return dum;
            });

            setStudentName("");
            setStudentMail("");
            setBackdrop(false);
           });
          } else {
           alert("User with same MailId already exsists");
          }
         }}
        >
         Create Student
        </Button>

        <br />
        <p>List of Exsisting Users</p>

        <p style={{ display: "inline-block", width: "50px", margin: "10px" }}>S.No</p>
        <p style={{ display: "inline-block", width: "250px" }}>Name</p>
        <p style={{ display: "inline-block", width: "450px" }}>MailId</p>

        {studentsList.map((val, i) => {
         if (val) {
          return (
           <div>
            <p style={{ display: "inline-block", width: "50px", margin: "10px" }}>{i + 1}</p>
            <p style={{ display: "inline-block", width: "250px" }}>{val.name}</p>
            <p style={{ display: "inline-block", width: "450px" }}>{val.mail}</p>

            <Button
             variant="contained"
             color="primary"
             style={{ marginRight: "10px" }}
             onClick={() => {
              setMode("teacher");

              history.push(`${url}/${val.mail}`);
             }}
            >
             Dashboard
            </Button>

            <Button
             variant="contained"
             color="primary"
             style={{ marginRight: "10px" }}
             onClick={() => {
              var tempInput = document.createElement("input");
              tempInput.style = "position: absolute; left: -1000px; top: -1000px";
              tempInput.value = encodeURI(`https://sarathikgptest.onrender.com${url}/${val.mail}`);
              document.body.appendChild(tempInput);
              tempInput.select();
              document.execCommand("copy");
              document.body.removeChild(tempInput);
             }}
            >
             Copy
            </Button>
            <Button
             variant="contained"
             color="secondary"
             onClick={() => {
              setDialog(i + 1);
             }}
            >
             Delete
            </Button>
           </div>
          );
         }
        })}

        <Dialog
         open={dialog}
         onClose={() => {
          setDialog(false);
         }}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description"
        >
         <DialogTitle id="alert-dialog-title">{"Are you sure to Delete"}</DialogTitle>
         <DialogContent>Once deleted all the student's data will be lost</DialogContent>

         <DialogActions>
          <Button
           onClick={() => {
            setBackdrop(true);
            axios.post("/user/delete", { name: studentsList[dialog - 1].name, mail: studentsList[dialog - 1].mail }).then((res) => {
             setStudentsList((prev) => {
              let dum = [...prev];
              dum = dum.map((item) => {
               if (item) {
                if (item.name !== studentsList[dialog - 1].name || item.mail !== studentsList[dialog - 1].mail) return item;
               }
              });

              return dum;
             });
             console.log(res);
             setBackdrop(false);
            });
            console.log(studentsList);

            setDialog(false);
           }}
           color="primary"
          >
           Yes
          </Button>
          <Button
           onClick={() => {
            setDialog(false);
           }}
           color="primary"
           autoFocus
          >
           No
          </Button>
         </DialogActions>
        </Dialog>
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
           setShow2(true);
           setMode("teacher");
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

   <Route path={`${path}/:ind`}>
    <Examlist />
   </Route>
  </Switch>
 );
}
