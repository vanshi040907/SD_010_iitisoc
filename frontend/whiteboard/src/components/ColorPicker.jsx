import { useState, useRef, useEffect, useCallback } from "react";
import { Copy, Check, Pipette, Palette } from "lucide-react";

// ─── constants ────────────────────────────────────────────────────────────────
const PRESETS = [
  "#ef4444","#f97316","#eab308","#22c55e",
  "#06b6d4","#3b82f6","#8b5cf6","#ec4899",
  "#ffffff","#d4d4d4","#737373","#404040",
  "#0a0a0a","#a855f7","#7c3aed","#6d28d9",
];

// ─── utils ────────────────────────────────────────────────────────────────────
function hsvToHex(h, s, v) {
  const i = Math.floor(h / 60) % 6;
  const f = h / 60 - Math.floor(h / 60);
  const p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - s + s * f);
  const [r, g, b] = [[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]][i]
    .map(x => Math.round(x * 255));
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

function hexToHsv(hex) {
  const r = parseInt(hex.slice(1,3),16)/255;
  const g = parseInt(hex.slice(3,5),16)/255;
  const b = parseInt(hex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b), d = max - min;
  let h = 0, s = max === 0 ? 0 : d / max, v = max;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d % 6) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
    if (h < 0) h += 360;
  }
  return { h, s, v };
}

