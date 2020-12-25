import {
 Button,
 TextField,
 Backdrop,
 CircularProgress,
 RadioGroup,
 FormControlLabel,
 FormControl,
 FormLabel,
 Radio,
 GridList,
 GridListTile,
 Grid,
 Checkbox,
} from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Route, useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { ExamName, ExamType, Modify, Questions } from "./storage";
import ScrollToTop from "./scroll";

const useStyles = makeStyles((theme) => ({
 root1: {
  flexGrow: 1,
 },
 backdrop: {
  zIndex: theme.zIndex.drawer + 1,
  color: "#fff",
 },
}));

function Question() {
 let { ind } = useParams();
 let history = useHistory();

 let nind = Number(ind);
 const [backdrop, setBackdrop] = useState(false);

 const [imageloading, setImageloading] = useState(false);
 const [questions, setQuestions] = useContext(Questions);
 const [examName, setExamName] = useContext(ExamName);
 const [examType, setExamType] = useContext(ExamType);
 const [modify, setModify] = useContext(Modify);

 const classes = useStyles();
 const [questionType, setQuestionType] = useState("single");

 useEffect(() => {
  setImageloading(true);

  if (examType.indexOf("mains") !== -1) {
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

  if (examType.indexOf("advanced") !== -1) {
   setQuestionType(questions[nind - 1].type);
  }
 }, [nind]);

 return (
  <div className={classes.root1}>
   <ScrollToTop />
   <Backdrop className={classes.backdrop} open={backdrop}>
    <CircularProgress color="inherit" />
   </Backdrop>
   <Grid container>
    <Grid item xl={8} lg={8} md={12} xs={12} sm={12}>
     <h2 style={{ textAlign: "center" }}>Question {nind}</h2>
     <div>
      <div>
       <input
        type="file"
        name="file"
        id="file"
        onChange={(e) => {
         let img = e.target.files[0];
         let found = false;

         if (img) {
          setQuestions((prev) => {
           let dum = [...prev];
           dum[nind - 1].image = img.lastModified;
           return dum;
          });
          axios.get("/files").then((res) => {
           res.data.map((val, i) => {
            if (Number(val.filename) === img.lastModified) {
             console.log("found image", img.lastModified);
             found = true;
            }
           });

           if (!found) {
            console.log("uploading new image", img.lastModified);
            const formData = new FormData();

            formData.append("file", img, img.lastModified);

            axios.post("/upload", formData).then((res) => {
             console.log(res);
            });
           }
          });
         }
        }}
       />
      </div>
      <br />
      <br />

      {!questions[nind - 1].image ? null : (
       <div>
        <div
         style={{
          width: "100%",
          height: "500px",
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
            src={`/images/${questions[nind - 1].image}`}
            onLoad={() => {
             setImageloading(false);
             console.log(imageloading);
            }}
           />
          </div>
         ) : (
          <img src={`/images/${questions[nind - 1].image}`} />
         )}
        </div>

        <br />
        <div style={{ textAlign: "center" }}>
         {questionType === "single" ? (
          <FormControl component="fieldset">
           <FormLabel component="legend">Correct Option</FormLabel>
           <RadioGroup
            row
            aria-label="options"
            name="options"
            value={questions[nind - 1].answer}
            onChange={(e) => {
             setQuestions((prev) => {
              let dum = [...prev];
              dum[nind - 1].answer = e.target.value;
              dum[nind - 1].correct = 4;
              dum[nind - 1].wrong = -1;

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
         ) : (
          <div>
           {questionType === "multiple" ? (
            <d>
             <FormControlLabel
              control={
               <Checkbox
                checked={questions[nind - 1].answer ? questions[nind - 1].answer.one : null}
                onChange={(e) => {
                 setQuestions((prev) => {
                  let dum = [...prev];
                  dum[nind - 1].answer.one = e.target.checked;
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
                checked={questions[nind - 1].answer ? questions[nind - 1].answer.two : null}
                onChange={(e) => {
                 setQuestions((prev) => {
                  let dum = [...prev];
                  dum[nind - 1].answer.two = e.target.checked;
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
                checked={questions[nind - 1].answer ? questions[nind - 1].answer.three : null}
                onChange={(e) => {
                 setQuestions((prev) => {
                  let dum = [...prev];
                  dum[nind - 1].answer.three = e.target.checked;
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
                checked={questions[nind - 1].answer ? questions[nind - 1].answer.four : null}
                onChange={(e) => {
                 setQuestions((prev) => {
                  let dum = [...prev];
                  dum[nind - 1].answer.four = e.target.checked;
                  return dum;
                 });
                }}
                color="primary"
               />
              }
              label="4)"
             />
            </d>
           ) : (
            <div>
             <TextField
              id="standard-basic"
              label="Answer"
              value={questions[nind - 1].answer}
              onChange={(e) => {
               if (examType.indexOf("mains") !== -1) {
                setQuestions((prev) => {
                 let dum = [...prev];
                 dum[nind - 1].answer = e.target.value;
                 dum[nind - 1].correct = 4;
                 dum[nind - 1].wrong = 0;
                 return dum;
                });
               } else if (examType.indexOf("advanced") !== -1) {
                setQuestions((prev) => {
                 let dum = [...prev];
                 dum[nind - 1].answer = e.target.value;

                 return dum;
                });
               }
              }}
             />
             <p>round-off the value to TWO decimal places; e.g. 23 as 23, 5.2 as 5.2, 5.48913 as 5.49</p>
            </div>
           )}
          </div>
         )}
        </div>
       </div>
      )}

      <div style={{ textAlign: "center" }}>
       <Button
        color="primary"
        variant="contained"
        style={{ margin: "5px" }}
        onClick={() => {
         if (nind === 1) history.push(`/setexam/paper/${questions.length}`);
         else history.push(`/setexam/paper/${nind - 1}`);
        }}
       >
        Back
       </Button>
       <Button
        color="primary"
        variant="contained"
        style={{ margin: "5px" }}
        onClick={() => {
         if (nind === questions.length) history.push(`/setexam/paper/1`);
         else history.push(`/setexam/paper/${nind + 1}`);
        }}
       >
        Next
       </Button>
      </div>
     </div>
    </Grid>

    <Grid item xl={4} lg={4} md={12} sm={12} xs={12} style={{ marginTop: "auto", marginBottom: "auto" }}>
     <div style={{ width: "100%", height: "700px", overflowY: "scroll", margin: "auto" }}>
      {examType.indexOf("mains") !== -1 ? (
       <div>
        <label>{examType.indexOf("single") === -1 ? "Physics 25 Ques: " : "All 25 Ques: "}</label>
        <input
         type="file"
         name="file"
         id="file"
         multiple
         onChange={(e) => {
          let img = e.target.files;

          if (img.length === 25) {
           for (let key = 0; key < img.length; key++) {
            console.log(key, img[key], img);
            let formData = new FormData();

            formData.append("file", img[key], key);

            setBackdrop(true);
            axios.post("/upload", formData).then((res) => {
             console.log(res.data.filename);
             setQuestions((prev) => {
              let dum = [...prev];
              dum[key].image = res.data.file.filename;
              return dum;
             });
             setBackdrop(false);
            });
           }
          } else {
           alert("please select exactly 25 images");
          }
         }}
        />

        <br />
        <br />
        {examType.indexOf("single") === -1 ? (
         <div>
          <label>Chemistry 25 Ques: </label>
          <input
           type="file"
           name="file"
           id="file"
           multiple
           onChange={(e) => {
            let img = e.target.files;

            if (img.length === 25) {
             for (let key = 0; key < img.length; key++) {
              console.log(key, img[key], img);
              let formData = new FormData();

              formData.append("file", img[key], key);

              setBackdrop(true);
              axios.post("/upload", formData).then((res) => {
               console.log(res.data.filename);
               setQuestions((prev) => {
                let dum = [...prev];
                dum[25 + key].image = res.data.file.filename;
                return dum;
               });
               setBackdrop(false);
              });
             }
            } else {
             alert("please select exactly 25 images");
            }
           }}
          />

          <br />
          <br />
          <label>Maths 25 Ques: </label>
          <input
           type="file"
           name="file"
           id="file"
           multiple
           onChange={(e) => {
            let img = e.target.files;

            if (img.length === 25) {
             for (let key = 0; key < img.length; key++) {
              console.log(key, img[key], img);
              let formData = new FormData();

              formData.append("file", img[key], key);

              setBackdrop(true);
              axios.post("/upload", formData).then((res) => {
               console.log(res.data.filename);
               setQuestions((prev) => {
                let dum = [...prev];
                dum[50 + key].image = res.data.file.filename;
                return dum;
               });
               setBackdrop(false);
              });
             }
            } else {
             alert("please select exactly 25 images");
            }
           }}
          />
         </div>
        ) : null}
       </div>
      ) : examType.indexOf("advanced") !== -1 ? (
       <div>
        <label>{examType.indexOf("single") === -1 ? `Physics ${questions.length / 3} Ques: ` : `All ${questions.length / 3} Ques: `}</label>
        <input
         type="file"
         name="file"
         id="file"
         multiple
         onChange={(e) => {
          let img = e.target.files;

          if (img.length === questions.length / 3) {
           for (let key = 0; key < img.length; key++) {
            console.log(key, img[key], img);
            let formData = new FormData();

            formData.append("file", img[key], key);

            setBackdrop(true);
            axios.post("/upload", formData).then((res) => {
             console.log(res.data.filename);
             setQuestions((prev) => {
              let dum = [...prev];
              dum[key].image = res.data.file.filename;
              return dum;
             });
             setBackdrop(false);
            });
           }
          } else {
           alert(`please select exactly ${questions.length / 3} images`);
          }
         }}
        />

        <br />
        <br />
        {examType.indexOf("single") === -1 ? (
         <div>
          <label>Chemistry {questions.length / 3} Ques: </label>
          <input
           type="file"
           name="file"
           id="file"
           multiple
           onChange={(e) => {
            let img = e.target.files;

            if (img.length === questions.length / 3) {
             for (let key = 0; key < img.length; key++) {
              console.log(key, img[key], img);
              let formData = new FormData();

              formData.append("file", img[key], key);

              setBackdrop(true);
              axios.post("/upload", formData).then((res) => {
               console.log(res.data.filename);
               setQuestions((prev) => {
                let dum = [...prev];
                dum[questions.length / 3 + key].image = res.data.file.filename;
                return dum;
               });
               setBackdrop(false);
              });
             }
            } else {
             alert(`please select exactly ${questions.length / 3} images`);
            }
           }}
          />

          <br />
          <br />
          <label>Maths {questions.length / 3} Ques: </label>
          <input
           type="file"
           name="file"
           id="file"
           multiple
           onChange={(e) => {
            let img = e.target.files;

            if (img.length === questions.length / 3) {
             for (let key = 0; key < img.length; key++) {
              console.log(key, img[key], img);
              let formData = new FormData();

              formData.append("file", img[key], key);

              setBackdrop(true);
              axios.post("/upload", formData).then((res) => {
               console.log(res.data.filename);
               setQuestions((prev) => {
                let dum = [...prev];
                dum[(2 * questions.length) / 3 + key].image = res.data.file.filename;
                return dum;
               });
               setBackdrop(false);
              });
             }
            } else {
             alert(`please select exactly ${questions.length / 3} images`);
            }
           }}
          />
         </div>
        ) : null}
       </div>
      ) : (
       <div>
        <label>{examType.indexOf("single") === -1 ? "Physics 45 Ques: " : "All 45 Ques: "}</label>
        <input
         type="file"
         name="file"
         id="file"
         multiple
         onChange={(e) => {
          let img = e.target.files;

          if (img.length === 45) {
           for (let key = 0; key < img.length; key++) {
            console.log(key, img[key], img);
            let formData = new FormData();

            formData.append("file", img[key], key);

            setBackdrop(true);
            axios.post("/upload", formData).then((res) => {
             console.log(res.data.filename);
             setQuestions((prev) => {
              let dum = [...prev];
              dum[key].image = res.data.file.filename;
              return dum;
             });
             setBackdrop(false);
            });
           }
          } else {
           alert("please select exactly 45 images");
          }
         }}
        />

        <br />
        <br />
        {examType.indexOf("single") === -1 ? (
         <div>
          <label>Chemistry 45 Ques: </label>
          <input
           type="file"
           name="file"
           id="file"
           multiple
           onChange={(e) => {
            let img = e.target.files;

            if (img.length === 45) {
             for (let key = 0; key < img.length; key++) {
              console.log(key, img[key], img);
              let formData = new FormData();

              formData.append("file", img[key], key);

              setBackdrop(true);
              axios.post("/upload", formData).then((res) => {
               console.log(res.data.filename);
               setQuestions((prev) => {
                let dum = [...prev];
                dum[45 + key].image = res.data.file.filename;
                return dum;
               });
               setBackdrop(false);
              });
             }
            } else {
             alert("please select exactly 45 images");
            }
           }}
          />

          <br />
          <br />
          <label>Biology 90 Ques: </label>
          <input
           type="file"
           name="file"
           id="file"
           multiple
           onChange={(e) => {
            let img = e.target.files;

            if (img.length === 90) {
             for (let key = 0; key < img.length; key++) {
              console.log(key, img[key], img);
              let formData = new FormData();

              formData.append("file", img[key], key);

              setBackdrop(true);
              axios.post("/upload", formData).then((res) => {
               console.log(res.data.filename);
               setQuestions((prev) => {
                let dum = [...prev];
                dum[90 + key].image = res.data.file.filename;
                return dum;
               });
               setBackdrop(false);
              });
             }
            } else {
             alert("please select exactly 90 images");
            }
           }}
          />
         </div>
        ) : null}
       </div>
      )}
      <br />

      {questions.map((tile, i) => {
       let tcolor;
       if (examType.indexOf("advanced") !== -1) {
        if (questions[i].type === "multiple") {
         if (questions[i].image && (questions[i].answer.one || questions[i].answer.two || questions[i].answer.three || questions[i].answer.four)) {
          tcolor = "primary";
         } else tcolor = "secondary";
        } else {
         tcolor = questions[i].image && questions[i].answer ? "primary" : "secondary";
        }
       } else {
        tcolor = questions[i].image && questions[i].answer ? "primary" : "secondary";
       }
       return (
        <Button style={{ margin: "5px" }} variant="contained" color={tcolor} onClick={() => history.push(`/setexam/paper/${i + 1}`)}>
         {i + 1}
        </Button>
       );
      })}
     </div>
     <br />

     <div style={{ textAlign: "center" }}>
      <Button
       variant="contained"
       color="primary"
       onClick={() => {
        if (!modify) {
         setBackdrop(true);
         axios
          .post("/exam/add/", { examname: examName, examtype: examType, questions: questions })
          .then((res) => {
           console.log(res);

           setBackdrop(false);
           history.push("/");
          })
          .catch((err) => {
           console.log(err);
          });
        } else {
         setBackdrop(true);
         axios
          .post("/exam/update/", { examname: examName, examtype: examType, questions: questions })
          .then((res) => {
           console.log(res);

           setModify(false);
           setBackdrop(false);
           history.push("/");
          })
          .catch((err) => {
           console.log(err);
          });
        }
       }}
      >
       Save
      </Button>
     </div>
    </Grid>
   </Grid>
  </div>
 );
}

export default Question;
