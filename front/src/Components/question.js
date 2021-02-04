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
 Switch,
 Grid,
 Checkbox,
 Box,
 Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Route, useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { ExamName, ExamType, Modify, Questions, ExamTime } from "./storage";
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
 const [check, setCheck] = useState(true);
 const [examTime, setExamTime] = useContext(ExamTime);
 const classes = useStyles();
 const [questionType, setQuestionType] = useState("single");
 const [progress, setProgress] = useState({ phy: 0, che: 0, mat: 0, single: true });

 useEffect(() => {
  setImageloading(true);

  setQuestionType(questions[nind - 1].type);
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

         setProgress((prev) => {
          let dum = { ...prev };
          dum.single = false;
          return dum;
         });
         if (img) {
          if (check) {
           axios.get("/files").then((res) => {
            for (let val = 0; val < res.data.length; val++) {
             if (Number(res.data[val].filename) === img.lastModified) {
              console.log("found image", img.lastModified);
              found = true;
              setQuestions((prev) => {
               let dum = [...prev];
               dum[nind - 1].image = img.lastModified;
               return dum;
              });
              setProgress((prev) => {
               let dum = { ...prev };
               dum.single = true;
               return dum;
              });
              break;
             }
            }

            if (!found) {
             console.log("uploading new image", img.lastModified);
             const formData = new FormData();

             formData.append("file", img, img.lastModified);

             axios.post("/upload", formData).then((res) => {
              setQuestions((prev) => {
               let dum = [...prev];
               dum[nind - 1].image = img.lastModified;
               return dum;
              });
              setProgress((prev) => {
               let dum = { ...prev };
               dum.single = true;
               return dum;
              });
             });
            }
           });
          } else {
           const formData = new FormData();

           formData.append("file", img, img.lastModified);

           axios.post("/upload", formData).then((res) => {
            setQuestions((prev) => {
             let dum = [...prev];
             dum[nind - 1].image = img.lastModified;
             return dum;
            });
            setProgress((prev) => {
             let dum = { ...prev };
             dum.single = true;
             return dum;
            });
           });
          }
         }
        }}
       />
      </div>
      <br />
      <br />
      {progress.single ? null : <p style={{ textAlign: "center" }}>Image is uploading...</p>}
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
        <FormControlLabel
         control={
          <Switch
           checked={questions[nind - 1].correct === questions[nind - 1].wrong}
           onChange={(e) => {
            setQuestions((prev) => {
             let dum = [...prev];
             if (questions[nind - 1].correct === questions[nind - 1].wrong) {
              dum[nind - 1].wrong = dum[nind - 1].dwrong;
             } else {
              dum[nind - 1].dwrong = dum[nind - 1].wrong;
              dum[nind - 1].wrong = dum[nind - 1].correct;
             }

             return dum;
            });
           }}
           name="checkedB"
           color="primary"
          />
         }
         label="Bonus"
        />
        <div style={{ textAlign: "center" }}>
         {questionType === "single" ? (
          <>
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
          </>
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
               setQuestions((prev) => {
                let dum = [...prev];
                dum[nind - 1].answer = e.target.value;
                return dum;
               });
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
      <FormControlLabel
       control={
        <Switch
         checked={check}
         onChange={(e) => {
          setCheck(e.target.checked);
         }}
         name="checkedB"
         color="primary"
        />
       }
       label="Reuse Images"
      />
      {examType.indexOf("neet") === -1 ? (
       <div>
        <label>{examType.indexOf("single") === -1 ? `Physics ${questions.length / 3} Ques: ` : `All ${questions.length} Ques: `}</label>
        <input
         type="file"
         name="file"
         id="file"
         multiple
         onChange={(e) => {
          let img = e.target.files;

          if (examType.indexOf("single") === -1 ? img.length === questions.length / 3 : img.length === questions.length) {
           let prog = 0;
           setProgress((prev) => {
            let dum = { ...prev };
            dum.phy = 100;
            return dum;
           });
           console.log(progress, check, prog);
           if (check) {
            axios.get("/files").then((res) => {
             for (let key = 0; key < img.length; key++) {
              let found = false;

              for (let val = 0; val < res.data.length; val++) {
               if (Number(res.data[val].filename) === img[key].lastModified) {
                console.log("found image", img[key].lastModified);
                found = true;
                setQuestions((prev) => {
                 let dum = [...prev];
                 dum[key].image = img[key].lastModified;
                 return dum;
                });
                prog = prog + 1;
                setProgress((prev) => {
                 let dum = { ...prev };
                 dum.phy = prog;
                 return dum;
                });
                break;
               }
              }
              if (!found) {
               let formData = new FormData();

               formData.append("file", img[key], img[key].lastModified);

               axios.post("/upload", formData).then((res) => {
                setQuestions((prev) => {
                 let dum = [...prev];
                 dum[key].image = img[key].lastModified;
                 return dum;
                });
                prog = prog + 1;
                setProgress((prev) => {
                 let dum = { ...prev };
                 dum.phy = prog;
                 return dum;
                });
               });
              }
             }
            });
           } else {
            for (let key = 0; key < img.length; key++) {
             let formData = new FormData();

             formData.append("file", img[key], img[key].lastModified);

             axios.post("/upload", formData).then((res) => {
              setQuestions((prev) => {
               let dum = [...prev];
               dum[key].image = img[key].lastModified;
               return dum;
              });
              prog = prog + 1;
              setProgress((prev) => {
               let dum = { ...prev };
               dum.phy = prog;
               return dum;
              });
             });
            }
           }
          } else {
           alert(`please select exactly ${examType.indexOf("single") === -1 ? questions.length / 3 : questions.length} images`);
          }
         }}
        />
        <p style={{ display: "inline-block" }}>{progress.phy === 100 ? "uploading..." : `uploads: ${progress.phy}`} </p>

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
             let prog = 0;
             setProgress((prev) => {
              let dum = { ...prev };
              dum.che = 100;
              return dum;
             });
             console.log(progress, check, prog);
             if (check) {
              axios.get("/files").then((res) => {
               for (let key = 0; key < img.length; key++) {
                let found = false;

                for (let val = 0; val < res.data.length; val++) {
                 if (Number(res.data[val].filename) === img[key].lastModified) {
                  console.log("found image", img[key].lastModified);
                  found = true;
                  setQuestions((prev) => {
                   let dum = [...prev];
                   dum[questions.length / 3 + key].image = img[key].lastModified;
                   return dum;
                  });
                  prog = prog + 1;
                  setProgress((prev) => {
                   let dum = { ...prev };
                   dum.che = prog;
                   return dum;
                  });
                  break;
                 }
                }
                if (!found) {
                 let formData = new FormData();

                 formData.append("file", img[key], img[key].lastModified);

                 axios.post("/upload", formData).then((res) => {
                  setQuestions((prev) => {
                   let dum = [...prev];
                   dum[questions.length / 3 + key].image = img[key].lastModified;
                   return dum;
                  });
                  prog = prog + 1;
                  setProgress((prev) => {
                   let dum = { ...prev };
                   dum.che = prog;
                   return dum;
                  });
                 });
                }
               }
              });
             } else {
              for (let key = 0; key < img.length; key++) {
               let formData = new FormData();

               formData.append("file", img[key], img[key].lastModified);

               axios.post("/upload", formData).then((res) => {
                setQuestions((prev) => {
                 let dum = [...prev];
                 dum[questions.length / 3 + key].image = img[key].lastModified;
                 return dum;
                });
                prog = prog + 1;
                setProgress((prev) => {
                 let dum = { ...prev };
                 dum.che = prog;
                 return dum;
                });
               });
              }
             }
            } else {
             alert(`please select exactly ${questions.length / 3} images`);
            }
           }}
          />
          <p style={{ display: "inline-block" }}>{progress.che === 100 ? "uploading..." : `uploads: ${progress.che}`} </p>

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
             let prog = 0;
             setProgress((prev) => {
              let dum = { ...prev };
              dum.mat = 100;
              return dum;
             });
             console.log(progress, check, prog);
             if (check) {
              axios.get("/files").then((res) => {
               for (let key = 0; key < img.length; key++) {
                let found = false;

                for (let val = 0; val < res.data.length; val++) {
                 if (Number(res.data[val].filename) === img[key].lastModified) {
                  console.log("found image", img[key].lastModified);
                  found = true;
                  setQuestions((prev) => {
                   let dum = [...prev];
                   dum[2 * (questions.length / 3) + key].image = img[key].lastModified;
                   return dum;
                  });
                  prog = prog + 1;
                  setProgress((prev) => {
                   let dum = { ...prev };
                   dum.mat = prog;
                   return dum;
                  });
                  break;
                 }
                }
                if (!found) {
                 let formData = new FormData();

                 formData.append("file", img[key], img[key].lastModified);

                 axios.post("/upload", formData).then((res) => {
                  setQuestions((prev) => {
                   let dum = [...prev];
                   dum[2 * (questions.length / 3) + key].image = img[key].lastModified;
                   return dum;
                  });
                  prog = prog + 1;
                  setProgress((prev) => {
                   let dum = { ...prev };
                   dum.mat = prog;
                   return dum;
                  });
                 });
                }
               }
              });
             } else {
              for (let key = 0; key < img.length; key++) {
               let formData = new FormData();

               formData.append("file", img[key], img[key].lastModified);

               axios.post("/upload", formData).then((res) => {
                setQuestions((prev) => {
                 let dum = [...prev];
                 dum[2 * (questions.length / 3) + key].image = img[key].lastModified;
                 return dum;
                });
                prog = prog + 1;
                setProgress((prev) => {
                 let dum = { ...prev };
                 dum.mat = prog;
                 return dum;
                });
               });
              }
             }
            } else {
             alert(`please select exactly ${questions.length / 3} images`);
            }
           }}
          />
          <p style={{ display: "inline-block" }}>{progress.mat === 100 ? "uploading..." : `uploads: ${progress.mat}`} </p>
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
           let prog = 0;
           setProgress((prev) => {
            let dum = { ...prev };
            dum.phy = 100;
            return dum;
           });
           console.log(progress, check, prog);
           if (check) {
            axios.get("/files").then((res) => {
             for (let key = 0; key < img.length; key++) {
              let found = false;

              for (let val = 0; val < res.data.length; val++) {
               if (Number(res.data[val].filename) === img[key].lastModified) {
                console.log("found image", img[key].lastModified);
                found = true;
                setQuestions((prev) => {
                 let dum = [...prev];
                 dum[key].image = img[key].lastModified;
                 return dum;
                });
                prog = prog + 1;
                setProgress((prev) => {
                 let dum = { ...prev };
                 dum.phy = prog;
                 return dum;
                });
                break;
               }
              }
              if (!found) {
               let formData = new FormData();

               formData.append("file", img[key], img[key].lastModified);

               axios.post("/upload", formData).then((res) => {
                setQuestions((prev) => {
                 let dum = [...prev];
                 dum[key].image = img[key].lastModified;
                 return dum;
                });
                prog = prog + 1;
                setProgress((prev) => {
                 let dum = { ...prev };
                 dum.phy = prog;
                 return dum;
                });
               });
              }
             }
            });
           } else {
            for (let key = 0; key < img.length; key++) {
             let formData = new FormData();

             formData.append("file", img[key], img[key].lastModified);

             axios.post("/upload", formData).then((res) => {
              setQuestions((prev) => {
               let dum = [...prev];
               dum[key].image = img[key].lastModified;
               return dum;
              });
              prog = prog + 1;
              setProgress((prev) => {
               let dum = { ...prev };
               dum.phy = prog;
               return dum;
              });
             });
            }
           }
          } else {
           alert("please select exactly 45 images");
          }
         }}
        />

        <p style={{ display: "inline-block" }}>{progress.phy === 100 ? "uploading..." : `uploads: ${progress.phy}`} </p>

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
             let prog = 0;
             setProgress((prev) => {
              let dum = { ...prev };
              dum.che = 100;
              return dum;
             });
             console.log(progress, check, prog);
             if (check) {
              axios.get("/files").then((res) => {
               for (let key = 0; key < img.length; key++) {
                let found = false;

                for (let val = 0; val < res.data.length; val++) {
                 if (Number(res.data[val].filename) === img[key].lastModified) {
                  console.log("found image", img[key].lastModified);
                  found = true;
                  setQuestions((prev) => {
                   let dum = [...prev];
                   dum[45 + key].image = img[key].lastModified;
                   return dum;
                  });
                  prog = prog + 1;
                  setProgress((prev) => {
                   let dum = { ...prev };
                   dum.che = prog;
                   return dum;
                  });
                  break;
                 }
                }
                if (!found) {
                 let formData = new FormData();

                 formData.append("file", img[key], img[key].lastModified);

                 axios.post("/upload", formData).then((res) => {
                  setQuestions((prev) => {
                   let dum = [...prev];
                   dum[45 + key].image = img[key].lastModified;
                   return dum;
                  });
                  prog = prog + 1;
                  setProgress((prev) => {
                   let dum = { ...prev };
                   dum.che = prog;
                   return dum;
                  });
                 });
                }
               }
              });
             } else {
              for (let key = 0; key < img.length; key++) {
               let formData = new FormData();

               formData.append("file", img[key], img[key].lastModified);

               axios.post("/upload", formData).then((res) => {
                setQuestions((prev) => {
                 let dum = [...prev];
                 dum[45 + key].image = img[key].lastModified;
                 return dum;
                });
                prog = prog + 1;
                setProgress((prev) => {
                 let dum = { ...prev };
                 dum.che = prog;
                 return dum;
                });
               });
              }
             }
            } else {
             alert("please select exactly 45 images");
            }
           }}
          />

          <p style={{ display: "inline-block" }}>{progress.che === 100 ? "uploading..." : `uploads: ${progress.che}`} </p>
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
             let prog = 0;
             setProgress((prev) => {
              let dum = { ...prev };
              dum.mat = 100;
              return dum;
             });
             console.log(progress, check, prog);
             if (check) {
              axios.get("/files").then((res) => {
               for (let key = 0; key < img.length; key++) {
                let found = false;

                for (let val = 0; val < res.data.length; val++) {
                 if (Number(res.data[val].filename) === img[key].lastModified) {
                  console.log("found image", img[key].lastModified);
                  found = true;
                  setQuestions((prev) => {
                   let dum = [...prev];
                   dum[90 + key].image = img[key].lastModified;
                   return dum;
                  });
                  prog = prog + 1;
                  setProgress((prev) => {
                   let dum = { ...prev };
                   dum.mat = prog;
                   return dum;
                  });
                  break;
                 }
                }
                if (!found) {
                 let formData = new FormData();

                 formData.append("file", img[key], img[key].lastModified);

                 axios.post("/upload", formData).then((res) => {
                  setQuestions((prev) => {
                   let dum = [...prev];
                   dum[90 + key].image = img[key].lastModified;
                   return dum;
                  });
                  prog = prog + 1;
                  setProgress((prev) => {
                   let dum = { ...prev };
                   dum.mat = prog;
                   return dum;
                  });
                 });
                }
               }
              });
             } else {
              for (let key = 0; key < img.length; key++) {
               let formData = new FormData();

               formData.append("file", img[key], img[key].lastModified);

               axios.post("/upload", formData).then((res) => {
                setQuestions((prev) => {
                 let dum = [...prev];
                 dum[90 + key].image = img[key].lastModified;
                 return dum;
                });
                prog = prog + 1;
                setProgress((prev) => {
                 let dum = { ...prev };
                 dum.mat = prog;
                 return dum;
                });
               });
              }
             }
            } else {
             alert("please select exactly 90 images");
            }
           }}
          />
          <p style={{ display: "inline-block" }}>{progress.mat === 100 ? "uploading..." : `uploads: ${progress.mat}`} </p>
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
          .post("/exam/add/", { examname: examName, examtype: examType, questions: questions, time: examTime })
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
