import React, { useCallback, useRef } from 'react'
import { useState, useContext } from "react";
import { Users, ChevronDown, Circle, TheaterIcon, CornerDownLeft } from "lucide-react";
import {FaMicrophone,FaMicrophoneSlash} from 'react-icons/fa'
import { ThemeContext } from '../context/ThemeContext';
import { useEffect } from 'react';
import { useSocket } from '../context/Socket';


import axios from 'axios';
import conf from '../conf/conf';
import { useNavigate } from "react-router-dom";
import Logout from './Logout';
import freeice from 'freeice';


// Right now i have taken a random array for the members. later we will fetch these details from the Database.



const Avatar = ({member, size = "md"}) => {


  const {theme, isDark} = useContext(ThemeContext);
  const dim = member.role === "Host" ? "w-12 h-12 text-2xl" : "w-9 h-9 text-m";
  return(
    <div
      className={`${dim} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 ring-2 ${theme.ringColor}`}
      style={{ background: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0') }}
    >
      {member.name[0].toUpperCase()}
    </div>
  );
}

const AudioElement = ({ M, streams }) => {

  const audioRef = useRef(null);
console.log("streams audioelement",streams);
console.log("memid",M);
  useEffect(() => {
    const MID =  M.MemberId;
    if(MID){
      const target = streams.find(s => s.peerId === MID);
    console.log("target",target);
    if (target && target.stream.getAudioTracks()[0].enabled && audioRef.current) {
      audioRef.current.srcObject = target.stream;
      console.log("stream of:",MID);
    }
    if(target && !target.stream.getAudioTracks()[0].enabled && audioRef.current){
      console.log("muted");
       audioRef.current.srcObject = null;
    }
    }
    
  }, [streams, M]);

  

  return (
    <div>
      <audio autoPlay  ref={audioRef}></audio>
    </div>
  );
};

const MuteUnmute = ({id,munteunmute})=>{

const {theme} = useContext(ThemeContext);
console.log("munteunmute",munteunmute);

const [enabled ,setEnabled] = useState(true);
    useEffect(()=>{
      if(id){
        const audio = munteunmute.find(m => m.peerId === id);
        console.log("audio",audio);
        
        if(!audio) return;
        if(audio.stream.getAudioTracks()[0].enabled){
          setEnabled(true);
        }
        if(!audio.stream.getAudioTracks()[0].enabled){
          setEnabled(false);
        }
      }

    },[munteunmute,id]);
    return (
      <>
          <span
                className={`absolute bottom-0  right-0 w-4 h-5 rounded-full ${theme.bgcolor} flex items-center justify-center ring  ${theme.mutebtn}`}
                  >
                  { enabled ? <FaMicrophone size={16}/> : <FaMicrophoneSlash size={18}/>}
                   </span> 

    
    </>
  )
  }


const MemberList = () => {
 
   const navigate = useNavigate();
  const socket = useSocket();
  const [MEMBERS, setMEMBERS] = useState([]);
const [remoteStream , setRemoteStream] = useState([]);
const memberRef = useRef([]);
const peerConnection = useRef(new Map());
const peerConnectionA = useRef(new Map());
const dataChannels = useRef(new Map());//who creates answer
const mylocalStreamRef = useRef(null);
const streamPromiseRef = useRef(null);
const [ismute,setMute] = useState(false);
const [munteunmute , setMuteUnmute] = useState([]);
const [allStreams,setAllStreams] = useState([]);


  
  useEffect(() => {
    const fetchMember = async () => {
      streamPromiseRef.current = navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      mylocalStreamRef.current = stream;
      return stream;
    })
    .catch((err) => {
      console.log("mic error", err);
      return null;
    });

    

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
      const Memberid = list.MemId;
      setMEMBERS(  [{ id: 1, name:host,MemberId:Memberid  , role: "Host", online: true },
        ...participants.slice(1).map((x,index) => ( {
          id: index+2, name:x.name ,MemberId:x.MemberId , role: x.role, online: true
        }))
      ]
      )
      
      
      
        
    } catch (error) {
      console.log(error);
    }
  }; 
 
 fetchMember();
  return () => {
    mylocalStreamRef.current?.getTracks().forEach(t => t.stop());
    mylocalStreamRef.current = null;
  };

 
 
},[])

