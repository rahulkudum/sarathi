import { Button, TextField, Backdrop, CircularProgress,Dialog,DialogActions,DialogTitle, RadioGroup,Chip, FormControlLabel, FormControl, FormLabel, Radio, GridList, GridListTile, Grid, DialogContent } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Route, useHistory, useParams, useRouteMatch } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { Answers, ExamName, ExamType, Marks, Questions, Time, Time2, UserName } from "./storage";
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import ScrollToTop from "./scroll";

function Options() {

  let { path, url } = useRouteMatch();
  let { ind } = useParams();
  let history = useHistory();

  let nind = Number(ind);
  let questionType;




  const [questions, setQuestions] = useContext(Questions);
  const [examName, setExamName] = useContext(ExamName);
  const [examType, setExamType] = useContext(ExamType);


  const [answers, setAnswers] = useContext(Answers);
  const [mail, setMail] = useContext(UserName);
  const [time, setTime] = useContext(Time);
  const [time2, setTime2] = useContext(Time2);
  const [backdrop, setBackdrop] = useState(false);
  const [imageloading, setImageloading] = useState(false);
  const [tmarks, setMarks] = useContext(Marks);
  const [dialog,setDialog]=useState(false);
  const [submit,setSubmit]=useState(false);

  if (examType === "mains") {

    if ( nind === 21 || nind === 22 || nind === 23 || nind === 24 || nind === 25
      || nind === 46 || nind === 47 || nind === 48 || nind === 49 || nind === 50
      || nind === 71 || nind === 72 || nind === 73 || nind === 74 || nind === 75


    ) {
      questionType = "integer";
    } else {
      questionType = "single";
    }
  }





  const useStyles = makeStyles((theme) => ({

    root1: {
      flexGrow: 1,
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

    setAnswers(prev => {
      let dum = [...prev];
      dum[nind - 1].visited = true;

      return dum;
    })

    console.log(answers[nind - 1].visited);
    setImageloading(true);


    let atime = setInterval(() => {


      setAnswers(prev => {
        let dum = [...prev];
        dum[nind - 1].time = dum[nind - 1].time + 500;

        return dum;
      })

    }, 1000);

    return (() => {

      clearInterval(atime);
    })


  }, [nind]);

  function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  }

  useEffect(() => {

    let rtime = setInterval(() => {

      setTime2(Date.now());

      if (Date.now() - time >= 10800000) {
        setBackdrop(true);


        let marks = 0;
        let positive = 0;
        let negative = 0;


        questions.map((val, i) => {
          if (answers[i].answer) {
            if (val.answer === answers[i].answer) {
              marks = marks + Number(val.correct);
              positive = positive + Number(val.correct);
              setAnswers(prev => {
                let dum = [...prev];
                dum[i].status = "correct";
                dum[i].correct = val.answer;
                return dum;
              })
            } else {
              marks = marks + Number(val.wrong);
              negative = negative + Number(val.wrong);
              setAnswers(prev => {
                let dum = [...prev];
                dum[i].status = "wrong";
                dum[i].correct = val.answer;
                return dum;
              })

            }
          } else {
            setAnswers(prev => {
              let dum = [...prev];
              dum[i].status = "left";
              dum[i].correct = val.answer;
              return dum;
            })


          }
        })
        setMarks(prev => {
          let dum = { ...prev };
          dum.total = marks;
          dum.positive = positive;
          dum.negative = negative;
          return dum;
        });


        axios.post("/user/find", { mail: mail })
          .then(res => {
            clearInterval(rtime);

            let exsists = false;
            console.log(res, mail);


            for (let i = 0; i < res.data.exams.length; i++) {
              if (res.data.exams[i].examname === examName && res.data.exams[i].examtype === examType) exsists = true;
            }

            if (exsists) {

              setBackdrop(false);

              alert("sorry you have already submitted answers for this exam");

              history.push(`/writexam/${examName}_${examType}`);
            } else {



              let exams = res.data.exams;
              console.log("fvgjnmkl", tmarks);
              exams.push({
                examname: examName,
                examtype: examType,
                answers: answers,
                marks: { total: marks, positive: positive, negative: negative }
              });

              console.log(marks, exams);

              axios.post("/user/updat", { mail: mail, exams: exams })
                .then(res => {
                  console.log(res);

                  setBackdrop(false);
                 
                  alert("Time's up! so your answers are automatically submitted");
                  history.push(`/writexam/${examName}_${examType}/result/1`)
                })
            }

          })





      }





    }, 1000);

    return(()=>{
      clearInterval(rtime);
    })


  }, []);


  useEffect(()=>{
    if(submit){
      let marks = 0;
      let positive = 0;
      let negative = 0;
      setBackdrop(true);

      questions.map((val, i) => {
        if (answers[i].answer) {
          if (val.answer === answers[i].answer) {
            marks = marks + Number(val.correct);
            positive = positive + Number(val.correct);
            setAnswers(prev => {
              let dum = [...prev];
              dum[i].status = "correct";
              dum[i].correct = val.answer;
              return dum;
            })
          } else {
            marks = marks + Number(val.wrong);
            negative = negative + Number(val.wrong);
            setAnswers(prev => {
              let dum = [...prev];
              dum[i].status = "wrong";
              dum[i].correct = val.answer;
              return dum;
            })

          }
        } else {
          setAnswers(prev => {
            let dum = [...prev];
            dum[i].status = "left";
            dum[i].correct = val.answer;
            return dum;
          })


        }
      })

      setMarks(prev => {
        let dum = { ...prev };
        dum.total = marks;
        dum.positive = positive;
        dum.negative = negative;
        return dum;
      });




      axios.post("/user/find", { mail: mail })
        .then(res => {
          let exsists = false;
          console.log(res, mail);


          for (let i = 0; i < res.data.exams.length; i++) {
            if (res.data.exams[i].examname === examName && res.data.exams[i].examtype === examType) exsists = true;
          }

          if (exsists) {
            setBackdrop(false);
            alert("sorry you have already submitted answers for this exam");
            history.push(`/writexam/${examName}_${examType}`);
          } else {


            console.log(tmarks);



            let exams = res.data.exams;
            exams.push({
              examname: examName,
              examtype: examType,
              answers: answers,
              marks: { total: marks, positive: positive, negative: negative }
            });

            console.log(marks, exams);

            axios.post("/user/updat", { mail: mail, exams: exams })
              .then(res => {
                console.log(res);

                setBackdrop(false);
                alert("Your answers got sucessfully submitted");
                history.push(`/writexam/${examName}_${examType}/result/1`)
              })
          }

        })



    }


  },[submit])




  return (
    <div className={classes.root1}>
    <ScrollToTop />
      <Backdrop className={classes.backdrop} open={backdrop} >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container >
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <h3 style={{ fontFamily: "cursive",textAlign:"center" }}>Sarathi Mains Exam</h3>
        
          <Chip size="large"
            label={`${examName}`}
            color="primary"
            style={{marginRight:"5px"}}


          />

          <Chip size="large"
            label={msToTime(10800000 - (time2 - time))}
            color="primary"


          />
          
          

        </Grid>
        <Grid item xl={8} lg={8} md={12} sm={12} xs={12} >
          <h3 style={{ textAlign: "center" }}>Question {nind}</h3>


          <div>


            <div style={{
              width: "100%",
              height: "500px",
              overflowX: "scroll",
              overflowY: "scroll",
              whiteSpace: "nowrap",
              textAlign: "center",
              margin: "auto"


            }}>

              {imageloading ? <div> <CircularProgress />  <img src={`/images/${questions[nind - 1].image}`} onLoad={() => {
                setImageloading(false);
                console.log(imageloading);
              }} />
              </div> : <img src={`/images/${questions[nind - 1].image}`} />
              }

            </div>


            <br />
            <div style={{ textAlign: "center" }}>

              {questionType === "single" ?

                <FormControl component="fieldset">

                  <RadioGroup row aria-label="options" name="options" value={answers[nind - 1].danswer} onChange={(e) => {

                    console.log(answers);
                    setAnswers(prev => {

                      let dum = [...prev];
                      dum[nind - 1].danswer = e.target.value;


                      return dum;

                    })
                  }}>
                    <FormControlLabel value="1" control={<Radio />} label="1)" />
                    <FormControlLabel value="2" control={<Radio />} label="2)" />
                    <FormControlLabel value="3" control={<Radio />} label="3)" />
                    <FormControlLabel value="4" control={<Radio />} label="4)" />
                  </RadioGroup>
                </FormControl> : <TextField id="standard-basic" label="Numerical Type" style={{ marginBottom: "10px", width: "400px" }} value={answers[nind - 1].danswer} onChange={(e) => {
                  setAnswers(prev => {

                    let dum = [...prev];
                    dum[nind - 1].danswer = e.target.value;
                    return dum;

                  })
                }} />}
                <p>round-off the value to TWO decimal places; e.g. 23 as 23.00, 5.2 as 5.20, 5.48913 as 5.49</p>

              <br />

              <Button variant="contained" style={{ backgroundColor: "#43d001", color: "white", fontSize: 15, marginLeft: "0px", marginRight: "15px" }} onClick={() => {
                if (answers[nind - 1].danswer || answers[nind - 1].answer) {

                  setAnswers(prev => {
                    let dum = [...prev];
                    dum[nind - 1].answer = dum[nind - 1].danswer;

                    return dum;
                  })
                  if (nind !== 75) history.push(`/writexam/${examName}_${examType}/paper/${nind + 1}`);
                  else history.push(`/writexam/${examName}_${examType}/paper/1`);

                } else {
                  alert("Please Select a Option");
                }
              }}>
                Save and Next
  </Button>


              <Button variant="contained" style={{ fontSize: 15, margin: "5px", backgroundColor: "#e6e6e6", borderColor: "#adadad" }} onClick={() => {
                setAnswers(prev => {
                  let dum = [...prev];
                  dum[nind - 1].answer = "";
                  dum[nind - 1].danswer = "";


                  return dum;
                })

              }}>
                Clear
  </Button>

              <Button variant="contained" style={{ backgroundColor: "#ec971f", color: "white", fontSize: 15, margin: "5px" }} onClick={() => {

                if (answers[nind - 1].danswer || answers[nind - 1].answer) {
                  setAnswers(prev => {
                    let dum = [...prev];
                    dum[nind - 1].answer = dum[nind - 1].danswer;
                    dum[nind - 1].review = true;
                    return dum;
                  })
                  if (nind !== 75) history.push(`/writexam/${examName}_${examType}/paper/${nind + 1}`);
                  else history.push(`/writexam/${examName}_${examType}/paper/1`);

                } else {
                  alert("Please Select a Option");
                }
              }}>
                Save and Mark for Review
  </Button>

              <Button variant="contained" style={{ backgroundColor: "#286090", color: "white", fontSize: 15, margin: "5px" }} onClick={() => {
                setAnswers(prev => {
                  let dum = [...prev];

                  dum[nind - 1].review = true;
                  return dum;
                })
                if (nind !== 75) history.push(`/writexam/${examName}_${examType}/paper/${nind + 1}`);
                else history.push(`/writexam/${examName}_${examType}/paper/1`);
              }}>
                Mark for Review and Next
  </Button>

              <hr />
              <div style={{ backgroundColor: "#f1f6f9" }}>

                <Button variant="contained" style={{ margin: "5px", backgroundColor: "#e6e6e6", borderColor: "#adadad", marginRight: "30px" }} onClick={() => {
                  if (nind !== 1) history.push(`/writexam/${examName}_${examType}/paper/${nind - 1}`);
                  else history.push(`/writexam/${examName}_${examType}/paper/75`);
                }}  >
                  Back
  </Button>

                <Button variant="contained" style={{ margin: "5px", backgroundColor: "#e6e6e6", borderColor: "#adadad", marginRight: "100px" }} onClick={() => {
                  if (nind !== 75) history.push(`/writexam/${examName}_${examType}/paper/${nind + 1}`);
                  else history.push(`/writexam/${examName}_${examType}/paper/1`);
                }}  >
                  Next
  </Button>

                <Button variant="contained" style={{ margin: "5px", backgroundColor: "#43d001", color: "white", width: "300px" }} onClick={() => {
              setDialog(true);


                }} >
                  Submit
  </Button>

              </div>


            </div>

          </div>


        </Grid>

        <Grid item xl={4} lg={4} md={12} sm={12} xs={12}>
          <div style={{
            width: "100%",
            height: "220px",

            overflowX: "scroll",
            overflowY:"scroll",
            whiteSpace: "nowrap",
            border: "1px solid black",



            margin: "auto",

          }}>

            {answers.map((tile, i) => {
              if (answers[i].answer && answers[i].review) areview = areview + 1;
              else if (answers[i].answer) answered = answered + 1;
              else if (answers[i].review) review = review + 1;
              else if (answers[i].visited) unanswered = unanswered + 1;
              else notvisited = notvisited + 1;

              if (answers[i].visited) tcolor = "white";
              else tcolor = ""
            })}


            <Button style={{ margin: "10px" }} variant="contained"


            >
              {notvisited}
            </Button>

            <p style={{ display: "inline-block", marginRight: "10px" }}>Not Visited</p>


            <Button style={{ backgroundColor: "red", color: "white", margin: "10px" }} variant="contained"


            >
              {unanswered}
            </Button>
            <p style={{ display: "inline-block" }}>Not Answered</p>
            <br />
            <Button style={{ backgroundColor: "#43d001", color: "white", margin: "10px" }} variant="contained"


            >
              {answered}
            </Button>

            <p style={{ display: "inline-block", marginRight: "20px" }}>Answered</p>

            <Button style={{ backgroundColor: "#52057b", color: "white", margin: "10px" }} variant="contained"


            >
              {review}
            </Button>
            <p style={{ display: "inline-block" }}>Marked for Review</p>
            <br />
            <Button style={{ backgroundColor: "#52057b", color: "white", margin: "10px" }} variant="contained"


            >
              {areview}  <CheckCircleOutlineRoundedIcon style={{ fontSize: 15, backgroundColor: "green" }} />
            </Button>

            <p style={{ display: "inline-block" }}>Answered & Marked for Review </p>



          </div>
          <br />
          <div style={{
            width: "100%",
            height: "400px",

            overflowY: "scroll",


            margin: "auto"
          }}>

            {questions.map((tile, i) => {
              if (answers[i].answer && answers[i].review) bcolor = "#52057b";
              else if (answers[i].answer) bcolor = "#43d001";
              else if (answers[i].review) bcolor = "#52057b";
              else if (answers[i].visited) bcolor = "red";
              else bcolor = "";

              if (answers[i].visited) tcolor = "white";
              else tcolor = ""


              return (
                <Button style={{ backgroundColor: `${bcolor}`, color: `${tcolor}`, margin: "5px" }} variant="contained" onClick={() => {
                  history.push(`/writexam/${examName}_${examType}/paper/${i + 1}`)


                }}>
                  {i + 1} {(answers[i].answer && answers[i].review) ? <CheckCircleOutlineRoundedIcon style={{ fontSize: 15, backgroundColor: "green" }} /> : null}
                </Button>
              );

            })}
          </div>


        </Grid>
      </Grid>
      <Dialog
        open={dialog}
        onClose={()=>{setDialog(false)}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure to submit"}</DialogTitle>
        <DialogContent>
          Once submitted, you cannot submit again 
        </DialogContent>
       
        <DialogActions>
          <Button onClick={()=>{setSubmit(true);setDialog(false)}} color="primary">
            Yes
          </Button>
          <Button onClick={()=>{setDialog(false)}} color="primary" autoFocus>
           No
          </Button>
        </DialogActions>
      </Dialog>
    </div>


  );




}

export default Options;