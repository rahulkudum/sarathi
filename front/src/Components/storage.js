import React, { createContext, useState } from "react";
import { useLocal } from "./hooks";

export const UserName = createContext();
export const Questions = createContext();
export const Time = createContext();
export const Time2 = createContext();
export const Time3 = createContext();

export const Answers = createContext();
export const Answers2 = createContext();
export const ExamName = createContext();
export const ExamType = createContext();
export const ExamName2 = createContext();
export const ExamType2 = createContext();
export const ExamTime = createContext();
export const Modify = createContext();
export const Marks = createContext();
export const Ctime = createContext();
export const Mode = createContext();
export const Switches = createContext();

export function TotalStorage({ children }) {
 const [name, setName] = useLocal("mail", "");
 const [questions, setQuestions] = useLocal("questions", []);
 const [answers, setAnswers] = useLocal("answers", []);
 const [answers2, setAnswers2] = useLocal("answers2", []);
 const [examName, setExamName] = useLocal("examname", "");
 const [examType, setExamType] = useLocal("examtype", "");
 const [examName2, setExamName2] = useLocal("examname2", "");
 const [examType2, setExamType2] = useLocal("examtype2", "");
 const [modify, setModify] = useState(false);
 const [time, setTime] = useLocal("time", null);
 const [time2, setTime2] = useLocal("time2", null);
 const [time3, setTime3] = useLocal("time3", { time: 0 });
 const [examTime, setExamTime] = useLocal("examTime", "defined");

 const [marks, setMarks] = useLocal("marks", { total: 0, positive: -1, negative: 0 });
 const [ctime, setCtime] = useLocal("ctime", []);
 const [mode, setMode] = useLocal("mode", "");
 const [switches, setSwitches] = useLocal("switches", 0);

 return (
  <UserName.Provider value={[name, setName]}>
   <Questions.Provider value={[questions, setQuestions]}>
    <Answers.Provider value={[answers, setAnswers]}>
     <Answers2.Provider value={[answers2, setAnswers2]}>
      <ExamName.Provider value={[examName, setExamName]}>
       <ExamType.Provider value={[examType, setExamType]}>
        <ExamName2.Provider value={[examName2, setExamName2]}>
         <ExamType2.Provider value={[examType2, setExamType2]}>
          <Modify.Provider value={[modify, setModify]}>
           <Time.Provider value={[time, setTime]}>
            <Time2.Provider value={[time2, setTime2]}>
             <Time3.Provider value={[time3, setTime3]}>
              <ExamTime.Provider value={[examTime, setExamTime]}>
               <Marks.Provider value={[marks, setMarks]}>
                <Ctime.Provider value={[ctime, setCtime]}>
                 <Mode.Provider value={[mode, setMode]}>
                  <Switches.Provider value={[switches, setSwitches]}>{children}</Switches.Provider>
                 </Mode.Provider>
                </Ctime.Provider>
               </Marks.Provider>
              </ExamTime.Provider>
             </Time3.Provider>
            </Time2.Provider>
           </Time.Provider>
          </Modify.Provider>
         </ExamType2.Provider>
        </ExamName2.Provider>
       </ExamType.Provider>
      </ExamName.Provider>
     </Answers2.Provider>
    </Answers.Provider>
   </Questions.Provider>
  </UserName.Provider>
 );
}
