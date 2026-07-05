import React from 'react'
import { useRef, useEffect, useCallback, useContext } from "react";
import { WhiteboardContext } from "../context/WhiteboardContext";

const TRAIL_LENGTH    = 100;    // how many trail points to keep
const TRAIL_DECAY_MS  = 1000;    // ms between each fade-out frame
const DOT_RADIUS      = 6;     // radius of the laser dot in px
const TRAIL_WIDTH_MAX = 4;     // widest part of the trail (at the dot end)
const LASER_COLOR     = "rgba(239, 68, 68,";  // red-500 base (opacity appended)
const GLOW_COLOR      = "rgba(239, 68, 68,";  // same, used for glow

const LaserWhiteboard = () => {

const { activeTool } = useContext(WhiteboardContext);
 
  const laserRef      = useRef(null);
  const isActiveRef   = useRef(false);
  const pointsRef     = useRef([]);       // { x, y, t } trail points
  const animRafRef    = useRef(null);
  const fadeRafRef    = useRef(null);
  const lastEmitRef   = useRef(0);
 
  // ── Resize to match window ──────────────────────────────────────────
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
 
  // ── Core render: draw the dot + fading trail ──
  const render = useCallback(() => {
    const canvas = laserRef.current;
    const ctx    = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
 
    const pts = pointsRef.current;
    if (pts.length === 0) return;
 
    const now  = Date.now();
    const last = pts[pts.length - 1];
 
    // ── Trail (older points → newest) ──
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
 
      // position within trail: 0 = oldest, 1 = newest
      const t          = i / pts.length;
      const opacity    = t * 0.6;                 // fade toward tail
      const lineWidth  = t * TRAIL_WIDTH_MAX;     // narrow toward tail
 
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.strokeStyle = `${LASER_COLOR}${opacity.toFixed(2)})`;
      ctx.lineWidth   = lineWidth;
      ctx.lineCap     = "round";
      ctx.stroke();
    }
 
    // ── Glowing dot at the tip ──────────────────────────────────────
    // Outer glow
    const glow = ctx.createRadialGradient(last.x, last.y, 0, last.x, last.y, DOT_RADIUS * 3);
    glow.addColorStop(0,   `${GLOW_COLOR}0.5)`);
    glow.addColorStop(1,   `${GLOW_COLOR}0)`);
    ctx.beginPath();
    ctx.arc(last.x, last.y, DOT_RADIUS * 3, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
 
    // Inner solid dot
    ctx.beginPath();
    ctx.arc(last.x, last.y, DOT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = `${LASER_COLOR}1)`;
    ctx.fill();
 
    // Tiny white centre highlight — makes it look like a real laser
    ctx.beginPath();
    ctx.arc(last.x - 1.5, last.y - 1.5, DOT_RADIUS * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fill();
  }, []);
 
  // ── Fade out trail after mouse stops ────────────────────────────────
  const startFadeOut = useCallback(() => {
    cancelAnimationFrame(fadeRafRef.current);
 
    const fade = () => {
      if (pointsRef.current.length === 0) return;
      // Drop the oldest point each frame → trail shrinks from the tail
      pointsRef.current = pointsRef.current.slice(1);
      render();
      if (pointsRef.current.length > 0) {
        fadeRafRef.current = setTimeout(fade, TRAIL_DECAY_MS);
      }
    };
 
    fadeRafRef.current = setTimeout(fade, TRAIL_DECAY_MS);
  }, [render]);
 
  // ── Mouse handlers ───────────────────────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    if (activeTool !== "laser") return;
 
    cancelAnimationFrame(fadeRafRef.current); // stop fade while mouse is moving
 
    const now  = performance.now();
    if (now - lastEmitRef.current < 10) return; // 10ms throttle
    lastEmitRef.current = now;
 
    const canvas = laserRef.current;
    const rect   = canvas.getBoundingClientRect();
    const pt     = { x: e.clientX - rect.left, y: e.clientY - rect.top, t: Date.now() };
 
    pointsRef.current = [...pointsRef.current, pt].slice(-TRAIL_LENGTH);
 
    cancelAnimationFrame(animRafRef.current);
    animRafRef.current = requestAnimationFrame(render);
  }, [activeTool, render]);
 
  const handleMouseLeave = useCallback(() => {
    startFadeOut();
  }, [startFadeOut]);
 
  const handleMouseUp = useCallback(() => {
    startFadeOut();
  }, [startFadeOut]);
 
  // ── When tool changes away from laser, clear everything ─────────────
  useEffect(() => {
    if (activeTool !== "laser") {
      pointsRef.current = [];
      const canvas = laserRef.current;
      const ctx    = canvas?.getContext("2d");
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      cancelAnimationFrame(animRafRef.current);
      clearTimeout(fadeRafRef.current);
    }
  }, [activeTool]);
 
  // ── Whether overlay should capture mouse events ─────────────────────
  // pointer-events-none when not in laser mode so it doesn't block drawing
  const isLaser = activeTool === "laser";
 
  return (
    <canvas
      ref={laserRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      className="absolute inset-0 z-20"
      style={{
        pointerEvents: isLaser ? "auto" : "none",
        cursor: isLaser ? "none" : "default",
      }}
    />
  );
};

export default LaserWhiteboard
