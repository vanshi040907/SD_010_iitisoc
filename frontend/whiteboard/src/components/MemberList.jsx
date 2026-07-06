import React from 'react'
import { useState, useContext } from "react";
import { Users, ChevronDown, Circle, TheaterIcon } from "lucide-react";
import { ThemeContext } from '../context/ThemeContext';
import { useEffect } from 'react';
import { useSocket } from '../context/Socket';
import axios from 'axios';
import conf from '../conf/conf';
import { useNavigate } from "react-router-dom";

// Right now i have taken a random array for the members. later we will fetch these details from the Database.



const Avatar = ({member, size = "md"}) => {

  const navigate = useNavigate();

  const {theme, isDark} = useContext(ThemeContext);
  const dim = member.role === "Host" ? "w-12 h-12 text-2xl" : "w-9 h-9 text-m";
  return(
    <div
      className={`${dim} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 ring-2 ${theme.ringColor}`}
      style={{ background: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0') }}
    >
      {member.name[0]}
    </div>
  );
}


const MemberList = () => {
  const socket = useSocket();
  const [MEMBERS, setMEMBERS] = useState([]);
  
  useEffect(() => {
    const fetchMember = async () => {
    try {
      const res = await axios.get(
        `${conf.path}/room/getmember`,

        {
          withCredentials: true,
        },
      );
      const list = res.data;
      const host = list.owner;
      const participants = list.mem;
      setMEMBERS(  [{ id: 1, name:host , role: "Host", online: true },
        ...participants.slice(1).map((x,index) => ( {
          id: index+2, name:x , role: "Editor", online: true
        }))
      ]
      )
      
      
      
        
    } catch (error) {
      console.log(error);
    }
  }; 
  fetchMember();
},[])
useEffect (() => {
    const handlesocket = (data) => {
      const name = data;
       
       setMEMBERS((prev) =>[ ...prev,{ id:prev.length+1, name:name , role: "Editor", online: true }])
      
    }
     
    socket.on("new user",handlesocket)

      return () => {
        socket.off("new user",handlesocket);
      }

    
  },[socket,])



  const [open, setOpen] = useState(false);
  const onlineCount = MEMBERS.filter((m) => m.online).length;
  const {theme} = useContext(ThemeContext);

  const logout = async(e)=>{
    try{
      await axios.get(`${conf.path}/user/logout`,
        {
          withCredentials:true
        }
      ) 
      navigate("/login");


    }catch(error){
      console.log(error);
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      <button
       onClick={()=> setOpen(!open)}
       className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border ${theme.border} transition-all duration-200 hover:border-purple-500/40`}
        style={{
          ...theme.glass
        }}
        >
          {/* here i writing the logic for stacking of the initials  */}
          <div className="flex items-center">
            {MEMBERS.slice(0, 3).map((m, i) => (
              <div key={m.id} className={`w-10 h-10 rounded-full flex items-center justify-center text-l font-semibold text-white ring-2 ${theme.ringColor} flex-shrink-0`}
              style={{ background:"#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'), marginLeft: i === 0 ? 0 : "-8px", zIndex: 3 - i }}
              >
                {m.name[0]}
              </div>
            ))}
             {/* For Extra members */}
            {MEMBERS.length > 3 && (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold text-slate-300 ring-2 ${theme.ringColor} flex-shrink-0`}
              style={{ background: "rgba(73, 72, 73, 0.67)", marginLeft: "-8px" }}
            >
              +{MEMBERS.length - 3}
            </div>
          )}
          </div>

          <div className="h-14 flex flex-col justify-center items-start leading-tight">
          <span className={`${theme.textPrimary} text-m font-semibold`}>{MEMBERS.length} Members</span>
          <span className={`${theme.accent} text-[12px]`}>{onlineCount} online</span>
         </div>

         <ChevronDown
          size={14}
          className={`${theme.textSecondary}transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
        </button>

        <div
        className={`mt-2 w-69.5 rounded-xl border ${theme.border} overflow-hidden`}
        style={{
          ...theme.glass,
          // animate open/close
          maxHeight: open ? "400px" : "0px",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scaleY(1)" : "translateY(-8px) scaleY(0.95)",
          transformOrigin: "top right",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease, transform 0.25s ease",
          pointerEvents: open ? "auto" : "none",
        }}
        >
          <div className={`flex items-center gap-2 px-4 py-3 border-b ${theme.border}`}>
           <Users size={13} className={`${theme.accent}`} />
           <span className={`${theme.textPrimary} text-xs font-semibold uppercase tracking-wider`}>VIEWERS</span>
          </div>

          <div className="flex flex-col py-1.5">
            {MEMBERS.map((m)=>(
              <div
               key={m.id}
               className={`flex items-center gap-3 px-4 py-2.5 ${theme.memberHover} transition-colors duration-150 cursor-default`}
               >
                <div className="relative">
                   <Avatar member={m} />
                   <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ${theme.ringColor} ${m.online ? "bg-green-400" : "bg-slate-600"}`}
                  />
                </div>
                
                <div className="flex flex-col leading-tight flex-1 min-w-0">
                  <span className={`${theme.textPrimary} text-sm font-medium truncate`}>{m.name}</span>
                <span className={`${theme.textMuted} text-xs`}>{m.role}</span>
                </div>

                <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  m.online
                    ? `${theme.onlinePill}`
                    : `${theme.awayPill}`
                }`}
              >
                {m.online ? "Online" : "Away"}
              </span>
              </div>
            ))}
          </div>

          <div className={`px-4 py-2.5 border-t ${theme.border} flex items-center gap-1.5`}>
           <Circle size={7} className="text-green-400 fill-green-400" />
           <span className={`${theme.textMuted} text-xs`}>{onlineCount} of {MEMBERS.length} currently active</span>
          </div>
        </div>
       
    </div>
  );
}

export default MemberList
