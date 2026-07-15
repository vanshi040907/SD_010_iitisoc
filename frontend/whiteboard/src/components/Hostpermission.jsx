import React, { useContext } from 'react';
import { useState , useEffect} from "react";
import { WhiteboardContext } from '../context/WhiteboardContext';
import { ThemeContext } from '../context/ThemeContext';
import { RoomContext } from '../context/RoomContext';
import { useSocket } from '../context/Socket';
import conf from '../conf/conf';
import axios from 'axios';

const glassDark = {
  background: "rgba(15, 12, 30, 0.92)",
  backdropFilter: "blur(20px)",
  border: "rgba(255, 255, 255, 0.1)",
  boxShadow: "0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
};

const glassLight = {
  background: "rgba(255, 255, 255, 0.75)",
  backdropFilter: "blur(20px)",
  border: "rgba(168, 85, 247, 0.15)",
  boxShadow: "0 4px 24px rgba(168,85,247,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
};
function AlertPopup(){
    const socket = useSocket();
    const [access, setAccess] = useState("Editor");
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [permission, setPermission] = useState(false);
    const [user, setUser] = useState(null);
    const [roomid,setRoomid] = useState(null);
    useEffect(() => {
        const handlepermission = ({user,roomid}) => {
           setPermission(true);
           setName(user.userName);
           setEmail(user.email);
           setUser(user);
           setRoomid(roomid);

           
        }
    
        socket.on("userinfo",handlepermission)
          return () => {
            socket.off("userinfo",handlepermission);
          }
      },[socket]);

    
    const {isDark} = useContext(ThemeContext);
    

    const glass = isDark ? glassDark : glassLight;
    const {theme} = useContext(ThemeContext);

    const handleAllowance =async() => {
         try {
       await axios.post(
        `${conf.path}/room/allowed`,
        {
          access:access,
          roomid:roomid,
          user : user,
        },
        {
          withCredentials: true,
        })
        setPermission(false);

    } catch (err) {
      console.log(err);
    } 

    } 
     const handleDenial =async() => {
          try {
       await axios.post(
        `${conf.path}/room/deny`,{
            user:user,
        },
        {
          withCredentials: true,
        })
        setPermission(false)
    } catch (err) {
      console.log(err);
    } 


        
    } 

    

    return(
        permission && (
        <>
         
         <div
           className={`fixed z-60 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl border ${theme.border} overflow-hidden`}
           style={{ ...glass, zIndex: 60 }}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${theme.popupBorder}`}>
             <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center`}>
                  🔔
                </div>
                <div>
                    <p className={`${theme.textPrimary} text-sm font-semibold`}>Host permission required</p>
                    <p className={`${theme.textSecondary} text-xs`}>{name} wants to enter the meet</p>
                    <p className={`${theme.textSecondary} text-xs`}>{email}</p>
                </div>
             </div>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5">
                <div>
                    <label className={`${theme.popupLabel} text-xs font-medium uppercase tracking-wider mb-2 block`}>Editor access or Viewer access</label>
                    <div className="flex items-center gap-2">
                        <label className={`flex-1 flex items-center justify-center py-3 rounded-xl border ${theme.popupBorder} font-mono text-2xl font-bold tracking-[0.25em] ${theme.textPrimary}`}
                        style={{ background: "rgba(168,85,247,0.08)" }}>
                        
                            <input type="radio" name="access" value="Editor" checked={access==="Editor"} onChange={(e) => setAccess(e.target.value)}/>
                            Editor
                        </label>
                        <label className={`flex-1 flex items-center justify-center py-3 rounded-xl border ${theme.popupBorder} font-mono text-2xl font-bold tracking-[0.25em] ${theme.textPrimary}`}
                         style={{ background: "rgba(168,85,247,0.08)" }}>
                             <input type="radio" name="access" value="Viewer" checked={access==="Viewer"} onChange={(e) => setAccess(e.target.value)}/>
                            Viewer
                            
                        </label>
                    
                    </div>
                
                </div>

                <div className="flex items-center gap-3">
                  <div className={`flex-1 h-px ${theme.popupDiv}`} />
                  <span className="text-slate-600 text-xs">Approval</span>
                  <div className={`flex-1 h-px ${theme.popupDiv}`} />
                </div>

                <div>
                    <label className={`${theme.popupLabel} text-xs font-medium uppercase tracking-wider mb-2 block`}>Allow or Deny</label>
                    <div className="flex items-center gap-2">
                        <div className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border ${theme.popupBorder} min-w-0 ${theme.textPrimary}`}
                         style={{ background: "rgba(168,85,247,0.08)" }}>
                          <button onClick={handleAllowance} className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-200 flex-shrink-0 
                          ${theme.popupBorder} ${theme.textPrimary} ${theme.iconButtonHover} hover:${theme.copied}`} >
                            Allow
                          </button>
                          <button onClick={handleDenial} className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-200 flex-shrink-0 
                          ${theme.popupBorder} ${theme.textPrimary} ${theme.iconButtonHover} hover:${theme.copied}`} >
                            Deny
                          </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`px-6 py-4 border-t ${theme.popupBorder} flex items-center gap-2`}>
        
            </div>
         </div>
        </>
        )
    );
}
export default AlertPopup;
