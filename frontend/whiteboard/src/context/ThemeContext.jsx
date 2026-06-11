import { createContext, useState } from "react";
export const ThemeContext =createContext();

const themes = {
  dark: {
    pageBg: "radial-gradient(ellipse at 20% 50%, #1a0b2e 0%, #0d0d1a 50%, #0a0a14 100%)",
    glass: {
      background: "rgba(15, 12, 30, 0.85)",
      backdropFilter: "blur(16px)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
    },
    border: "border-white/10",
    textPrimary: "text-[#ffffff]",
    textSecondary: "text-slate-400",
    textMuted: "text-slate-500",
    accent: "text-purple-400",
    activeBg: "bg-purple-600",
    activeShadow: "shadow-purple-900/60",
    hover: "hover:bg-white/10 hover:text-white",
    tooltipBg: "#1a1a2e",
    divider: "bg-white/10",
    backdrop: "rgba(0,0,0,0.55)",
    onlinePill: "bg-green-500/15 text-green-400",
    awayPill: "bg-white/5 text-slate-500",
    leaveBtn: "bg-red-500/15 border-red-500/20 text-red-400",
    iconButtonHover: "hover:text-white hover:bg-white/10",
    iconBg: "bg-purple-600/20",   
    hoverEmoji:"hover:bg-white/10",
    whiteHover: "hover:text-white"
  },

  light: {
    pageBg: "radial-gradient(ellipse at 20% 50%, #f5f0ff 0%, #fdf4ff 50%, #fff9f5 100%)",
    glass: {
      background: "rgba(255, 255, 255, 0.75)",
      backdropFilter: "blur(16px)",
      boxShadow: "0 4px 24px rgba(168,85,247,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
    },
    border: "border-purple-200/40",
    textPrimary: "text-[#3d2a5c]",
    textSecondary: "text-[#9b8aad]",
    textMuted: "text-[#b3a3c4]",
    accent: "text-purple-500",
    activeBg: "bg-purple-400",
    activeShadow: "shadow-purple-300/50",
    hover: "hover:bg-purple-500/10 hover:text-[#3d2a5c]",
    tooltipBg: "#2d1b4e",
    divider: "bg-purple-200/40",
    backdrop: "rgba(168,85,247,0.15)",
    onlinePill: "bg-green-100 text-green-600",
    awayPill: "bg-purple-50 text-[#b3a3c4]",
    leaveBtn: "bg-red-100 border-red-200 text-red-500",
    iconButtonHover: "hover:text-[#3d2a5c] hover:bg-purple-500/10",
    iconBg: "bg-purple-400/15",
    hoverEmoji: "hover:bg-purple-500/10",
    whiteHover:"hover:text-[#3d2a5c]"
  },
};

export function ThemeProvider({children}){
    const [isDark, setIsDark] = useState(false);
    const toggleTheme = () => setIsDark((prev) => !prev);
    const theme = isDark ? themes.dark : themes.light;

    
    return(
        <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
         {children}
        </ThemeContext.Provider>
    );

}