useEffect (() => {
    const handlesocket = (data) => {
      const {name,role,Memid} = data;
       
       setMEMBERS((prev) =>[ ...prev,{ id:prev.length+1,MemberId:Memid, name:name , role: role, online: true }])
      
    }

    const handleLeaveRoom = (data)=>{
      console.log(data);
      setMEMBERS((prev)=>prev.filter((m)=>m.name !== data.username));
  
    }
     
    socket.on("new user",handlesocket)
    socket.on("leave me!",handleLeaveRoom)


      return () => {
        socket.off("new user",handlesocket);
        socket.off("leave me!",handleLeaveRoom);
      }

    
  },[socket,])

  const [logoutOpen, setLogoutOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const onlineCount = MEMBERS.filter((m) => m.online).length;
  const {theme} = useContext(ThemeContext);

  const logout = async()=>{
    console.log("logout clicked!!");
    const isConfirmed = window.confirm("Do you really want to logout?");

    if (!isConfirmed) {
    return; 
  }


    try{
       const res = await axios.get(`${conf.path}/user/logout`,
        {
          withCredentials:true
        }

       
      ) 
       if(res.data.success){

        socket.emit("logout");
          navigate('/login')
        }
      


    }catch(error){
      console.log(error);
    }
  }

  useEffect(()=>{
    
    memberRef.current = MEMBERS;
    console.log("haiaiaiaiaia",remoteStream);
    
    if(!socket || memberRef.current.length <2) return;
    console.log("whts the problem");

    socket.emit("ready for offers",{remoteStream});
  },[MEMBERS])

  
  
   
useEffect(()=>{

const handleIceCandidate = async ({ candidate, from}) => {
  const pc = peerConnection.current.get(from) || peerConnectionA.current.get(from);
  console.log("pc- candidate",pc);
  if (pc && candidate) {
    await pc.addIceCandidate(candidate);

  }
};

  socket.on("ice-candidate", handleIceCandidate);
  return () => {
 socket.off("ice-candidate", handleIceCandidate);
  }
},[socket]);

  
  

   useEffect(()=>{
    console.log("[" + Date.now() + "] registering create offer listener");
    const handleCreateOffer = async({id,participants})=>{
      console.log("participants ", participants)
    console.log("id",id);
   const members = memberRef.current.filter((m)=> m.MemberId !== id);
   const n = members.length;
   console.log(members);
   console.log(n);
   for(let i=0;i<n;i++){
    const pc = new RTCPeerConnection({
       iceServers:freeice()
    })

     
    const stream = await streamPromiseRef.current;   // ⬅ blocks until mic is actually ready
     const participant= participants.find((p)=>p.user === id)
    
    console.log("tracks", stream.getTracks());
console.log("audio tracks", stream.getAudioTracks());
console.log("stream", stream);
if (stream) {
  stream.getTracks().forEach(track => pc.addTrack(track, stream));
}
const memid = members[i].MemberId;
setAllStreams((prev)=>[...prev.filter((m)=>m.peerId !== id),{peerId:id , stream:stream}]);
const enabled = participants[i].enabled ;
console.log("enabled",enabled);
    pc.ontrack =(e)=>{
      console.log("ontrack");
      const incommingstream = e.streams[0];
      incommingstream.getAudioTracks()[0].enabled = enabled;
      console.log("incommingstream",incommingstream);
      setRemoteStream((prev)=>[...prev.filter((m)=>m.peerId !== memid) , {peerId:memid , stream:incommingstream }]);
      
      setAllStreams((prev)=>[...prev.filter((m)=>m.peerId !== memid) , {peerId:memid , stream:incommingstream }])
      
     
      console.log("remotestream",remoteStream);
    }
   
  
   

  
    const dataChannel = pc.createDataChannel('mychannel');
    console.log("datachannel",dataChannel);
    dataChannels.current.set(memid,dataChannel);
    dataChannel.onopen = ()=> { 
      console.log("channel opened");
      dataChannel.send(`hi from offer ${id}`);}
    dataChannel.onmessage =(e) => console.log("message" + e.data);
    
  console.log("hhhhhhhhhhhiiiiiiiiiii");
     
    pc.onicecandidate = (event) => {
  if (event.candidate) {
    console.log("icecandidate");
    socket.emit("ice-candidate", { candidate: event.candidate, to: memid , from: id}); 
  }
    
   }

    const offer = await pc.createOffer();
    console.log("offer created",offer);
    const localdescription= await pc.setLocalDescription(offer);
    console.log(" from  B localdescription",offer)
    
    console.log(memid);
    peerConnection.current.set(memid , pc);
    socket.emit("accept this offer",{offer, memid,id,participants});
    console.log( "pc",pc)

    pc.onconnectionstatechange = () => console.log("pc connectionState:", pc.connectionState);
    pc.oniceconnectionstatechange = () => console.log("pc iceConnectionState:", pc.iceConnectionState);
   
     console.log("streams plsssssssss");
   
};



   };

    const handlecreateanswer = async ({ offer, memid, id ,participants}) => {
  const pcA = new RTCPeerConnection({ iceServers: freeice() });

  const stream = await streamPromiseRef.current;
  
console.log("stream", stream);
if (stream) {
  stream.getTracks().forEach(track => pcA.addTrack(track, stream));
}
console.log("tracks", stream.getTracks());
console.log("audio tracks", stream.getAudioTracks());
const Member = participants.find((p)=>p.user === id);
console.log("Member",Member);
 setAllStreams((prev)=>[...prev.filter((m)=>m.peerId !== memid),{peerId:memid , stream:stream}]); 
const enabled = Member.enabled;
    pcA.ontrack =(e)=>{
      console.log("ontrack");
      const incommingstream = e.streams[0];
      incommingstream.getAudioTracks()[0].enabled = enabled;
      setRemoteStream((prev)=>[
        ...prev.filter((s)=>s.peerId !== id) ,{ peerId:id , stream:incommingstream}
      ])
     
      setAllStreams((prev)=>[ ...prev.filter((s)=>s.peerId !== id) ,{ peerId:id , stream:incommingstream}]);
    }

  peerConnectionA.current.set(id,pcA);

  pcA.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("icecandidate");
      socket.emit("ice-candidate", { candidate: event.candidate, to: id,from: memid });
      // send back to the offer creator
    }
  };

  
  const rds= await pcA.setRemoteDescription(offer);
  console.log("from A remotedescription",offer);
  
  let dataChannel ;
  pcA.ondatachannel = async(e)=>{
    dataChannel = await e.channel;
    console.log("datachannel answer ",dataChannel);
    dataChannel.onopen = ()=>{ 
      console.log("channel opened");
      dataChannel.send(`hi from answer ${memid}`);} 
    dataChannel.onmessage =(e)=>console.log("message" ,e.data);
    
   
  }

  
  
 
  console.log("pcA",pcA);
  const answer = await pcA.createAnswer();
  const lds =  await pcA.setLocalDescription(answer);
  console.log("from A local description",answer);
  console.log("answer created", answer);
  socket.emit("accept answer", { answer, memid, id });

  //audio stream
  
  

  pcA.onconnectionstatechange = () => console.log("pc connectionState:", pcA.connectionState);
pcA.oniceconnectionstatechange = () => console.log("pc iceConnectionState:", pcA.iceConnectionState);
};

   const handleacceptAnswer = async({answer,memid})=>{
    const pc = peerConnection.current.get(memid);
    console.log("answer");
       const rds =await pc.setRemoteDescription(answer);
       console.log("from B remotedescription",answer);
      console.log("connected");
   };

   
    socket.on("create offer",handleCreateOffer);
    socket.on("accept this offer",handlecreateanswer);
    socket.on("accept answer",handleacceptAnswer);

     
    return ()=>{
      socket.off("create offer",handleCreateOffer);
      socket.off("accept this offer",handlecreateanswer);
      socket.off("accept answer",handleacceptAnswer);
    }
   },[socket]);
  
   
    
   