function isValidHex(hex) {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

// ─── ColorMap canvas ──────────────────────────────────────────────────────────
function ColorMap({ hue, sat, bri, onChange }) {
  const canvasRef = useRef(null);
  const dragging  = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const gradH = ctx.createLinearGradient(0, 0, w, 0);
    gradH.addColorStop(0, "#fff");
    gradH.addColorStop(1, `hsl(${hue},100%,50%)`);
    ctx.fillStyle = gradH;
    ctx.fillRect(0, 0, w, h);
    const gradV = ctx.createLinearGradient(0, 0, 0, h);
    gradV.addColorStop(0, "transparent");
    gradV.addColorStop(1, "#000");
    ctx.fillStyle = gradV;
    ctx.fillRect(0, 0, w, h);
  }, [hue]);

  const update = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    onChange(
      Math.max(0, Math.min(1, (e.clientX - rect.left)  / rect.width)),
      1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    );
  }, [onChange]);

  return (
    <div className="relative" style={{ height: 120 }}>
      <canvas
        ref={canvasRef}
        width={232} height={120}
        className="w-full rounded-lg cursor-crosshair"
        style={{ display: "block" }}
        onMouseDown={e => { dragging.current = true; update(e); }}
        onMouseMove={e => { if (dragging.current) update(e); }}
        onMouseUp={() => { dragging.current = false; }}
        onMouseLeave={() => { dragging.current = false; }}
      />
      <div
        className="absolute pointer-events-none rounded-full border-2 border-white"
        style={{
          width: 12, height: 12,
          left: `${sat * 100}%`,
          top:  `${(1 - bri) * 100}%`,
          transform: "translate(-50%, -50%)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
}

// ─── HueBar canvas ────────────────────────────────────────────────────────────
function HueBar({ hue, onChange }) {
  const canvasRef = useRef(null);
  const dragging  = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, canvas.width, 0);
    for (let i = 0; i <= 360; i += 10)
      g.addColorStop(i / 360, `hsl(${i},100%,50%)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, 12);
  }, []);

  const update = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    onChange(Math.max(0, Math.min(360, ((e.clientX - rect.left) / rect.width) * 360)));
  }, [onChange]);

  return (
    <div className="relative" style={{ height: 20 }}>
      <canvas
        ref={canvasRef}
        width={232} height={12}
        className="w-full rounded-full cursor-pointer"
        style={{ display: "block", position: "absolute", top: 4 }}
        onMouseDown={e => { dragging.current = true; update(e); }}
        onMouseMove={e => { if (dragging.current) update(e); }}
        onMouseUp={() => { dragging.current = false; }}
        onMouseLeave={() => { dragging.current = false; }}
      />
      <div
        className="absolute pointer-events-none rounded-full border-2 border-white"
        style={{
          width: 16, height: 16, top: 2,
          left: `${(hue / 360) * 100}%`,
          transform: "translateX(-50%)",
          background: `hsl(${hue},100%,50%)`,
          boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
}

// ─── Main ColorPicker ─────────────────────────────────────────────────────────
// Props:
//   value    {string}   — current hex color e.g. "#a855f7"
//   onChange {function} — called with new hex string whenever color changes
export default function ColorPicker({ value = "#a855f7", onChange }) {
  const [hue, setHue]         = useState(() => hexToHsv(value).h);
  const [sat, setSat]         = useState(() => hexToHsv(value).s);
  const [bri, setBri]         = useState(() => hexToHsv(value).v);
  const [opacity, setOpacity] = useState(100);
  const [hexInput, setHexInput] = useState(value);
  const [copied, setCopied]   = useState(false);
  const [eyedropActive, setEyedropActive] = useState(false);

  const currentHex = hsvToHex(hue, sat, bri);

  // notify parent whenever hsv changes
  useEffect(() => {
    setHexInput(currentHex);
    onChange?.(currentHex);
  }, [hue, sat, bri]);

  const applyHex = useCallback((hex) => {
    if (!isValidHex(hex)) return;
    const { h, s, v } = hexToHsv(hex);
    setHue(h); setSat(s); setBri(v);
    setHexInput(hex);
  }, []);

  const handleMapChange  = useCallback((s, v) => { setSat(s); setBri(v); }, []);
  const handleHueChange  = useCallback((h)    => { setHue(h); }, []);

  const handleHexInput = (e) => {
    setHexInput(e.target.value);
    if (isValidHex(e.target.value)) applyHex(e.target.value);
  };

  const handleEyedropper = async () => {
    if (!("EyeDropper" in window)) {
      alert("Eyedropper requires Chrome 95+. Use the palette button instead.");
      return;
    }
    setEyedropActive(true);
    try {
      const result = await new window.EyeDropper().open();
      applyHex(result.sRGBHex);
    } catch (_) {}
    setEyedropActive(false);
  };

  const handleCopy = () => {
    let val = currentHex;
    if (opacity < 100) {
      val += Math.round((opacity / 100) * 255).toString(16).padStart(2, "0");
    }
    navigator.clipboard.writeText(val).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  // shared styles
  const glass = {
    background: "rgba(15,12,30,0.95)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
  };
  const inputCls = "flex-1 h-8 rounded-lg border border-white/10 bg-white/5 text-white text-xs font-mono px-2 outline-none focus:border-purple-500/60 transition-colors";
  const iconBtn = (active) =>
    `w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg border transition-all ${
      active
        ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
        : "border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
    }`;

  return (
    <div
      className="w-[260px] flex flex-col gap-3 p-3.5 rounded-2xl border border-white/10"
      style={glass}
    >
      {/* ── color saturation/brightness map ── */}
      <ColorMap hue={hue} sat={sat} bri={bri} onChange={handleMapChange} />

      {/* ── hue bar ── */}
      <HueBar hue={hue} onChange={handleHueChange} />

      {/* ── preset swatches ── */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
          Presets
        </p>
        <div className="grid grid-cols-8 gap-1">
          {PRESETS.map(c => (
            <button
              key={c}
              onClick={() => applyHex(c)}
              title={c}
              className="w-6 h-6 rounded-md border transition-transform hover:scale-110"
              style={{
                background: c,
                borderColor: currentHex === c ? "#a855f7" : "rgba(255,255,255,0.15)",
                outline:      currentHex === c ? "2px solid #a855f7" : "none",
                outlineOffset: 1,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── hex input + eyedropper + native picker ── */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
          Hex
        </p>
        <div className="flex gap-1.5 items-center">
          {/* live swatch */}
          <div
            className="w-8 h-8 flex-shrink-0 rounded-lg border border-white/15"
            style={{ background: currentHex }}
          />
          {/* hex text field */}
          <input
            className={inputCls}
            value={hexInput}
            onChange={handleHexInput}
            maxLength={7}
            spellCheck={false}
          />
          {/* eyedropper — picks color from anywhere on screen */}
          <button
            onClick={handleEyedropper}
            className={iconBtn(eyedropActive)}
            title="Pick color from screen (Chrome 95+)"
          >
            <Pipette size={14} />
          </button>
          {/* native OS color picker */}
          <label className={iconBtn(false)} title="Open native color picker">
            <Palette size={14} />
            <input
              type="color"
              value={currentHex}
              onChange={e => applyHex(e.target.value)}
              className="absolute opacity-0 w-0 h-0 pointer-events-none"
              tabIndex={-1}
            />
          </label>
        </div>
      </div>

      {/* ── opacity slider ── */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
          Opacity
        </p>
        <div className="flex items-center gap-2">
          {/* checkerboard track to show transparency */}
          <div className="flex-1 relative h-3 rounded-full overflow-hidden">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='4' height='4' fill='%23888'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23888'/%3E%3Crect x='4' width='4' height='4' fill='%23555'/%3E%3Crect y='4' width='4' height='4' fill='%23555'/%3E%3C/svg%3E\")",
              }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(to right, transparent, ${currentHex})`,
              }}
            />
            <input
              type="range"
              min={0} max={100} step={1}
              value={opacity}
              onChange={e => setOpacity(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
          <span className="text-xs text-slate-400 w-8 text-right tabular-nums">
            {opacity}%
          </span>
        </div>
      </div>

      {/* ── copy button ── */}
      <button
        onClick={handleCopy}
        className="flex items-center justify-center gap-1.5 h-8 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-medium transition-all"
      >
        {copied
          ? <Check size={13} className="text-green-400" />
          : <Copy size={13} />
        }
        {copied ? "Copied!" : "Copy hex"}
      </button>
    </div>
  );
}