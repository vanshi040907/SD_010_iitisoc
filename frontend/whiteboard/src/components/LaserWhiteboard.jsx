import React from 'react'
import { useRef, useEffect, useCallback, useContext } from "react";
import { WhiteboardContext } from "../context/WhiteboardContext";
import useInfinity from '../context/infinity';
import { LaserContext } from '../context/laser';
import { RoomContext } from '../context/RoomContext';
import { useSocket } from '../context/Socket';


const TRAIL_LENGTH    = 100;    // how many trail points to keep
const TRAIL_DECAY_MS  = 1000;    // ms between each fade-out frame
const DOT_RADIUS      = 6;     // radius of the laser dot in px
const TRAIL_WIDTH_MAX = 4;     // widest part of the trail (at the dot end)
const LASER_COLOR     = "rgba(239, 68, 68,";  // red-500 base (opacity appended)
const GLOW_COLOR      = "rgba(239, 68, 68,";  // same, used for glow

const NETWORK_EMIT_THROTTLE_MS = 30;   // separate, looser throttle just for socket emits
const REMOTE_IDLE_TIMEOUT_MS   = 1200; // if no new point from a remote user in this long, they need to fade them out anyway

const LaserWhiteboard = () => {

const { activeTool } = useContext(WhiteboardContext);
const { camera, setCamera, worldtoscreen, screentoworld, zoom, setZoom, cameraonzoom, isZoom, setIsZoom} = useInfinity();

  const { registerLaser} = useContext(LaserContext);
  const {roomId} = useContext(RoomContext);

  const laserRef      = useRef(null);
  const isActiveRef   = useRef(false);
  const pointsRef     = useRef([]);       // { x, y, t } trail points
  const animRafRef    = useRef(null);
  const fadeRafRef    = useRef(null);
  const lastEmitRef   = useRef(0);
  const lastNetworkEmitRef = useRef(0);

  const remoteLasersRef = useRef(new Map()); //Map<userId, { points: [{x,y,t}], fadeTimeoutId, idleTimeoutId }>

  const socket = useSocket();
 
  // Resize laser canvas to match window size

  useEffect(() => {
    const canvas = laserRef.current;
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  //shared trail + dot drawing helper(used for local and each remote user)

  const drawTrail = useCallback((ctx, pts)=>{
    if(pts.length === 0) return;
    const last = pts[pts.length-1];

    if(pts.length === 1){
      
    }
    else if(pts.length ===2){
      const t         = 1;
      const opacity   = t * 0.6;
      const lineWidth = t * TRAIL_WIDTH_MAX;

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      ctx.lineTo(pts[1].x, pts[1].y);
      ctx.strokeStyle = `${LASER_COLOR}${opacity.toFixed(2)})`;
      ctx.lineWidth   = lineWidth;
      ctx.lineCap     = "round";
      ctx.stroke();
    }
    else{
      for (let i = 1; i < pts.length-1; i++) {
      const curr = pts[i];
      const next = pts[i+1];
      const midX = (curr.x + next.x)/2;
      const midY = (curr.y + next.y)/2;

      const t         = i / pts.length;
      const opacity   = t * 0.6;
      const lineWidth = t * TRAIL_WIDTH_MAX;

      ctx.beginPath();
      const prevMidX = i===1 ? pts[0].x : (pts[i-1].x + curr.x) /2;
      const prevMidY = i===1 ? pts[0].y : (pts[i-1].y + curr.y) /2;

      ctx.moveTo(prevMidX, prevMidY);
      ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
      ctx.strokeStyle = `${LASER_COLOR}${opacity.toFixed(2)})`;
      ctx.lineWidth   = lineWidth;
      ctx.lineCap     = "round";
      ctx.stroke();
    }
    }

    const glow = ctx.createRadialGradient(last.x, last.y, 0, last.x, last.y, DOT_RADIUS * 3);
    glow.addColorStop(0, `${GLOW_COLOR}0.5)`);
    glow.addColorStop(1, `${GLOW_COLOR}0)`);
    ctx.beginPath();
    ctx.arc(last.x, last.y, DOT_RADIUS * 3, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(last.x, last.y, DOT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = `${LASER_COLOR}1)`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(last.x - 1.5, last.y - 1.5, DOT_RADIUS * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fill();

  }, [])
 
  // Core render: draw the dot + fading trail
  const render = useCallback(() => {
    const canvas = laserRef.current;
    const ctx    = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
 
    //local trail
    const localScreenPoints = pointsRef.current.map((point) => {
      const screen = worldtoscreen({ world: point, camera });
       console.log("camera", camera);
       console.log("zoom", zoom);
      return {x:screen.x, y:screen.y,  t:point.t};
    });
    
    drawTrail(ctx, localScreenPoints);
 
    //remote userstrail

    remoteLasersRef.current.forEach((entry)=>{
      const screenPts = entry.points.map((point)=>{
        const screen = worldtoscreen({ world: point, camera });
        return { x: screen.x, y: screen.y, t: point.t };
      });
      drawTrail(ctx, screenPts);
    });
  }, [camera, worldtoscreen, drawTrail]);
 
  //  Fade out trail after mouse stops LOCAL
  const startFadeOut = useCallback(() => {
    cancelAnimationFrame(fadeRafRef.current);
 
    const fade = () => {
      if (pointsRef.current.length === 0) return;
      // last point remove from the trail. trail shrinks from the tail
      pointsRef.current = pointsRef.current.slice(1);
      render();
      if (pointsRef.current.length > 0) {
        fadeRafRef.current = setTimeout(fade, TRAIL_DECAY_MS);
      }
    };
 
    fadeRafRef.current = setTimeout(fade, TRAIL_DECAY_MS);
  }, [render]);

  //remote users fade out (it will be same as local fade , per userId)

  const startRemoteFadeOut = useCallback((userId)=>{
    const entry = remoteLasersRef.current.get(userId);
    if (!entry) return;

    clearTimeout(entry.idleTimeoutId);
    clearTimeout(entry.fadeTimeoutId);

    const fade = ()=>{
      const current = remoteLasersRef.current.get(userId);
      if(!current || current.points.length === 0) {
        remoteLasersRef.current.delete(userId);
        cancelAnimationFrame(animRafRef.current);
        animRafRef.current = requestAnimationFrame(render);
        return;
      }

      current.points = current.points.slice(1);

      cancelAnimationFrame(animRafRef.current);
      animRafRef.current = requestAnimationFrame(render);

      if (current.points.length > 0) {
        current.fadeTimeoutId = setTimeout(fade, TRAIL_DECAY_MS);
      } else {
        remoteLasersRef.current.delete(userId);
        cancelAnimationFrame(animRafRef.current);
        animRafRef.current = requestAnimationFrame(render);
      }
    };

    entry.fadeTimeoutId = setTimeout(fade, TRAIL_DECAY_MS);
  }, [render]);


  // ── Mouse handlers (local)
  const laserMove = useCallback((e) => {
    if (activeTool !== "laser") return;
 
    cancelAnimationFrame(fadeRafRef.current); // stop fade while mouse is moving
 
    const now  = performance.now();
    if (now - lastEmitRef.current < 10) return; // 10ms throttle
    lastEmitRef.current = now;
 
    const canvas = laserRef.current;
    const rect   = canvas.getBoundingClientRect();
    const pt     = { x:  e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    
    const world =  screentoworld({screen:pt,camera})
    const worldpt = {
      x:world.x,
      y:world.y,
      t: Date.now(),
    }

    pointsRef.current = [...pointsRef.current, worldpt].slice(-TRAIL_LENGTH);
 
    cancelAnimationFrame(animRafRef.current);
    animRafRef.current = requestAnimationFrame(render);

    //broadcast external laser strokes to the room
    if(socket && roomId){
      const netNow = performance.now();
      if(netNow - lastNetworkEmitRef.current >= NETWORK_EMIT_THROTTLE_MS){
        lastNetworkEmitRef.current = netNow;
        socket.emit('laserMove', {roomID: roomId, x:world.x, y:world.y});
      }
    }
  }, [activeTool, render,camera,zoom,screentoworld, socket, roomId]);
 
  const laserLeave = useCallback(() => {
    startFadeOut();
    if( socket && roomId){
      socket.emit('laserEnd', {roomID:roomId});
    }
  }, [startFadeOut, socket, roomId]);
 
  const laserUp = useCallback(() => {
    startFadeOut();
    if (socket && roomId) {
        socket.emit("laserEnd", {
            roomID: roomId,
        });
    }
  }, [startFadeOut, socket, roomId]);

   useEffect(() => {
      registerLaser({
        laserLeave,
        laserMove,
        laserUp,       
      });
    },[laserLeave,laserMove,laserUp]);
 
    //listen for remote laser events
    useEffect(()=>{
      if(!socket) return;

      const handleRemoteMove = ({userId, x, y})=>{
        let entry = remoteLasersRef.current.get(userId);
        if(!entry){
          entry = {points:[], fadeTimeoutId: null, idleTimeoutId:null };
          remoteLasersRef.current.set(userId, entry);
        }

        //when a fresh point arrive cancel any in-progress fade for this user
        clearTimeout(entry.fadeTimeoutId);
        clearTimeout(entry.idleTimeoutId);

        entry.points = [...entry.points, { x, y, t: Date.now() }].slice(-TRAIL_LENGTH);

        //agar user further aur points nahi bhejta hai too automatically fade karne ke liye ye wale points
        entry.idleTimeoutId = setTimeout(()=> startRemoteFadeOut(userId), REMOTE_IDLE_TIMEOUT_MS);

        cancelAnimationFrame(animRafRef.current);
        animRafRef.current = requestAnimationFrame(render);
      };

      const handleRemoteEnd = ({userId}) => {
        const entry = remoteLasersRef.current.get(userId);
        if (!entry) return;
        clearTimeout(entry.idleTimeoutId);
        startRemoteFadeOut(userId);
      };

      socket.on('laserMoveReceived', handleRemoteMove);
      socket.on('laserEndReceived', handleRemoteEnd);

      return ()=>{
        socket.off('laserMoveReceived', handleRemoteMove);
        socket.off('laserEndReceived', handleRemoteEnd);

        //clean any remaining timeouts
        remoteLasersRef.current.forEach((entry) => {
          clearTimeout(entry.fadeTimeoutId);
          clearTimeout(entry.idleTimeoutId);
        });
        remoteLasersRef.current.clear();
      };
    }, [socket, render, startRemoteFadeOut]);

    // ── When tool changes away from laser, sirf apni local trail h clear karni hai saari and braodcasting walli trails nahi
  useEffect(() => {
    if (socket && roomId) {
            socket.emit("laserEnd", {
                roomID: roomId,
            });
        }

    if (activeTool !== "laser") {
      pointsRef.current = [];
      cancelAnimationFrame(animRafRef.current);
      clearTimeout(fadeRafRef.current);
      render();
    }
  }, [activeTool, render, socket, roomId]);

  useEffect(() => {
    if (activeTool === "laser") {
      pointsRef.current = [];
      render();
    }
  }, [activeTool, render]);

 
  // ── Whether overlay should capture mouse events 
  // pointer-events-none when not in laser mode so it doesn't block drawing
  const isLaser = activeTool === "laser";
  
  return (
    <canvas
      ref={laserRef}
      className="absolute inset-0 z-20"
      style={{
        pointerEvents:"none",
        cursor: isLaser ? "none" : "default",
      }}
    />
  );
};

export default LaserWhiteboard
