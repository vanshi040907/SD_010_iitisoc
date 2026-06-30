import { createContext, useContext, useRef, useState, useCallback } from "react";

export const RoomContext = createContext();

export function RoomProvider({children}){
    const [roomId, setRoomId] = useState("");
    const [roomName, setRoomName] = useState("");

    return (
        <RoomContext.Provider value={{roomId, setRoomId, roomName, setRoomName}}>
            {children}
        </RoomContext.Provider>
    )
}