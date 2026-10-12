"use client";

import { useEffect, useRef } from "react";

export default function useAmbientSound() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio("/music/babangfrank.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.3;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  return {
    resume() {
      const audio = audioRef.current;
      if (audio?.paused) audio.play().catch((error) => console.warn("Backsound belum bisa diputar:", error));
    },
  };
}
