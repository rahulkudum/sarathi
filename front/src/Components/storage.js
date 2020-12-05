import React, { createContext, useState } from "react";
import { useLocal } from "./hooks";



export const UserName=createContext();
export const Questions=createContext();
export const Time=createContext();
export const Time2=createContext();
export const Time3=createContext();

export const Answers=createContext();
export const ExamName=createContext();
export const ExamType=createContext(); 
export const Modify =createContext();
export const Marks=createContext();
export const Ctime=createContext();
export const Mode=createContext();
export const Switches=createContext();


export  function TotalStorage({children}){

const [name,setName]=useLocal("mail","");
const [questions,setQuestions]=useLocal("questions",[]);
const [answers,setAnswers]=useLocal("answers",[]);
const [examName,setExamName]=useLocal("examname",""); 
const [examType,setExamType]=useLocal("examtype","");
const [modify,setModify]=useState(false);
const [time,setTime]=useLocal("time",null);
const [time2,setTime2]=useLocal("time2",null);
const [time3,setTime3]=useLocal("time3",{time:0});

const [marks,setMarks]=useLocal("marks",{total:0,positive:-1,negative:0});
const [ctime,setCtime]=useLocal("ctime",[]);
const [mode,setMode]=useLocal("mode","");
const [switches,setSwitches]=useLocal("switches",0);

return(


    
        <UserName.Provider value={[name,setName]}>
        <Questions.Provider value={[questions,setQuestions]}>
        <Answers.Provider value={[answers,setAnswers]}>
        <ExamName.Provider value={[examName,setExamName]}>
        <ExamType.Provider value={[examType,setExamType]}>
        <Modify.Provider value={[modify,setModify]}>
        <Time.Provider value={[time,setTime]}>
        <Time2.Provider value={[time2,setTime2]}>
        <Time3.Provider value={[time3,setTime3]}>
       
        <Marks.Provider value={[marks,setMarks]} >
        <Ctime.Provider value={[ctime,setCtime]}>
        <Mode.Provider value={[mode,setMode]}>
        <Switches.Provider value={[switches,setSwitches]}>
            {children}
            </Switches.Provider>
            </Mode.Provider>
            </Ctime.Provider>
            </Marks.Provider>
           
            </Time3.Provider>
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

