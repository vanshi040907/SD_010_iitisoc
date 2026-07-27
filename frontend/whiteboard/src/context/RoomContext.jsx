import { createContext, useContext, useRef, useState, useCallback } from "react";
import { useParams } from 'react-router-dom';


export const RoomContext = createContext(null);

export function RoomProvider({children}){
    const {roomID} = useParams();

    return (
        <RoomContext.Provider value={{roomId: roomID}}>
            {children}
        </RoomContext.Provider>
    )
}