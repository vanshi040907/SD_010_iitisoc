import React from 'react'
import { animate, stagger, splitText } from 'animejs';
import {useEffect, useRef} from 'react';

const LetsCoSketh = () => {
  const titleRef = useRef(null);
   
  useEffect(()=>{
    const {chars} = splitText(titleRef.current, {words: false, chars: true});

    const animation = animate(chars, {
      y: [
        { to: "-2.75rem", ease: "outExpo", duration: 600 },
        { to: 0, ease: "outBounce", duration: 800, delay: 100 },
      ],
      rotate: {
        from: "-1turn",
        delay: 0,
      },
      delay: stagger(50),
      ease: "inOutCirc",
      loopDelay: 1000,
      loop: true,
    });
     
    return () => animation.pause();
  }, []);

  return (
    <div ref={titleRef} className={`text-5xl font-black text-white tracking-tight font-[Clash_Display] mb-2`}>
      ✏️ Let's CoSketch
    </div>
  )
}

export default LetsCoSketh
