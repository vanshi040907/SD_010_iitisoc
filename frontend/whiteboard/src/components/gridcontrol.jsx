import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useGrid } from "../context/GridContext";
import { Grid3x3 } from 'lucide-react';
const Btn_grid = () => {

    const { theme } = useContext(ThemeContext);
    const { showGrid, toggleGrid } = useGrid();

    return (
        <>
            <div className={` display-none sm:fixed bottom-4 left-1/2 -translate-x-44 w-14 h-14 rounded-xl flex z-40 items-center justify-center ${theme.textSecondary} ${theme.iconButtonHover} transition-all duration-200 z-5`}
                style={{
                    ...theme.glass
                }}>
                <button className=" h-18" onClick={toggleGrid} >
                    <Grid3x3 />
                </button>
            </div>
        </>
    )
}

export default Btn_grid