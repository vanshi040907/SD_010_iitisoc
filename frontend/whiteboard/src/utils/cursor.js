const encode = (svg) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

const PENCIL_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M3 21l4-1L19 8l-3-3L4 17 3 21z"
    fill="#fff" stroke-width="1"/>
  <path d="M16 5l3 3" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;
export const CURSOR_PENCIL = `${encode(PENCIL_SVG)} 0 24, crosshair`;


const HIGHLIGHTER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <rect x="9" y="3" width="6" height="14" rx="2"
    fill="#fff" stroke="#fff" stroke-width="1" opacity="0.85"/>
  <rect x="10" y="17" width="4" height="4" rx="1" fill="#fff"/>
  <line x1="12" y1="21" x2="12" y2="24"
    stroke="#fff" stroke-width="2" stroke-linecap="round"/>
</svg>`;
export const CURSOR_HIGHLIGHTER = `${encode(HIGHLIGHTER_SVG)} 12 24, crosshair`;


const ERASER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <rect x="3" y="10" width="16" height="10" rx="2"
    fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.2"/>
  <rect x="3" y="10" width="7" height="10" rx="2"
    fill="#f43f5e" opacity="0.7"/>
  <line x1="3" y1="20" x2="19" y2="20"
    stroke="#94a3b8" stroke-width="1"/>
</svg>`;
export const CURSOR_ERASER = `${encode(ERASER_SVG)} 16 20, cell`;


const CROSSHAIR_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <line x1="12" y1="2"  x2="12" y2="10"
    stroke="#a855f7" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="12" y1="14" x2="12" y2="22"
    stroke="#a855f7" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="2"  y1="12" x2="10" y2="12"
    stroke="#a855f7" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="14" y1="12" x2="22" y2="12"
    stroke="#a855f7" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="12" cy="12" r="2"
    fill="#a855f7"/>
</svg>`;
export const CURSOR_CROSSHAIR = `${encode(CROSSHAIR_SVG)} 12 12, crosshair`;


const TEXT_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <line x1="8"  y1="4" x2="16" y2="4"
    stroke="#a855f7" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="8"  y1="20" x2="16" y2="20"
    stroke="#a855f7" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="12" y1="4"  x2="12" y2="20"
    stroke="#a855f7" stroke-width="2" stroke-linecap="round"/>
</svg>`;
export const CURSOR_TEXT = `${encode(TEXT_SVG)} 12 12, text`;


const SELECT_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M5 3l14 9-7 1-4 7z"
    fill="#a855f7" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/>
</svg>`;
export const CURSOR_SELECT = `${encode(SELECT_SVG)} 5 3, default`;


export const CURSOR_LASER = "none";


export const TOOL_CURSORS = {
  select:      CURSOR_SELECT,
  pen:         CURSOR_PENCIL,
  highlighter: CURSOR_HIGHLIGHTER,
  eraser:      CURSOR_ERASER,
  text:        CURSOR_TEXT,
  rect:        CURSOR_CROSSHAIR,
  circle:      CURSOR_CROSSHAIR,
  triangle:    CURSOR_CROSSHAIR,
  line:        CURSOR_CROSSHAIR,
  shape:       CURSOR_CROSSHAIR,
  laser:       CURSOR_LASER,
};