import React, { useEffect } from 'react'
import { useState, useContext, useRef} from "react";
import { RoomContext } from '../context/RoomContext';
import { LogOut, MessageCircle, X, Send } from "lucide-react";
import { ThemeContext } from '../context/ThemeContext';
import { useSocket } from '../context/Socket';
import { useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import conf from "../conf/conf";

import axios from "axios";

const EMOJIS = ["👍", "❤️", "😂", "😮", "🔥", "🎉", "👏", "💡", "✅", "🚀"];
 
let reactionIdCounter = 0;

const SessionStatus = () => {

  const navigate= useNavigate();
  const socket = useSocket();

  const {theme} = useContext(ThemeContext);
  const {roomId} = useContext(RoomContext);

  const [CURRENT_USER, setCURRENT_USER] = useState(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [emojiCurrent, setEmojiCurrent]  = useState(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const [loading, setLoading] = useState(true);

  //get logged in user
  useEffect(()=>{
    fetch(`${conf.path}/user/me`, {credentials: 'include'})
    .then((res) => res.json())
    .then((data)=> setCURRENT_USER(data.user || data))
    .catch((err)=> console.error("Failed to fetch current user:", err))
    
  },[]);

  //load chat history
  useEffect(()=>{
    if(!roomId) return;

    setLoading(true);
    fetch(`${conf.path}/api/rooms/${roomId}/chats`, {credentials: 'include'})
    .then((res) => res.json())
    .then((data) => {
      setMessages(data);
      setLoading(false);
    })
    .catch((err)=>{
      console.error("failed to load  chat history:", err);
      setLoading(false);
    })
  }, [roomId])

  //listen for live messages
  useEffect(()=>{
    if(!socket || !roomId) return;

    const handleNewMessage = (msg) => {
      setMessages((prev)=>[...prev, msg]);
    };

    socket.on('newMessage', handleNewMessage);
    return ()=>{
      socket.off('newMessage', handleNewMessage);
    }
  }, [socket, roomId]);

  useEffect(() => {
    if (chatOpen) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !CURRENT_USER) return;

    socket.emit('sendMessage', {
      roomId,
      userId: CURRENT_USER._id,
      userName: CURRENT_USER.userName,
      content: input.trim(),
    });
    setInput("");
  };

  const FormatTime = (dateString) => 
    new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const LaunchReaction =useCallback( (data) => {
    const {emoji, user} = data;
    const id= ++reactionIdCounter;
    const left= 30+ Math.floor(Math.random()*40);
    setReactions((prev) => [...prev, { id, emoji, name: user.userName, left }]);
    setTimeout(() =>{
      setReactions((prev)=> prev.filter((r)=> r.id !== id));
    }, 2800);
    setEmojiOpen(false);
    
  },[]);
  useEffect(() => {

    if(emojiCurrent) {
      
      socket.emit('emojisend', {emoji:emojiCurrent});
    }
      
  

    
    }

  ,[emojiCurrent])
  useEffect(() => {

    
      socket.on("emojireceived", LaunchReaction);
       
     return () => {
      socket.off("emojireceived", LaunchReaction);
     }
  

    
    }

  ,[socket,LaunchReaction])

  const glassStyle = {
    ...theme.glass
  };

  const handleLeaveRoom = async()=>{

    try{
      const res = await axios.get(`${conf.path}/room/leaveRoom`,
        {
        withCredentials: true,
      })

      if(res.data.success){
        navigate('/Welcome')
      }

    }catch(error){
      console.log(error);

    }
  }

  return (
    <>
      {reactions.map((r)=>(
        <div 
          key={r.id}
          className="fixed z-50 flex flex-col items-center pointer-events-none"
          style={{
            left: `${r.left}%`,
            bottom: "90px",
            animation: "riseUp 2.8s ease-out forwards",
          }}>
            <span className="text-3xl leading-none">{r.emoji}</span>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full mt-1"
            style={{ background: "rgba(168,85,247,0.25)", color: "#c084fc" }}
          >
            {r.name}
          </span> 
          </div>
      ))}

      {/* chat box */}

      <div 
      className={`fixed right-40 ounded-2xl border ${theme.border} flex flex-col overflow-hidden z-40`}
        style={{
          ...glassStyle,
          bottom: "84px",
          width: "300px",
          maxHeight: chatOpen ? "380px" : "0px",
          opacity: chatOpen ? 1 : 0,
          transform: chatOpen ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
          transformOrigin: "bottom right",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease, transform 0.25s ease",
          pointerEvents: chatOpen ? "auto" : "none",
        }}>

          {/* Chat Header */}
          <div className={`flex items-center justify-between px-4 py-3 border-b ${theme.border}`}>
          <div className="flex items-center gap-2">
            <MessageCircle size={14} className={`${theme.accent}`} />
            <span className={`${theme.textPrimary} text-xs font-semibold`}>Chat</span>
          </div>
          <button onClick={() => setChatOpen(false)} className={`${theme.textMuted} ${theme.whiteHover} transition-colors`}>
            <X size={14} />
          </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3" style={{ minHeight: 0 }}>

            {loading && (
              <div className="text-center text-gray-400 text-sm mt-5">
                Loading Messages...
              </div>
            )}
            {!loading && messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm mt-5">
                No messages yet. Start conversation 👋
              </div>
            )}

            {!loading && CURRENT_USER && messages.map((msg)=>{
              const isMe = String(msg.user) === String(CURRENT_USER._id);
              return(
                <div key={msg._id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  {!isMe && (
                    <span className={`${theme.accent} text-[10px] font-medium mb-0.5 px-1`}>
                      {isMe ? 'You' : msg.userName}
                    </span>
                  )}
                  <div
                  className={`px-3 py-2 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                    isMe
                      ? `${theme.memessageBg} ${theme.textPrimary} rounded-br-sm`
                      : ` ${theme.textPrimary} rounded-bl-sm`
                  }`}
                  style={isMe ? {} : { background: `${theme.messageBg}` }}
                >
                  {msg.content}
                </div>
                <span className="text-slate-600 text-[10px] mt-0.5 px-1">{FormatTime(msg.sentAt)}</span>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div>
            <form
             onSubmit={sendMessage}
             className={`px-3 py-3 border-t ${theme.border} flex items-center gap-2`}>
              <input
              type="text"
              className={`flex-1 ${theme.away} rounded-xl px-3 py-2 text-xs ${theme.textPrimary} placeholder-slate-500 outline-none border ${theme.border} focus:border-purple-500/50 transition-colors`}
              placeholder="Type a message..."
              value={input}
              maxLength={1000}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}/>
              <button
               type="submit"
               disabled={!input.trim()}
               className={`w-8 h-8 rounded-xl ${theme.iconBg} hover:bg-purple-400 flex items-center justify-center transition-colors flex-shrink-0`}
              >
                <Send size={13} className={`${theme.textPrimary}`} />
              </button>
            </form>
          </div>
      </div>

      <div
        className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-3 py-2.5 rounded-2xl ${theme.divider} flex items-center gap-1 z-40`}
        style={{
          ...glassStyle,
          maxHeight: emojiOpen ? "80px" : "0px",
          opacity: emojiOpen ? 1 : 0,
          transform: emojiOpen ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)",
          transformOrigin: "bottom center",
          transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease, transform 0.2s ease",
          pointerEvents: emojiOpen ? "auto" : "none",
          overflow: "hidden",
        }}>
          { EMOJIS.map((emoji) => (
            <button
             key={emoji}
             onClick={(e) =>setEmojiCurrent(emoji)}
             className={`text-xl w-9 h-9 rounded-xl flex items-center justify-center ${theme.hoverEmoji} transition-all duration-150 hover:scale-125`}
             >
              {emoji}
             </button>
          ))}
      </div>

      {/* Bottom card */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div
          className={`flex items-center gap-1 px-2 py-2 rounded-2xl ${theme.divider}`}
          style={glassStyle}
        >
          {/* End Session */}
          <div className="relative group">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${theme.leaveBtn} hover:bg-red-500/25 hover:border-red-500/40 hover:text-red-300 transition-all duration-200`}
              onClick={handleLeaveRoom}
              >
                <LogOut size={15} strokeWidth={1.8} />
                <span className="text-xs font-medium">Leave</span>
              </button>
              <div className={`absolute bottom-full mb-5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md ${theme.border} ${theme.divider} text-xs text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl`}
              style={{background:theme.tooltipBg}}>
                Leave Session 
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a2e]" />
              </div>
          </div>

          <div className={`w-px h-7 ${theme.divider} mx-1 rounded-full`} />

          {/* Chat Button */}
          <div className="relative group">
            <button
            onClick={() => { setChatOpen(!chatOpen); setEmojiOpen(false); }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                chatOpen ? `${theme.activeBg} ${theme.textPrimary} shadow-lg shadow-purple-900/60` : `${theme.popupLabel} ${theme.hover}`
              }`}>
                <MessageCircle size={17} strokeWidth={1.8} />
            </button>
            <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-[#1a1a2e] border ${theme.border} text-xs text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl`}>
               Chat
               <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a2e]" />
            </div>
          </div>

          {/* Emoji open Button */}
          <div className="relative group">
            <button
             onClick={() => { setEmojiOpen(!emojiOpen); }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                emojiOpen ? "${theme.activeBg} ${theme.textPrimary} shadow-lg ${theme.activeShadow}" : `${theme.textSecondary} ${theme.whiteHover} ${theme.hoverEmoji}`
              }`}
            >
            😄
            </button>
            <div className={`absolute bottom-full mb-4 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md ${theme.border} ${theme.divider} text-xs text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl`}
            style={{
              background: theme.tooltipBg
            }}>
              React
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a2e]" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes riseUp {
          0%   { transform: translateY(0px);   opacity: 1; }
          70%  { transform: translateY(-180px); opacity: 1; }
          100% { transform: translateY(-220px); opacity: 0; }
        }
      `}</style>

    </>
  );
}

export default SessionStatus
