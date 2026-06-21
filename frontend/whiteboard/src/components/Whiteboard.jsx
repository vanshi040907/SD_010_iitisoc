import React from 'react'
import { useRef, useEffect, useCallback } from "react";

const THROTTLE_MS = 10;

const Whiteboard = ({ activeTool = "pen", activeColor = "#a855f7", strokeWidth = 3 }) => {

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  //operation storage for undo and redo
  const historyStackRef = useRef([]);
  const redoStackRef = useRef([]);
   
  //live state management
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef(null);
  const lastPointRef = useRef({x: 0, y: 0 });
  const lastEmitTimeRef = useRef(0);

  useEffect(()=>{
    const canvas = canvasRef.current;
    const resize = () =>{
      canvas.width = window.innerWidth ;
      canvas.height = window.innerHeight;
      redrawAll();
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;

    return ()=>window.removeEventListener("resize", resize);

  }, []);


  //function for undo/redo/ first initialisation of the canvas- complete redraw through object array saved
  const redrawAll = useCallback(()=>{
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if(!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    historyStackRef.current.forEach((stroke) => drawStroke(ctx, stroke));
  }, []);

  //single stroke drawing
  const drawStroke = (ctx, stroke)=>{
    const {points, color, width} = stroke;
    if(points.length <2) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length - 1; i++) {
      // midpoint between current and next point = smooth curve control
      const midX = (points[i].x + points[i + 1].x) / 2;
      const midY = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
    }

    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();

  }

  const drawSegment = (ctx, from, to, color, width)=>{
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  const getMousePos = (e)=>{
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  //Mouse Handlers

  const handleMouseDown = (e)=> {
    if(activeTool !== "pen") return;

    const point = getMousePos(e);
    isDrawingRef.current = true;
    lastPointRef.current = point;

    currentStrokeRef.current = {
      id: crypto.randomUUID(),
      type: "stroke",
      points: [point],
      color: activeColor,
      width: strokeWidth,
    };
  }

  const handleMouseMove = (e)=>{
    if (!isDrawingRef.current) return;

    const now = performance.now;
    if(now-lastEmitTimeRef.current <THROTTLE_MS) return;
    lastEmitTimeRef.current = now;
    const point = getMousePos(e);
    const ctx = ctxRef.current;

    drawSegment(ctx, lastPointRef.current, point, activeColor, strokeWidth);

    currentStrokeRef.current.points.push(point);
    lastPointRef.current = point;
    
  }

  const handleMouseUp = ()=> {
    if(!isDrawingRef.current) return;
    isDrawingRef.current = false;
    
    if(currentStrokeRef.current && currentStrokeRef.current.points.length > 1){
      historyStackRef.current.push(currentStrokeRef.current);
      redoStackRef.current = []; 

      redrawAll();
    }
     currentStrokeRef.current = null
  }

  const undo = ()=>{
    if (historyStackRef.current.length === 0) return;
    const last = historyStackRef.current.pop();
    redoStackRef.current.push(last);
    redrawAll();
  }

  const redo = ()=>{
    if (redoStackRef.current.length === 0) return;
    const restored = redoStackRef.current.pop();
    historyStackRef.current.push(restored);
    redrawAll();
  }

  return (
     <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="absolute inset-0 touch-none "
    />
  );
}

export default Whiteboard
