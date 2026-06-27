import React from 'react'
import { useRef, useContext, useEffect, useCallback, useState } from "react";
import { WhiteboardContext } from '../context/WhiteboardContext';

const THROTTLE_MS = 10;

const Whiteboard = () => {

  const [editingText, setEditingText] = useState(null);

  const { activeTool, activeShape, activeColor, strokeWidth, registerEngine } = useContext(WhiteboardContext);



  const activeToolRef = useRef(activeTool);
  const activeColorRef = useRef(activeColor);
  const strokeWidthRef = useRef(strokeWidth);
  const shapeStartRef = useRef(null);
  const previewShapeRef = useRef(null);
  const activeToolRefLocal = useRef(activeTool); //  ref mirror for activeTool, needed inside mouse handlers

  useEffect(() => { activeToolRef.current = activeTool; }, [activeTool]);
  useEffect(() => { activeColorRef.current = activeColor; }, [activeColor]);
  useEffect(() => { strokeWidthRef.current = strokeWidth; }, [strokeWidth]);
  useEffect(() => { activeToolRefLocal.current = activeTool; }, [activeTool]); //  keep local tool ref in sync


  const undo = () => {
    if (historyStackRef.current.length === 0) return;
    const last = historyStackRef.current.pop();
    redoStackRef.current.push(last);
    redrawAll();
  }

  const redo = () => {
    if (redoStackRef.current.length === 0) return;
    const restored = redoStackRef.current.pop();
    historyStackRef.current.push(restored);
    redrawAll();
  }

  useEffect(() => {
    registerEngine({
      undo,
      redo,
      canUndo: () => historyStackRef.current.length > 0,
      canRedo: () => redoStackRef.current.length > 0,
    });
  }, []);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  //operation storage for undo and redo
  const historyStackRef = useRef([]);
  const redoStackRef = useRef([]);

  //live state management
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef(null);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const lastEmitTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      redrawAll();
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;

    return () => window.removeEventListener("resize", resize);

  }, []);


  //function for undo/redo/ first initialisation of the canvas- complete redraw through object array saved
  const redrawAll = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    historyStackRef.current.forEach((item) => {

      if (item.type === "stroke") {
        drawStroke(ctx, item);
      }

      else if (item.type === "text") {
        drawText(ctx, item);
      }

      else {
        drawShape(ctx, item);
      }
    });

  }, []);

  //single stroke drawing
  const drawStroke = (ctx, stroke) => {

    const {
      points,
      color,
      width,
      isEraser,
      opacity = 1
    } = stroke;

    if (points.length < 2) return;

    ctx.save();

    if (isEraser) {
      ctx.globalCompositeOperation =
        "destination-out";
    } else {
      ctx.globalCompositeOperation =
        "source-over";
    }

    ctx.globalAlpha = opacity;

    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(
      points[0].x,
      points[0].y
    );

    for (
      let i = 1;
      i < points.length - 1;
      i++
    ) {

      const midX =
        (points[i].x +
          points[i + 1].x) / 2;

      const midY =
        (points[i].y +
          points[i + 1].y) / 2;

      ctx.quadraticCurveTo(
        points[i].x,
        points[i].y,
        midX,
        midY
      );
    }

    const last =
      points[points.length - 1];

    ctx.lineTo(
      last.x,
      last.y
    );

    ctx.stroke();

    ctx.restore();
  };

  const drawRect = (ctx, shape) => {
    const x = Math.min(shape.start.x, shape.end.x);
    const y = Math.min(shape.start.y, shape.end.y);
    const width = Math.abs(shape.end.x - shape.start.x);
    const height = Math.abs(shape.end.y - shape.start.y);

    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;

    ctx.strokeRect(x, y, width, height);
  };

  const drawLineShape = (ctx, shape) => {
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;

    ctx.beginPath();
    ctx.moveTo(shape.start.x, shape.start.y);
    ctx.lineTo(shape.end.x, shape.end.y);
    ctx.stroke();
  };

  const drawCircle = (ctx, shape) => {
    const dx = shape.end.x - shape.start.x;
    const dy = shape.end.y - shape.start.y;

    const radius = Math.sqrt(dx * dx + dy * dy);

    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;

    ctx.beginPath();
    ctx.arc(
      shape.start.x,
      shape.start.y,
      radius,
      0,
      Math.PI * 2
    );

    ctx.stroke();
  };



  const drawTriangle = (ctx, shape) => {
    const start = shape.start;
    const end = shape.end;

    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;

    ctx.beginPath();

    ctx.moveTo(
      (start.x + end.x) / 2,
      start.y
    );

    ctx.lineTo(
      start.x,
      end.y
    );

    ctx.lineTo(
      end.x,
      end.y
    );

    ctx.closePath();
    ctx.stroke();
  };

  const drawShape = (ctx, shape) => {
    console.log("Drawing:", shape.type);
    switch (shape.type) {
      case "rect":
        drawRect(ctx, shape);
        break;

      case "circle":
        drawCircle(ctx, shape);
        break;

      case "triangle":
        drawTriangle(ctx, shape);
        break;

      case "line":
        drawLineShape(ctx, shape);
        break;

      default:
        break;
    }
  };
  const drawSegment = (
    ctx,
    from,
    to,
    color,
    width,
    isEraser = false,
    opacity = 1
  ) => {

    ctx.save();

    if (isEraser) {
      ctx.globalCompositeOperation =
        "destination-out";
    }

    ctx.globalAlpha = opacity;

    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    ctx.restore();
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  const drawText = (ctx, item) => {
    ctx.save();

    ctx.fillStyle = item.color;

    ctx.font = `${item.fontSize}px Arial`;

    ctx.fillText(
      item.text,
      item.x,
      item.y
    );

    ctx.restore();
  };


  //Mouse Handlers

  const handleMouseDown = (e) => {
    const point = getMousePos(e);

    if (
      activeToolRefLocal.current === "pen" ||
      activeToolRefLocal.current === "eraser" ||
      activeToolRefLocal.current === "highlighter"
    ) {
      isDrawingRef.current = true;
      lastPointRef.current = point;

      currentStrokeRef.current = {
        id: crypto.randomUUID(),
        type: "stroke",
        points: [point],

        color: activeColorRef.current,

        width:
          activeToolRefLocal.current === "highlighter"
            ? strokeWidthRef.current * 4
            : strokeWidthRef.current,

        isEraser:
          activeToolRefLocal.current === "eraser",

        opacity:
          activeToolRefLocal.current === "highlighter"
            ? 0.25
            : 1,

        isHighlighter:
          activeToolRefLocal.current === "highlighter",
      };
    }

    else if (activeToolRefLocal.current === "shape") {
      isDrawingRef.current = true;

      shapeStartRef.current = point;

      previewShapeRef.current = {
        id: crypto.randomUUID(),
        type: activeShape,
        start: point,
        end: point,
        color: activeColorRef.current,
        width: strokeWidthRef.current,
      };
    }
  };


  const handleMouseMove = (e) => {
    if (!isDrawingRef.current) return;

    const now = performance.now();

    if (now - lastEmitTimeRef.current < THROTTLE_MS) return;

    lastEmitTimeRef.current = now;

    const point = getMousePos(e);
    const ctx = ctxRef.current;

    if (activeToolRefLocal.current === "shape") {
      previewShapeRef.current.end = point;

      redrawAll();

      drawShape(
        ctx,
        previewShapeRef.current
      );

      return;
    }

    const previousPoint = lastPointRef.current;

    drawSegment(
      ctx,
      previousPoint,
      point,
      currentStrokeRef.current.color,
      currentStrokeRef.current.width,
      currentStrokeRef.current.isEraser,
      currentStrokeRef.current.opacity
    );

    currentStrokeRef.current.points.push(point);

    lastPointRef.current = point;
  };


  const handleMouseUp = () => {
    if (!isDrawingRef.current) return;

    isDrawingRef.current = false;

    if (
      (activeToolRefLocal.current === "pen" ||
        activeToolRefLocal.current === "eraser" ||
        activeToolRefLocal.current === "highlighter") &&
      currentStrokeRef.current &&
      currentStrokeRef.current.points.length > 1
    ) {
      historyStackRef.current.push(
        currentStrokeRef.current
      );

      redoStackRef.current = [];

      redrawAll();

      currentStrokeRef.current = null;
    }

    if (
      activeToolRefLocal.current === "shape" &&
      previewShapeRef.current
    ) {
      historyStackRef.current.push(
        previewShapeRef.current
      );

      redoStackRef.current = [];

      previewShapeRef.current = null;

      redrawAll();
    }
  };

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
