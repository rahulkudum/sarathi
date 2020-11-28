import React, { createContext, useState } from "react";
import { useLocal } from "./hooks";



export const UserName=createContext();
export const Questions=createContext();
export const Time=createContext();
export const Time2=createContext();
export const Answers=createContext();
export const ExamName=createContext();
export const ExamType=createContext(); 
export const Modify =createContext();
export const Marks=createContext();


export  function TotalStorage({children}){

const [name,setName]=useLocal("mail","");
const [questions,setQuestions]=useLocal("questions",[]);
const [answers,setAnswers]=useLocal("answers",[]);
const [examName,setExamName]=useLocal("examname",""); 
const [examType,setExamType]=useLocal("examtype","");
const [modify,setModify]=useState(false);
const [time,setTime]=useLocal("time",null);
const [time2,setTime2]=useLocal("time2",null);
const [marks,setMarks]=useLocal("marks",{total:0,positive:-1,negative:0});


return(


    
        <UserName.Provider value={[name,setName]}>
        <Questions.Provider value={[questions,setQuestions]}>
        <Answers.Provider value={[answers,setAnswers]}>
        <ExamName.Provider value={[examName,setExamName]}>
        <ExamType.Provider value={[examType,setExamType]}>
        <Modify.Provider value={[modify,setModify]}>
        <Time.Provider value={[time,setTime]}>
        <Time2.Provider value={[time2,setTime2]}>
        <Marks.Provider value={[marks,setMarks]} >

            {children}
            </Marks.Provider>
            </Time2.Provider>
            </Time.Provider>
            </Modify.Provider>
            </ExamType.Provider>
            </ExamName.Provider>
            </Answers.Provider>
            </Questions.Provider>
        </UserName.Provider>
   
);


}

