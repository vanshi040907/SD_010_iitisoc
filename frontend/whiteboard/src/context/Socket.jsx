import React , {useMemo}from 'react'
import {io} from "socket.io-client";
import conf from "../conf/conf";
const SocketContext = React.createContext(null);

export const useSocket = () => {
    return React.useContext(SocketContext);
}

export const SocketProvider = (props) => {
    const socket = useMemo(
        () => 
            io(`${conf.path}`), 
            []
    );
    return (
        <SocketContext.Provider value ={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}