useEffect(()=>{
  const handleunmute = async ({ id }) => {
    
    console.log("handleunmute is working");
  setRemoteStream(prev =>{ 
     const stream = prev.map(r => {
      if(r.peerId === id){
        const audioTrack = r.stream.getAudioTracks()[0];
        audioTrack.enabled = true;
      }
    return r;}

      );
   
    console.log("updatedstream",stream);
    
   
    console.log("remotestream unmute",remoteStream);
    return stream;
  });
  setAllStreams(prev =>{ 
     const stream = prev.map(r => {
      if(r.peerId === id){
        const audioTrack = r.stream.getAudioTracks()[0];
        audioTrack.enabled = true;
      }
    return r;}

      );
   
    console.log("updatedstream",stream);
    
   
    console.log("remotestream unmute",remoteStream);
    return stream;
  });
  
  
};

const handlemute = async ({id})=>{
   console.log("heyyyyyyyyyy");
  setRemoteStream(prev =>{ 
     const stream = prev.map(r => {
      if(r.peerId === id){
        const audioTrack = r.stream.getAudioTracks()[0];
        audioTrack.enabled = false;
      }
    return r;}
      );
    console.log("updatedstream",stream);
    console.log("remotestream unmute",remoteStream);
    return stream;
  });
  setAllStreams(prev =>{ 
     const stream = prev.map(r => {
      if(r.peerId === id){
        const audioTrack = r.stream.getAudioTracks()[0];
        audioTrack.enabled = false;
      }
    return r;}
      );
    console.log("updatedstream",stream);
    console.log("remotestream unmute",remoteStream);
    return stream;
  })
}


socket.on("unmute",handleunmute);
socket.on("mute",handlemute);

return ()=>{
  socket.off("unmute",handleunmute);
  socket.off("mute",handlemute);
}

},[socket]);


