import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useGrid } from "../context/GridContext";
const Btn_grid = () => {

    const { isDark, theme } = useContext(ThemeContext);
    const { showGrid, toggleGrid } = useGrid();

    return (
        <>
            <div className={`fixed bottom-38 right-4 p-5 h-14 rounded-xl flex z-50 items-center justify-center ${theme.textPrimary} ${theme.iconButtonHover} transition-all duration-200 z-5 border ${theme.border}`}
                style={{
                    ...theme.glass
                }}>
                <button className=" h-18" onClick={toggleGrid} >
                    {showGrid ? "Hide grid" : "Show grid"}
                </button>



            </div>
        </>
    )
}

export default Btn_grid