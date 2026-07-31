import React, { useContext, useEffect, useRef, useState } from 'react'
import { WhiteboardContext } from '../context/WhiteboardContext'
import { ThemeContext } from '../context/ThemeContext'

function Playback() {
    const { drawingRefs } = useContext(WhiteboardContext);
    const { theme } = useContext(ThemeContext);

    const replayIndexRef = useRef(0);
    const replayTimeoutRef = useRef(null);
    const [isReplaying, setIsReplaying] = useState(false);
    const [replayProgress, setReplayProgress] = useState(0);

    // Total item count read directly from the shared historyStackRef,
    // instead of the WhiteboardContext `historyLength` state (which only
    // updates on the client that personally drew/undid something, not on
    // clients that received history over the socket).
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const poll = setInterval(() => {
            const liveLength = drawingRefs.current?.historyStackRef?.current?.length ?? 0;
            setTotalItems((prev) => (prev !== liveLength ? liveLength : prev));
        }, 250);

        return () => clearInterval(poll);
    }, [drawingRefs]);

    const playReplayStep = () => {
        const { historyStackRef, ctxRef, drawStroke, drawText, drawShape } = drawingRefs.current;
        const items = historyStackRef.current;
        const index = replayIndexRef.current;

        if (index >= items.length) {
            setIsReplaying(false);
            replayIndexRef.current = 0; // reset so the next Play starts fresh, not "resumes"
            return;
        }

        const item = items[index];
        const ctx = ctxRef.current;

        if (item.type === "stroke") {
            drawStroke(ctx, item);
        } else if (item.type === "text") {
            drawText(ctx, item);
        } else {
            drawShape(ctx, item);
        }

        replayIndexRef.current = index + 1;
        setReplayProgress(index + 1);

        replayTimeoutRef.current = setTimeout(playReplayStep, 500);
    };

    const startReplay = () => {
        const { historyStackRef, ctxRef, canvasRef } = drawingRefs.current;
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        setTotalItems(historyStackRef.current.length);
        replayIndexRef.current = 0;
        setReplayProgress(0);
        setIsReplaying(true);
        playReplayStep();
    };

    const pauseReplay = () => {
        clearTimeout(replayTimeoutRef.current);
        setIsReplaying(false);
    };

    const resumeReplay = () => {
        setIsReplaying(true);
        playReplayStep();
    };

    const stopReplay = () => {
        clearTimeout(replayTimeoutRef.current);
        setIsReplaying(false);
        replayIndexRef.current = 0; // actually reset, so Stop means "start over" next time
        setReplayProgress(0);
        drawingRefs.current.redrawAll?.();
    };

    const handlePlayPauseClick = () => {
        const { historyStackRef } = drawingRefs.current;
        if (isReplaying) {
            pauseReplay();
        } else if (replayIndexRef.current > 0 && replayIndexRef.current < historyStackRef.current.length) {
            resumeReplay();
        } else {
            startReplay();
        }
    };

    const replayPercent =
        totalItems > 0
            ? (replayProgress / totalItems) * 100
            : 0;

    const PlayIcon = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
        </svg>
    );

    const PauseIcon = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" />
            <rect x="14" y="5" width="4" height="14" />
        </svg>
    );

    const StopIcon = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="5" y="5" width="14" height="14" />
        </svg>
    );

    return (
        <div
            className={`display-none sm:absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex items-center gap-[14px] border ${theme.border} px-[18px] py-[10px] rounded-full backdrop-blur-md`}
            style={theme.glass}
        >

            <button
                onClick={handlePlayPauseClick}
                className={`flex items-center justify-center w-9 h-9 rounded-full border-none cursor-pointer transition-colors duration-150 ${isReplaying ? `${theme.activeBg} text-white` : `${theme.iconBg} ${theme.accent}`
                    }`}
            >
                {isReplaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <button
                onClick={stopReplay}
                className={`flex items-center justify-center w-8 h-8 rounded-full border-none cursor-pointer ${theme.iconBg} ${theme.accent}`}
            >
                <StopIcon />
            </button>

            <div className={`w-[160px] h-1 ${theme.divider} rounded-full`}>
                <div
                    className={`h-full ${theme.activeBg} rounded-full transition-[width] duration-100 ease-linear`}
                    style={{ width: `${replayPercent}%` }}
                />
            </div>

            <span className={`${theme.accent} text-xs font-inherit min-w-[50px]`}>
                {replayProgress}/{totalItems}
            </span>
        </div>
    )
}

export default Playback