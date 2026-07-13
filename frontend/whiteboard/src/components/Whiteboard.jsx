import React from 'react';
import { useRef, useContext, useEffect, useCallback, useState } from "react";
import { WhiteboardContext } from '../context/WhiteboardContext';
import conf from '../conf/conf';
import axios from 'axios';
import { useSocket } from '../context/Socket';
import useInfinity from '../context/infinity';
import { TOOL_CURSORS } from "../utils/cursor";

const THROTTLE_MS = 10;

const Whiteboard = () => {
  const socket = useSocket();

  // state for the floating text input box position, value, and id of item being edited
  const [textInput, setTextInput] = useState(null);
  const [add, setAdd] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const selectedIdRef = useRef(null);
  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);

  const { activeTool, activeShape, activeColor, strokeWidth, registerEngine, bump, setActiveShape, setActiveTool
  } = useContext(WhiteboardContext);
  const { camera, setCamera, worldtoscreen, screentoworld, zoom, setZoom, cameraonzoom, isZoom, setIsZoom, canvasRef } = useInfinity();
  const [isPanning, setIsPanning] = useState(true);
  const activeColorRef = useRef(activeColor);
  const strokeWidthRef = useRef(strokeWidth);
  const shapeStartRef = useRef(null);
  const previewShapeRef = useRef(null);
  const activeToolRefLocal = useRef(activeTool);
  const cameraRef = useRef(camera);
  const zoomRef = useRef(zoom); // ref mirror for activeTool, needed inside mouse handlers

  useEffect(() => { activeColorRef.current = activeColor; }, [activeColor]);
  useEffect(() => { strokeWidthRef.current = strokeWidth; }, [strokeWidth]);
  useEffect(() => { activeToolRefLocal.current = activeTool; }, [activeTool]);
  useEffect(() => { cameraRef.current = camera; }, [camera]);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]); // keep local tool ref in sync

  const isDraggingRef = useRef(false);
  const dragLastScreenRef = useRef({ x: 0, y: 0 });
  const dragLastWorldRef = useRef({ x: 0, y: 0 });

  const ctxRef = useRef(null);

  //operation storage for undo and redo
  const historyStackRef = useRef([]);
  const redoStackRef = useRef([]);

  //live state management
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef(null);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const lastEmitTimeRef = useRef(0);

  const getScreenBoundingBox = (item) => {
    if (item.type === "text") {
      const ctx = ctxRef.current;
      ctx.font = `${item.fontSize}px Arial`;
      const w = ctx.measureText(item.text).width;
      const h = item.fontSize;
      return { minX: item.x, minY: item.y - h, maxX: item.x + w, maxY: item.y };
    }

    if (item.type === "stroke") {
      const pts = item.points.map((p) => worldtoscreen({ world: p, camera }));
      const xs = pts.map((p) => p.x);
      const ys = pts.map((p) => p.y);
      return {
        minX: Math.min(...xs), maxX: Math.max(...xs),
        minY: Math.min(...ys), maxY: Math.max(...ys),
      };
    }

    // shapes: rect / circle / triangle / line all have start + end
    const start = worldtoscreen({ world: item.start, camera });
    const end = worldtoscreen({ world: item.end, camera });

    if (item.type === "circle") {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      return { minX: start.x - r, minY: start.y - r, maxX: start.x + r, maxY: start.y + r };
    }

    return {
      minX: Math.min(start.x, end.x), maxX: Math.max(start.x, end.x),
      minY: Math.min(start.y, end.y), maxY: Math.max(start.y, end.y),
    };
  };

  const hitTestScreen = (screenPoint) => {
    const padding = 8; // tolerance in px, makes thin strokes/lines easier to grab
    for (let i = historyStackRef.current.length - 1; i >= 0; i--) {
      const item = historyStackRef.current[i];
      const box = getScreenBoundingBox(item);
      if (
        screenPoint.x >= box.minX - padding &&
        screenPoint.x <= box.maxX + padding &&
        screenPoint.y >= box.minY - padding &&
        screenPoint.y <= box.maxY + padding
      ) {
        return item;
      }
    }
    return null;
  };

  // ref mirrors for color and font size needed inside text commit handler
  const activeColorRefText = useRef(activeColor);
  useEffect(() => { activeColorRefText.current = activeColor; }, [activeColor]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${conf.path}/whiteboard/getdata`,
          { withCredentials: true }
        );
        const whiteboard = res.data.data;
        const size = whiteboard.length;
        if (size > 0) {
          const historyflatted = whiteboard
            .map((item) => item.drawingOperations)
            .flat();
          historyStackRef.current = historyflatted; console.log(historyStackRef.current)
          redrawAll();
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const undo = async () => {
    if (historyStackRef.current.length === 0) return;
    const last = historyStackRef.current.pop();
    redoStackRef.current.push(last);
    try {
      await axios.get(
        ` ${conf.path}/whiteboard/undo`, {
        withCredentials: true,
      }
      );

      const { remainingHistory, remainingRedoHistory } = res.data;
      historyStackRef.current = remainingHistory;
      redoStackRef.current = remainingRedoHistory;
      bump();
    } catch (error) {
      console.log(error);
    }
    redrawAll();
    redraw();
  };

  const redo = async () => {
    if (redoStackRef.current.length === 0) return;
    const restored = redoStackRef.current.pop();
    historyStackRef.current.push(restored);
    try {
      await axios.post(
        `${conf.path}/whiteboard/redo`, {
        drawingOperations: restored,
      }, { withCredentials: true }
      );
      const { remainingHistory, remainingRedoHistory } = res.data;
      historyStackRef.current = remainingHistory;
      redoStackRef.current = remainingRedoHistory;
      bump();
    } catch (error) {
      console.log(error);
    }
    redrawAll();
    redraw();
  };

  const drawStroke = (ctx, stroke) => {
    const { points, color, width, isEraser, opacity = 1 } = stroke;
    const point = points.map((point) => {
      return worldtoscreen({ world: point, camera });
    });

    if (point.length < 2) return;

    ctx.save();
    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
    }

    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(point[0].x, point[0].y);

    for (let i = 1; i < point.length - 1; i++) {
      const midX = (point[i].x + point[i + 1].x) / 2;
      const midY = (point[i].y + point[i + 1].y) / 2;
      ctx.quadraticCurveTo(point[i].x, point[i].y, midX, midY);
    }

    const last = point[point.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
    ctx.restore();
  };

  const downloadCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");

    tempCtx.fillStyle = "#000000";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    historyStackRef.current.forEach((stroke) => drawStroke(tempCtx, stroke));

    const dataUrl = tempCanvas.toDataURL("image/jpeg", 0.95);

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `whiteboard-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  useEffect(() => {
    registerEngine({
      undo,
      redo,
      canUndo: () => historyStackRef.current.length > 0,
      canRedo: () => redoStackRef.current.length > 0,
    });
  }, [bump]);

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
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement.tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return;

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      // Undo
      if (isCtrlOrCmd && key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo
      if (isCtrlOrCmd && (key === "y" || (key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
        return;
      }



      // Escape - deselect
      if (e.key === "Escape") {
        setSelectedId(null);
        selectedIdRef.current = null;
        redrawAll();
        return;
      }

      // Only run tool shortcuts if no Ctrl/Cmd/Shift is held
      if (isCtrlOrCmd || e.shiftKey) return;

      // Tools
      if (key === "v") {
        setActiveTool("select");
      }
      if (key === "p") {
        setActiveTool("pen");
      }
      if (key === "e") {
        setActiveTool("eraser");
      }
      if (key === "h") {
        setActiveTool("highlighter");
      }
      if (key === "s") {
        setActiveTool("sticky");
      }
      if (key === "x") {
        setActiveTool("text");
      }

      // Shapes (tool = "shape", plus which shape)
      if (key === "r") {
        setActiveTool("shape");
        setActiveShape("rect");
      }
      if (key === "c") {
        setActiveTool("shape");
        setActiveShape("circle");
      }
      if (key === "t") {
        setActiveTool("shape");
        setActiveShape("triangle");
      }
      if (key === "l") {
        setActiveTool("shape");
        setActiveShape("line");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const redraw = () => {
    socket.emit('historysend', { history: historyStackRef.current });
  };

  useEffect(() => {
    const handlesocket = (data) => {
      const { history } = data;
      historyStackRef.current = history;
      redrawAll();
    };
    socket.on("historyreceived", handlesocket);
    return () => {
      socket.off("historyreceived", handlesocket);
    };
  }, [socket]);

  useEffect(() => {
    const handlesocket = (data) => {
      drawSegment(ctxRef.current,
        data.previousPoint,
        data.point_stored,
        data.color,
        data.width,
        data.isEraser,
        data.opacity
      );
    };
    const handleshape = (data) => {
      redrawAll();
      drawShape(ctxRef.current, data.shape);
    };
    const handletext = (data) => {
      drawText(ctxRef.current, {
        x: data.newTextItem.x,
        y: data.newTextItem.y,
        text: data.newTextItem.value,
        color: data.newTextItem.color,
        fontSize: data.newTextItem.fontSize,
      });
    };
    socket.on("currentreceived", handlesocket);
    socket.on("currentshapereceived", handleshape);
    socket.on("showtext", handletext);
    return () => {
      socket.off("currentreceived", handlesocket);
      socket.off("currentshapereceived", handleshape);
      socket.off("showtext", handletext);
    };
  }, [socket]);

  const redrawAll = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    historyStackRef.current.forEach((item) => {
      if (item.type === "stroke") {
        drawStroke(ctx, item);
      } else if (item.type === "text") {
        drawText(ctx, item);
      } else {
        drawShape(ctx, item);
      }
    });

    if (selectedIdRef.current) {
      const item = historyStackRef.current.find((i) => i.id === selectedIdRef.current);
      if (item) {
        const box = getScreenBoundingBox(item);
        ctx.save();
        ctx.strokeStyle = "#4f9dff";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(box.minX - 4, box.minY - 4, box.maxX - box.minX + 8, box.maxY - box.minY + 8);
        ctx.restore();
      }
    }
  }, [camera, zoom]);

  const drawRect = (ctx, shape) => {
    const start = worldtoscreen({ world: shape.start, camera });
    const end = worldtoscreen({ world: shape.end, camera });

    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);

    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;
    ctx.strokeRect(x, y, width, height);
  };

  const drawLineShape = (ctx, shape) => {
    const start = worldtoscreen({ world: shape.start, camera });
    const end = worldtoscreen({ world: shape.end, camera });
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  };

  const drawCircle = (ctx, shape) => {
    const start = worldtoscreen({ world: shape.start, camera });
    const end = worldtoscreen({ world: shape.end, camera });
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const radius = Math.sqrt(dx * dx + dy * dy);

    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;

    ctx.beginPath();
    ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
    ctx.stroke();
  };

  const drawTriangle = (ctx, shape) => {
    const start = worldtoscreen({ world: shape.start, camera });
    const end = worldtoscreen({ world: shape.end, camera });

    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;

    ctx.beginPath();
    ctx.moveTo((start.x + end.x) / 2, start.y);
    ctx.lineTo(start.x, end.y);
    ctx.lineTo(end.x, end.y);
    ctx.closePath();
    ctx.stroke();
  };

  const drawShape = (ctx, shape) => {
    console.log("Drawing:", shape.type);
    switch (shape.type) {
      case "rect": drawRect(ctx, shape); break;
      case "circle": drawCircle(ctx, shape); break;
      case "triangle": drawTriangle(ctx, shape); break;
      case "line": drawLineShape(ctx, shape); break;
      default: break;
    }
  };

  const drawSegment = (ctx, from, to, color, width, isEraser = false, opacity = 1) => {
    from = worldtoscreen({ world: from, camera });
    to = worldtoscreen({ world: to, camera });

    ctx.save();
    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out";
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
    return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  };

  const drawText = (ctx, item) => {
    ctx.save();
    ctx.fillStyle = item.color;
    ctx.font = `${item.fontSize}px Arial`;

    const screenPos = worldtoscreen({
      world: { x: item.x, y: item.y },
      camera
    });

    ctx.fillText(item.text, screenPos.x, screenPos.y);
    ctx.restore();
  };

  // commits the floating input box text onto the canvas as a history item
  // called on Enter key or when the input loses focus
  const commitText = useCallback(async (inputState) => {
    if (!inputState || !inputState.value.trim()) {
      setTextInput((prev) => (prev?.value.trim() ? prev : null));
      return;
    }

    // if editing an existing text item, remove the old one first
    if (inputState.editingId) {
      historyStackRef.current = historyStackRef.current.filter(
        (item) => item.id !== inputState.editingId
      );
    }

    const newTextItem = {
      id: inputState.editingId || crypto.randomUUID(),
      type: "text",
      text: inputState.value,
      x: inputState.x,
      y: inputState.y,
      color: inputState.color,
      fontSize: inputState.fontSize,
    };

    historyStackRef.current.push(newTextItem);
    redoStackRef.current = [];

    try {
      await axios.post(`${conf.path}/whiteboard/event`, {
        drawingOperations: newTextItem,
      }, { withCredentials: true });
    } catch (error) {
      console.log(error);
    }
    redrawAll();
    setTextInput(null);
    bump();
  }, [redrawAll]);

  // Mouse Handlers
  const handleMouseDown = (e) => {
    const point = getMousePos(e);
    setIsPanning(false);
    setIsZoom(false);
    const point_stored = screentoworld({ screen: point, camera });

    if (
      activeToolRefLocal.current === "pen" ||
      activeToolRefLocal.current === "eraser" ||
      activeToolRefLocal.current === "highlighter"
    ) {
      isDrawingRef.current = true;
      lastPointRef.current = point_stored;

      currentStrokeRef.current = {
        id: crypto.randomUUID(),
        type: "stroke",
        points: [point_stored],
        color: activeColorRef.current,
        width: activeToolRefLocal.current === "highlighter" ? strokeWidthRef.current * 4 : strokeWidthRef.current,
        isEraser: activeToolRefLocal.current === "eraser",
        opacity: activeToolRefLocal.current === "highlighter" ? 0.25 : 1,
        isHighlighter: activeToolRefLocal.current === "highlighter",
      };
    } else if (activeToolRefLocal.current === "shape") {
      isDrawingRef.current = true;
      shapeStartRef.current = point_stored;

      previewShapeRef.current = {
        id: crypto.randomUUID(),
        type: activeShape,
        start: point_stored,
        end: point_stored,
        color: activeColorRef.current,
        width: strokeWidthRef.current,
      };
    } else if (activeToolRefLocal.current === "select") {
      const point = getMousePos(e);
      const hit = hitTestScreen(point);

      if (hit) {
        setSelectedId(hit.id);
        selectedIdRef.current = hit.id;
        isDraggingRef.current = true;
        dragLastScreenRef.current = point;
        dragLastWorldRef.current = screentoworld({ screen: point, camera });
      } else {
        setSelectedId(null);
        selectedIdRef.current = null;
      }
      redrawAll();
    } else if (activeToolRefLocal.current === "text") {
      if (textInput) {
        commitText(textInput);
        return;
      }

      const worldPoint = screentoworld({ screen: point, camera });
      setTextInput({
        x: worldPoint.x,
        y: worldPoint.y,
        value: "",
        color: activeColorRefText.current,
        fontSize: 20,
        editingId: null,
      });
    }
  };

  // double click handler — if text tool is active and user double-clicks
  // an existing text item, re-opens it in the floating input for editing
  const handleDoubleClick = (e) => {
    if (activeToolRefLocal.current !== "text") return;

    const point = getMousePos(e);
    const ctx = ctxRef.current;

    // find the topmost text item whose bounding box contains the click point
    const clicked = [...historyStackRef.current].reverse().find((item) => {
      if (item.type !== "text") return false;

      ctx.font = `${item.fontSize}px Arial`;
      const measured = ctx.measureText(item.text);
      const w = measured.width;
      const h = item.fontSize;

      return (
        point.x >= item.x &&
        point.x <= item.x + w &&
        point.y >= item.y - h &&
        point.y <= item.y
      );
    });

    if (!clicked) return;

    // remove it from canvas visually and open it in the input box
    historyStackRef.current = historyStackRef.current.filter(
      (item) => item.id !== clicked.id
    );
    redrawAll();

    setTextInput({
      x: clicked.x,
      y: clicked.y,
      value: clicked.text,
      color: clicked.color,
      fontSize: clicked.fontSize,
      editingId: clicked.id,
    });
  };
  useEffect(() => {
    const handlesocket = (data) => {
      drawSegment(ctxRef.current,
        data.previousPoint,
        data.point,
        data.color,
        data.width,
        data.isEraser,
        data.opacity

      )
    }
    socket.on("currentreceived", handlesocket)
    return () => {
      socket.off("currentreceived", handlesocket);
    }


  }, [socket]);
  const handleMouseMove = (e) => {
    if (!isDrawingRef.current && !isDraggingRef.current) return;

    const now = performance.now();
    if (now - lastEmitTimeRef.current < THROTTLE_MS) return;
    lastEmitTimeRef.current = now;

    const point = getMousePos(e);
    const ctx = ctxRef.current;
    const point_stored = screentoworld({ screen: point, camera });

    if (activeToolRefLocal.current === "shape") {
      previewShapeRef.current.end = point_stored;
      redrawAll();
      socket.emit('currentshapesend', { shape: previewShapeRef.current });
      drawShape(ctx, previewShapeRef.current);
      return;
    }

    if (activeToolRefLocal.current === "select") {
      if (!isDraggingRef.current || !selectedIdRef.current) return;

      const point = getMousePos(e);
      const worldPoint = screentoworld({ screen: point, camera });

      const worldDx = worldPoint.x - dragLastWorldRef.current.x;
      const worldDy = worldPoint.y - dragLastWorldRef.current.y;

      const item = historyStackRef.current.find((i) => i.id === selectedIdRef.current);

      if (item) {
        if (item.type === "text") {
          item.x += worldDx;
          item.y += worldDy;
        } else if (item.type === "stroke") {
          item.points = item.points.map((p) => ({ x: p.x + worldDx, y: p.y + worldDy }));
        } else {
          item.start = { x: item.start.x + worldDx, y: item.start.y + worldDy };
          item.end = { x: item.end.x + worldDx, y: item.end.y + worldDy };
        }

        redrawAll();
        socket.emit("objectmoving", { item });
      }

      dragLastScreenRef.current = point;
      dragLastWorldRef.current = worldPoint;
      return;
    }

    const previousPoint = lastPointRef.current;
    socket.emit('currentsend', {
      previousPoint,
      point_stored,
      color: currentStrokeRef.current.color,
      width: currentStrokeRef.current.width,
      isEraser: currentStrokeRef.current.isEraser,
      opacity: currentStrokeRef.current.opacity
    });

    drawSegment(
      ctx,
      previousPoint,
      point_stored,
      currentStrokeRef.current.color,
      currentStrokeRef.current.width,
      currentStrokeRef.current.isEraser,
      currentStrokeRef.current.opacity
    );

    currentStrokeRef.current.points.push(point_stored);
    lastPointRef.current = point_stored;
  };

  const handleMouseUp = async () => {
    setIsPanning(true);
    setIsZoom(true);

    if (!isDrawingRef.current && !isDraggingRef.current) return;
    isDrawingRef.current = false;

    if (
      (activeToolRefLocal.current === "pen" ||
        activeToolRefLocal.current === "eraser" ||
        activeToolRefLocal.current === "highlighter") &&
      currentStrokeRef.current &&
      currentStrokeRef.current.points.length > 1
    ) {
      historyStackRef.current.push(currentStrokeRef.current);
      try {
        await axios.post(`${conf.path}/whiteboard/event`, {
          drawingOperations: currentStrokeRef.current,
        }, { withCredentials: true });
      } catch (error) {
        console.log(error);
      }

      redoStackRef.current = [];
      redrawAll();
      redraw();
      currentStrokeRef.current = null;
      bump();
    }

    if (activeToolRefLocal.current === "select") {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        const item = historyStackRef.current.find((i) => i.id === selectedIdRef.current);

        if (item) {
          try {
            await axios.post(
              `${conf.path}/whiteboard/update`,
              { id: item.id, drawingOperations: item },
              { withCredentials: true }
            );
          } catch (error) {
            console.log(error);
          }

          redoStackRef.current = [];
          redrawAll();
          redraw();
          bump();
        }
      }
      return;
    }

    if (activeToolRefLocal.current === "shape" && previewShapeRef.current) {
      historyStackRef.current.push(previewShapeRef.current);
      try {
        await axios.post(`${conf.path}/whiteboard/event`, {
          drawingOperations: previewShapeRef.current,
        }, { withCredentials: true });
      } catch (error) {
        console.log(error);
      }
      redoStackRef.current = [];
      previewShapeRef.current = null;
      redrawAll();
      bump();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e) => {
      const MAX = 20;
      const MIN = 0.02;
      let x = 0;

      if (e.ctrlKey && isZoom) {
        x = 1;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const screen = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };

        const world = screentoworld({ screen: screen, camera: cameraRef.current });
        const zoomFactor = 1 - e.deltaY * 0.001;

        let newzoom = (zoom * zoomFactor);
        newzoom = Math.max(MIN, (Math.min(MAX, newzoom)));

        setZoom(prev => Math.max(MIN, (Math.min(MAX, prev * zoomFactor))));

        const cameranew = cameraonzoom({ world, screen, newzoom });
        setCamera(cameranew);
      }

      if (x === 0 && isPanning) {
        setCamera(prev => ({
          x: prev.x + e.deltaX,
          y: prev.y + e.deltaY
        }));
      }
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [camera, zoom, isPanning, isZoom]);

  useEffect(() => {
    redrawAll();
  }, [camera, zoom]);

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="absolute inset-0 touch-none"
        style={{
          cursor: TOOL_CURSORS[activeTool] ?? "crosshair",
        }}
      />

      {textInput && (
        <textarea
          autoFocus
          value={textInput.value}
          onChange={(e) => {
            let value = e.target.value;
            setTextInput((prev) => ({ ...prev, value: value }));
            socket.emit("text", {
              newTextItem: {
                x: textInput.x,
                y: textInput.y,
                value: value,
                color: activeColorRefText.current,
                fontSize: 20,
                editingId: textInput.editingId,
              }
            });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              commitText(textInput);
            }
            if (e.key === "Escape") {
              setTextInput(null);
            }
          }}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            left: textInput.x,
            top: textInput.y - textInput.fontSize,
            fontSize: `${textInput.fontSize}px`,
            color: textInput.color,
            fontFamily: "Arial",
            background: "transparent",
            border: "1px dashed rgba(255,255,255,0.4)",
            outline: "none",
            resize: "none",
            minWidth: "120px",
            minHeight: `${textInput.fontSize + 8}px`,
            lineHeight: 1.2,
            padding: "2px 4px",
            caretColor: textInput.color,
            overflow: "hidden",
          }}
          rows={1}
        />
      )}
    </div>
  );
};

export default Whiteboard;