const handleunmuteaudio= ()=>{
   console.log("unmute clicked!");
   setMute(false); 
 
  socket.emit("unmute",{enabled:true});
 
}

const handlemuteaudio = ()=>{
    console.log("mute clicked!");
  setMute(true); 
  
  socket.emit("mute",{enabled:false});

}
  

  return (
    <>
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      <div className='flex gap-5'>
        
        
        <button
       onClick={()=> setOpen(!open)}
       className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border ${theme.border} transition-all duration-200 hover:border-purple-500/40`}
        style={{
          ...theme.glass
        }}
        >
          {/* here i writing the logic for stacking of the initials  */}
          <div className="flex items-center">
           
            {MEMBERS.slice(0, 3).map((m,i) => (
              <div key={m.id} className={`w-10 h-10 rounded-full flex items-center justify-center text-l font-semibold text-white ring-2 ${theme.ringColor} flex-shrink-0`}
              style={{ background:"#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'), marginLeft: i === 0 ? 0 : "-8px", zIndex: 3 - i }}
              >
                {m.name[0].toUpperCase()}
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
       
        
         
        <button 
         onClick={()=> setLogoutOpen(!logoutOpen)}
         className={`h-18 w-18 border ${theme.border} rounded-full flex justify-center items-center ${theme.textPrimary} text-4xl`}
        style={{
          ...theme.glass,
        }}
        >
           V
        </button>
       
        {!ismute ? <button className={`${theme.muteme}`} onClick={handlemuteaudio} ><FaMicrophone size={24}/></button> 
        :<button className={`${theme.muteme}`}   onClick={handleunmuteaudio} ><FaMicrophoneSlash size={28}/> </button>}
       
      </div>
      

      <div className={`mt-2 w-69.5 rounded-2xl border ${theme.border}  z-400`}
        style={{
          ...theme.glass,
          maxHeight: logoutOpen ? "50px" : "0px",
          opacity: logoutOpen ? 1 : 0,
          transform: logoutOpen ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
          transformOrigin: "top right",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease, transform 0.25s ease",
          pointerEvents: logoutOpen ? "auto" : "none",
        }}>
          <Logout onCustomClick={logout} />
        </div>
        
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
                  <MuteUnmute id={m.MemberId} munteunmute={allStreams}/>
                </div>
                
                <AudioElement   M ={m} streams={remoteStream}/>
                
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
    <div>
      
    </div>
    
    </>
  );
}

export default MemberList
