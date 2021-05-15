import {
 Button,
 TextField,
 Backdrop,
 CircularProgress,
 Dialog,
 DialogActions,
 DialogTitle,
 RadioGroup,
 Chip,
 FormControlLabel,
 FormControl,
 FormLabel,
 Radio,
 Grid,
 DialogContent,
 Checkbox,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Route, useHistory, useParams, useRouteMatch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Answers, Answers2, Ctime, ExamName, ExamType, Marks, Questions, Time, Time2, Time3, UserName, Switches, ExamTime } from "./storage";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import ScrollToTop from "./scroll";
import { usePageVisibility } from "./visible";

function Options() {
 let { path, url } = useRouteMatch();
 let { ind } = useParams();
 let history = useHistory();

 let nind = Number(ind);

 const [examName, setExamName] = useContext(ExamName);
 const [examType, setExamType] = useContext(ExamType);
 const [examTime, setExamTime] = useContext(ExamTime);
 const [answers, setAnswers] = useContext(Answers2);
 const [answers2, setAnswers2] = useContext(Answers);
 const [mail, setMail] = useContext(UserName);
 const [time, setTime] = useContext(Time);
 const [time2, setTime2] = useContext(Time2);
 const [time3, setTime3] = useContext(Time3);

 const [backdrop, setBackdrop] = useState(false);
 const [imageloading, setImageloading] = useState(false);
 const [tmarks, setMarks] = useContext(Marks);
 const [dialog, setDialog] = useState(false);
 const [dialog2, setDialog2] = useState(false);

 const [submit, setSubmit] = useState(false);
 const [switches, setSwitches] = useContext(Switches);
 const [timeLimit, setTimeLimit] = useState(0);
 const [errText, setErrText] = useState("");
 const [questionType, setQuestionType] = useState("single");
 const isVisible = usePageVisibility();

 const useStyles = makeStyles((theme) => ({
  root1: {
   flexGrow: 1,
  },
  backdrop: {
   zIndex: theme.zIndex.drawer + 1,
   color: "#fff",
  },
 }));

 const classes = useStyles();
 let bcolor;
 let tcolor;
 let notvisited = 0;
 let unanswered = 0;
 let review = 0;
 let answered = 0;
 let areview = 0;

 useEffect(() => {
  setImageloading(true);

  if (examType.indexOf("mains") !== -1 && !answers[nind - 1].type) {
   if (examName === "2021WM7") {
    if (nind === 21 || nind === 22 || nind === 23 || nind === 24 || nind === 25 || nind === 71 || nind === 72 || nind === 73 || nind === 74 || nind === 75) {
     setQuestionType("numerical");
    } else {
     setQuestionType("single");
    }
   } else {
    if (
     nind === 21 ||
     nind === 22 ||
     nind === 23 ||
     nind === 24 ||
     nind === 25 ||
     nind === 46 ||
     nind === 47 ||
     nind === 48 ||
     nind === 49 ||
     nind === 50 ||
     nind === 71 ||
     nind === 72 ||
     nind === 73 ||
     nind === 74 ||
     nind === 75
    ) {
     setQuestionType("numerical");
    } else {
     setQuestionType("single");
    }
   }
  }

  if (answers[nind - 1].type) {
   setQuestionType(answers[nind - 1].type);
  }
  setAnswers((prev) => {
   let dum = [...prev];
   dum[nind - 1].visited = true;
   return dum;
  });

  setTime3((prev) => {
   let dum = { ...prev };
   dum.qon = Date.now();
   return dum;
  });

  return () => {
   let htime = JSON.parse(localStorage.getItem("time3"));
   console.log(answers[nind - 1], htime.qon, Date.now());

   setAnswers((prev) => {
    let dum = [...prev];
    dum[nind - 1].time = dum[nind - 1].time + Date.now() - htime.qon;
    return dum;
   });
  };
 }, [nind]);

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

 useEffect(() => {
  let rtime = setInterval(() => {
   setTime2(Date.now());
   if (Date.now() - time >= (examType.indexOf("single-advanced") !== -1 ? examTime : examType.indexOf("single") !== -1 ? 3600000 : 10800000)) {
    setSubmit(1);
    clearInterval(rtime);
   }
  }, 1000);

  return () => {
   clearInterval(rtime);
  };
 }, []);

 useEffect(() => {
  setSwitches(switches + 0.5);

  if (isVisible) {
   setTime3((prev) => {
    let dum = { ...prev };
    dum.on = Date.now();
    return dum;
   });
  } else {
   setTime3((prev) => {
    let dum = { ...prev };
    dum.time = dum.time + Date.now() - dum.on;
    return dum;
   });
  }

  console.log(switches, time3, isVisible);
 }, [isVisible]);

 useEffect(() => {
  if (submit) {
   setBackdrop(true);

   axios
    .post("/exam/find", { examname: examName, examtype: examType })
    .then((res) => {
     let marks = 0;
     let positive = 0;
     let negative = 0;
     let maths = 0;
     let physics = 0;
     let chemistry = 0;
     let integerCorrect = 0;

     let htime = JSON.parse(localStorage.getItem("time3"));
     let dums = [...answers];
     dums[nind - 1].time = dums[nind - 1].time + Date.now() - htime.qon;
     let questions = [...res.data.questions];

     if (examType.indexOf("neet") === -1) {
      questions.map((val, i) => {
       if (i === 30 || i === 60 || i === 90) integerCorrect = 0;
       if (
        val.type.indexOf("multiple") !== -1
         ? answers[i].answer.one || answers[i].answer.two || answers[i].answer.three || answers[i].answer.four
         : answers[i].answer
       ) {
        if (
         val.type === "numerical" && val.answer.indexOf("_") !== -1
          ? answers[i].answer === val.answer.slice(0, val.answer.indexOf("_")) ||
            answers[i].answer === val.answer.slice(val.answer.indexOf("_") + 1) ||
            (Number(answers[i].answer) >= Number(val.answer.slice(0, val.answer.indexOf("_"))) &&
             Number(answers[i].answer) <= Number(val.answer.slice(val.answer.indexOf("_") + 1)))
          : JSON.stringify(val.answer) === JSON.stringify(answers[i].answer)
        ) {
         if (examType.indexOf("mains") !== -1 && val.type === "numerical") {
          integerCorrect++;

          if (integerCorrect > 5) {
           dums[i].status = "extra-correct";
          }
         }
         if (integerCorrect <= 5) {
          if (examType.indexOf("single") === -1) {
           if (i < questions.length / 3) {
            physics = physics + Number(val.correct);
           } else if (i < 2 * (questions.length / 3)) {
            chemistry = chemistry + Number(val.correct);
           } else {
            maths = maths + Number(val.correct);
           }
          }

          marks = marks + Number(val.correct);
          positive = positive + Number(val.correct);

          dums[i].status = "correct";
         }
         dums[i].correct = val.answer;
        } else {
         if (val.type === "partial-multiple") {
          let partial_marks = 0;
          if (answers[i].answer.one === val.answer.one && answers[i].answer.one) {
           partial_marks = partial_marks + 1;
          }
          if (answers[i].answer.two === val.answer.two && answers[i].answer.two) {
           partial_marks = partial_marks + 1;
          }
          if (answers[i].answer.three === val.answer.three && answers[i].answer.three) {
           partial_marks = partial_marks + 1;
          }
          if (answers[i].answer.four === val.answer.four && answers[i].answer.four) {
           partial_marks = partial_marks + 1;
          }

          if (answers[i].answer.one !== val.answer.one && answers[i].answer.one) {
           partial_marks = -10;
          }
          if (answers[i].answer.two !== val.answer.two && answers[i].answer.two) {
           partial_marks = -10;
          }
          if (answers[i].answer.three !== val.answer.three && answers[i].answer.three) {
           partial_marks = -10;
          }
          if (answers[i].answer.four !== val.answer.four && answers[i].answer.four) {
           partial_marks = -10;
          }

          if (partial_marks < 0) {
           if (examType.indexOf("single") === -1) {
            if (i < questions.length / 3) {
             physics = physics + Number(val.wrong);
            } else if (i < 2 * (questions.length / 3)) {
             chemistry = chemistry + Number(val.wrong);
            } else {
             maths = maths + Number(val.wrong);
            }
           }

           marks = marks + Number(val.wrong);
           negative = negative + Number(val.wrong);

           dums[i].status = "wrong";
           dums[i].correct = val.answer;
          } else {
           if (examType.indexOf("single") === -1) {
            if (i < questions.length / 3) {
             physics = physics + partial_marks;
            } else if (i < 2 * (questions.length / 3)) {
             chemistry = chemistry + partial_marks;
            } else {
             maths = maths + partial_marks;
            }
           }

           marks = marks + partial_marks;
           positive = positive + partial_marks;

           dums[i].status = "partial-correct";
           dums[i].correct = val.answer;
          }
         } else {
          if (examType.indexOf("single") === -1) {
           if (i < questions.length / 3) {
            physics = physics + Number(val.wrong);
           } else if (i < 2 * (questions.length / 3)) {
            chemistry = chemistry + Number(val.wrong);
           } else {
            maths = maths + Number(val.wrong);
           }
          }

          marks = marks + Number(val.wrong);
          negative = negative + Number(val.wrong);

          dums[i].status = "wrong";
          dums[i].correct = val.answer;
         }
        }
       } else {
        dums[i].status = "left";
        dums[i].correct = val.answer;
       }
      });
     } else {
      questions.map((val, i) => {
       if (answers[i].answer) {
        if (JSON.stringify(val.answer) === JSON.stringify(answers[i].answer)) {
         if (examType.indexOf("single") === -1) {
          if (i < 45) {
           physics = physics + Number(val.correct);
          } else if (i < 90) {
           chemistry = chemistry + Number(val.correct);
          } else {
           maths = maths + Number(val.correct);
          }
         }

         marks = marks + Number(val.correct);
         positive = positive + Number(val.correct);

         dums[i].status = "correct";
         dums[i].correct = val.answer;
        } else {
         if (examType.indexOf("single") === -1) {
          if (i < 45) {
           physics = physics + Number(val.wrong);
          } else if (i < 90) {
           chemistry = chemistry + Number(val.wrong);
          } else {
           maths = maths + Number(val.wrong);
          }
         }

         marks = marks + Number(val.wrong);
         negative = negative + Number(val.wrong);

         dums[i].status = "wrong";
         dums[i].correct = val.answer;
        }
       } else {
        dums[i].status = "left";
        dums[i].correct = val.answer;
       }
      });
     }

     axios
      .post("/user/find", { mail: mail })
      .then((res) => {
       let exsists = false;
       console.log(res, mail);

       for (let i = 0; i < res.data.exams.length; i++) {
        if (res.data.exams[i].examname === examName && res.data.exams[i].examtype === examType) exsists = true;
       }

       if (exsists) {
        setBackdrop(false);
        alert("sorry you have already submitted answers for this exam");
        history.push(`/writexam/${examName}_${examType}/result/1`);
       } else {
        let exams = res.data.exams;

        exams.push({
         examname: examName,
         examtype: examType,
         answers: dums,
         marks: { total: marks, positive: positive, negative: negative, physics: physics, chemistry: chemistry, maths: maths },
         time: {
          totaltime: msToTime(time2 - time),
          actualtime: msToTime(time3.time + Date.now() - time3.on),
          physics: 0,
          chemistry: 0,
          maths: 0,
          subtime: Date.now(),
         },
         switches: switches,
        });

        let ptime = res.data.time;
        ptime.push({
         examname: examName,
         examtype: examType,
         stime: new Date().toLocaleTimeString("en-US"),

         date: new Date().toLocaleDateString(),
         dur: msToTime(time2 - time),
        });

        axios
         .post("/user/updat", { mail: mail, exams: exams, time: ptime })
         .then((res) => {
          setAnswers(dums);
          setAnswers2(dums);
          console.log(res);

          setTime3((prev) => {
           let dum = { ...prev };
           dum.physics = 0;
           dum.chemistry = 0;
           dum.maths = 0;
           dum.time = msToTime(dum.time + Date.now() - dum.on);
           dum.subtime = Date.now();
           return dum;
          });

          setMarks((prev) => {
           let dum = { ...prev };
           dum.total = marks;
           dum.positive = positive;
           dum.negative = negative;
           dum.physics = physics;
           dum.chemistry = chemistry;
           dum.maths = maths;
           return dum;
          });
          setAnswers((prev) => {
           let dum = [...prev];
           dum[nind - 1].time = dum[nind - 1].time - (Date.now() - htime.qon) / 2;
           return dum;
          });
          setAnswers2((prev) => {
           let dum = [...prev];
           dum[nind - 1].time = dum[nind - 1].time - (Date.now() - htime.qon) / 2;
           return dum;
          });

          setBackdrop(false);

          alert("Your answers got sucessfully submitted");
          history.push(`/writexam/${examName}_${examType}/result/1`);
         })
         .catch((err) => {
          console.log(err.message);
          setErrText(err.message);
          setDialog2(1);
         });
       }
      })
      .catch((err) => {
       console.log(err.message);
       setErrText(err.message);
       setDialog2(1);
      });
    })
    .catch((err) => {
     console.log(err.message);
     setErrText(err.message);
     setDialog2(1);
    });
  }
 }, [submit]);

 return (
  <div className={classes.root1}>
   <ScrollToTop />
   <Backdrop className={classes.backdrop} open={backdrop}>
    <div style={{ textAlign: "center" }}>
     <CircularProgress color="inherit" />
     <br />
     <p style={{ color: "white" }}>Please Wait, it might take some time don't worry</p>
    </div>
   </Backdrop>
   <Grid container>
    <Grid item xl={8} lg={8} md={12} sm={12} xs={12}>
     <div style={{ display: "flex", justifyContent: "space-around" }}>
      <Chip size="large" label={`${examName}`} color="primary" style={{ marginRight: "5px", width: "150px" }} />
      <h3 style={{ textAlign: "center", display: "inline-block", marginTop: "0px" }}>Question {nind}</h3>
      <Chip
       size="large"
       label={msToTime((examType.indexOf("single-advanced") !== -1 ? examTime : examType.indexOf("single") !== -1 ? 3600000 : 10800000) - (time2 - time))}
       color="primary"
      />
     </div>
    </Grid>
    <Grid item xl={8} lg={8} md={12} sm={12} xs={12}>
     <div>
      <div
       style={{
        width: "100%",
        height: "360px",
        overflowX: "scroll",
        overflowY: "scroll",
        whiteSpace: "nowrap",
        textAlign: "center",
        margin: "auto",
       }}
      >
       {imageloading ? (
        <div>
         {" "}
         <CircularProgress />{" "}
         <img
          src={`/images/${answers[nind - 1].image}`}
          onLoad={() => {
           setImageloading(false);
           console.log(imageloading);
          }}
         />
        </div>
       ) : (
        <img src={`/images/${answers[nind - 1].image}`} />
       )}
      </div>

      <br />
      <div style={{ textAlign: "center" }}>
       {questionType === "single" ? (
        <FormControl component="fieldset">
         <RadioGroup
          row
          aria-label="options"
          name="options"
          value={answers[nind - 1].danswer}
          onChange={(e) => {
           console.log(answers);
           setAnswers((prev) => {
            let dum = [...prev];
            dum[nind - 1].danswer = e.target.value;

            return dum;
           });
          }}
         >
          <FormControlLabel value="1" control={<Radio />} label="1)" />
          <FormControlLabel value="2" control={<Radio />} label="2)" />
          <FormControlLabel value="3" control={<Radio />} label="3)" />
          <FormControlLabel value="4" control={<Radio />} label="4)" />
         </RadioGroup>
        </FormControl>
       ) : questionType.indexOf("multiple") !== -1 ? (
        <>
         <FormControlLabel
          control={
           <Checkbox
            checked={answers[nind - 1].answer ? answers[nind - 1].danswer.one : null}
            onChange={(e) => {
             setAnswers((prev) => {
              let dum = [...prev];
              dum[nind - 1].danswer.one = e.target.checked;
              return dum;
             });
            }}
            color="primary"
           />
          }
          label="1)"
         />
         <FormControlLabel
          control={
           <Checkbox
            checked={answers[nind - 1].answer ? answers[nind - 1].danswer.two : null}
            onChange={(e) => {
             setAnswers((prev) => {
              let dum = [...prev];
              dum[nind - 1].danswer.two = e.target.checked;
              return dum;
             });
            }}
            color="primary"
           />
          }
          label="2)"
         />
         <FormControlLabel
          control={
           <Checkbox
            checked={answers[nind - 1].answer ? answers[nind - 1].danswer.three : null}
            onChange={(e) => {
             setAnswers((prev) => {
              let dum = [...prev];
              dum[nind - 1].danswer.three = e.target.checked;
              return dum;
             });
            }}
            color="primary"
           />
          }
          label="3)"
         />
         <FormControlLabel
          control={
           <Checkbox
            checked={answers[nind - 1].answer ? answers[nind - 1].danswer.four : null}
            onChange={(e) => {
             setAnswers((prev) => {
              let dum = [...prev];
              dum[nind - 1].danswer.four = e.target.checked;
              return dum;
             });
            }}
            color="primary"
           />
          }
          label="4)"
         />
        </>
       ) : (
        <div>
         <TextField
          id="standard-basic"
          label="Numerical Type"
          style={{ marginBottom: "0px", width: "250px" }}
          value={answers[nind - 1].danswer}
          onChange={(e) => {
           setAnswers((prev) => {
            let dum = [...prev];
            dum[nind - 1].danswer = e.target.value;
            return dum;
           });
          }}
         />{" "}
        </div>
       )}

       <br />

       <Button
        variant="contained"
        style={{ backgroundColor: "#43d001", color: "white", fontSize: 15, marginLeft: "3px", marginRight: "15px" }}
        onClick={() => {
         if (answers[nind - 1].danswer) {
          setAnswers((prev) => {
           let dum = [...prev];
           dum[nind - 1].answer =
            examType.indexOf("advanced") !== -1 && dum[nind - 1].type.indexOf("multiple") !== -1 ? { ...dum[nind - 1].danswer } : dum[nind - 1].danswer;

           return dum;
          });

          if (nind === answers.length) history.push(`/writexam/${examName}_${examType}/paper/1`);
          else history.push(`/writexam/${examName}_${examType}/paper/${nind + 1}`);
         } else {
          alert("Please Select a Option");
         }
        }}
       >
        Save and Next
       </Button>

       <Button
        variant="contained"
        style={{ fontSize: 15, margin: "5px", backgroundColor: "#e6e6e6", borderColor: "#adadad" }}
        onClick={() => {
         setAnswers((prev) => {
          let dum = [...prev];
          dum[nind - 1].answer =
           examType.indexOf("advanced") !== -1 && dum[nind - 1].type.indexOf("multiple") !== -1 ? { one: false, two: false, three: false, four: false } : "";
          dum[nind - 1].danswer =
           examType.indexOf("advanced") !== -1 && dum[nind - 1].type.indexOf("multiple") !== -1 ? { one: false, two: false, three: false, four: false } : "";

          return dum;
         });
        }}
       >
        Clear
       </Button>

       <Button
        variant="contained"
        style={{ backgroundColor: "#ec971f", color: "white", fontSize: 15, margin: "5px" }}
        onClick={() => {
         if (answers[nind - 1].danswer) {
          setAnswers((prev) => {
           let dum = [...prev];
           dum[nind - 1].answer =
            examType.indexOf("advanced") !== -1 && dum[nind - 1].type.indexOf("multiple") !== -1 ? { ...dum[nind - 1].danswer } : dum[nind - 1].danswer;

           dum[nind - 1].review = true;
           return dum;
          });

          if (nind === answers.length) history.push(`/writexam/${examName}_${examType}/paper/1`);
          else history.push(`/writexam/${examName}_${examType}/paper/${nind + 1}`);
         } else {
          alert("Please Select a Option");
         }
        }}
       >
        Save and Mark for Review
       </Button>

       <Button
        variant="contained"
        style={{ backgroundColor: "#286090", color: "white", fontSize: 15, margin: "5px" }}
        onClick={() => {
         setAnswers((prev) => {
          let dum = [...prev];

          dum[nind - 1].review = true;
          return dum;
         });
         if (nind === answers.length) history.push(`/writexam/${examName}_${examType}/paper/1`);
         else history.push(`/writexam/${examName}_${examType}/paper/${nind + 1}`);
        }}
       >
        Mark for Review and Next
       </Button>

       <hr />
       <div style={{ backgroundColor: "#f1f6f9" }}>
        <Button
         variant="contained"
         style={{ margin: "5px", backgroundColor: "#e6e6e6", borderColor: "#adadad", marginRight: "30px" }}
         onClick={() => {
          if (nind === 1) history.push(`/writexam/${examName}_${examType}/paper/${answers.length}`);
          else history.push(`/writexam/${examName}_${examType}/paper/${nind - 1}`);
         }}
        >
         Back
        </Button>

        <Button
         variant="contained"
         style={{ margin: "5px", backgroundColor: "#e6e6e6", borderColor: "#adadad", marginRight: "100px" }}
         onClick={() => {
          if (nind === answers.length) history.push(`/writexam/${examName}_${examType}/paper/1`);
          else history.push(`/writexam/${examName}_${examType}/paper/${nind + 1}`);
         }}
        >
         Next
        </Button>

        <Button
         variant="contained"
         style={{ margin: "5px", backgroundColor: "#43d001", color: "white", width: "300px" }}
         onClick={() => {
          setDialog(1);
         }}
        >
         Submit
        </Button>
       </div>
      </div>
     </div>
    </Grid>

    <Grid item xl={4} lg={4} md={12} sm={12} xs={12}>
     <div
      style={{
       width: "100%",
       height: "200px",

       overflowX: "scroll",
       overflowY: "scroll",
       whiteSpace: "nowrap",
       border: "1px solid black",

       marginTop: "10px",
       marginBottom: "10px",
      }}
     >
      {answers.map((tile, i) => {
       if (answers[i].answer && answers[i].review) areview = areview + 1;
       else if (answers[i].answer) answered = answered + 1;
       else if (answers[i].review) review = review + 1;
       else if (answers[i].visited) unanswered = unanswered + 1;
       else notvisited = notvisited + 1;

       if (answers[i].visited) tcolor = "white";
       else tcolor = "";
      })}

      <Button style={{ margin: "10px" }} variant="contained">
       {notvisited}
      </Button>

      <p style={{ display: "inline-block", marginRight: "10px" }}>Not Visited</p>

      <Button style={{ backgroundColor: "red", color: "white", margin: "10px" }} variant="contained">
       {unanswered}
      </Button>
      <p style={{ display: "inline-block" }}>Not Answered</p>
      <br />
      <Button style={{ backgroundColor: "#43d001", color: "white", margin: "10px" }} variant="contained">
       {answered}
      </Button>

      <p style={{ display: "inline-block", marginRight: "20px" }}>Answered</p>

      <Button style={{ backgroundColor: "#52057b", color: "white", margin: "10px" }} variant="contained">
       {review}
      </Button>
      <p style={{ display: "inline-block" }}>Marked for Review</p>
      <br />
      <Button style={{ backgroundColor: "#52057b", color: "white", margin: "10px" }} variant="contained">
       {areview} <CheckCircleOutlineRoundedIcon style={{ fontSize: 15, backgroundColor: "green" }} />
      </Button>

      <p style={{ display: "inline-block" }}>Answered & Marked for Review </p>
     </div>
     {examType.indexOf("advanced") !== -1 ? (
      <div
       style={{
        width: "100%",
        height: "200px",

        overflowX: "scroll",
        overflowY: "scroll",
        whiteSpace: "nowrap",
        border: "1px solid black",

        marginTop: "10px",
        marginBottom: "10px",
        lineHeight: "0.1",
       }}
      >
       <p style={{ display: "inline-block", width: "200px", margin: "10px", fontWeight: "bold" }}>Section Name</p>
       <p style={{ display: "inline-block", width: "100px", textAlign: "center", fontWeight: "bold" }}>Starts At</p>
       <p style={{ display: "inline-block", width: "100px", textAlign: "center", fontWeight: "bold" }}>Marks</p>
       <br />

       {answers.map((val, i) => {
        if (i === 0) {
         return (
          <>
           {examType.indexOf("single") === -1 ? <p style={{ fontWeight: "bold", margin: "5px" }}>Physics: </p> : ""}
           <p style={{ display: "inline-block", width: "200px", margin: "10px" }}>{val.secname}</p>
           <p style={{ display: "inline-block", width: "100px", textAlign: "center" }}>{i + 1}</p>
           <p style={{ display: "inline-block", width: "100px", textAlign: "center" }}>
            {val.cmarks}, {val.wmarks}
           </p>
          </>
         );
        } else {
         if (
          answers[i - 1].secname !== val.secname ||
          answers[i - 1].cmarks !== val.cmarks ||
          answers[i - 1].wmarks !== val.wmarks ||
          answers[i - 1].type !== val.type
         ) {
          return (
           <>
            <p style={{ fontWeight: "bold", margin: "5px" }}>{i === answers.length / 3 ? (examType.indexOf("single") === -1 ? "Chemistry: " : null) : null}</p>
            <p style={{ fontWeight: "bold", margin: "5px" }}>
             {i === (2 * answers.length) / 3 ? (examType.indexOf("single") === -1 ? "Maths: " : null) : null}
            </p>
            <p style={{ display: "inline-block", width: "200px", margin: "10px" }}>{val.secname}</p>
            <p style={{ display: "inline-block", width: "100px", textAlign: "center" }}>{i + 1}</p>
            <p style={{ display: "inline-block", width: "100px", textAlign: "center" }}>
             {val.cmarks}, {val.wmarks}
            </p>
           </>
          );
         }
        }
       })}
      </div>
     ) : null}
     <br />
     <div
      style={{
       width: "100%",
       height: "400px",

       overflowY: "scroll",
       margin: "auto",
      }}
     >
      {answers.map((tile, i) => {
       if (examType.indexOf("advanced") !== -1 && answers[i].type.indexOf("multiple") !== -1) {
        if ((answers[i].answer.one || answers[i].answer.two || answers[i].answer.three || answers[i].answer.four) && answers[i].review) bcolor = "#52057b";
        else if ((answers[i].answer.one || answers[i].answer.two || answers[i].answer.three || answers[i].answer.four) && answers[i].answer) bcolor = "#43d001";
        else if (answers[i].review) bcolor = "#52057b";
        else if (answers[i].visited) bcolor = "red";
        else bcolor = "";
       } else {
        if (answers[i].answer && answers[i].review) bcolor = "#52057b";
        else if (answers[i].answer) bcolor = "#43d001";
        else if (answers[i].review) bcolor = "#52057b";
        else if (answers[i].visited) bcolor = "red";
        else bcolor = "";
       }

       if (answers[i].visited) tcolor = "white";
       else tcolor = "";

       return (
        <Button
         style={{ backgroundColor: `${bcolor}`, color: `${tcolor}`, margin: "5px" }}
         variant="contained"
         onClick={() => {
          history.push(`/writexam/${examName}_${examType}/paper/${i + 1}`);
         }}
        >
         {i + 1} {answers[i].answer && answers[i].review ? <CheckCircleOutlineRoundedIcon style={{ fontSize: 15, backgroundColor: "green" }} /> : null}
        </Button>
       );
      })}
     </div>
    </Grid>
   </Grid>
   <Dialog
    open={dialog}
    onClose={() => {
     setDialog(false);
    }}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
   >
    <DialogTitle id="alert-dialog-title">{"Are you sure to submit"}</DialogTitle>
    <DialogContent>Once submitted, you cannot submit again</DialogContent>

    <DialogActions>
     <Button
      onClick={() => {
       setSubmit(1);
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

   <Dialog open={dialog2} onClose={() => {}} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
    <DialogTitle id="alert-dialog-title">{"Failed to Submit"}</DialogTitle>
    <DialogContent>
     <p> It seems you are offline but don't worry until you get internet don't close this tab and once you are online click on Try again</p>
     <p style={{ color: "red" }}>Error msg: {errText}</p>
    </DialogContent>

    <DialogActions>
     <Button
      onClick={() => {
       console.log(errText);
       setSubmit(submit + 1);

       setDialog2(false);
      }}
      color="primary"
     >
      Try again
     </Button>
    </DialogActions>
   </Dialog>
  </div>
 );
}

export default Options;
