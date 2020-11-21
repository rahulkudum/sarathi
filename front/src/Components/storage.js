import React, { createContext, useState } from "react";



export const UserName=createContext();


export  function TotalStorage({children}){

const [name,setName]=useState("");

return(


    
        <UserName.Provider value={[name,setName]}>
            {children}
        </UserName.Provider>
   
);


}

