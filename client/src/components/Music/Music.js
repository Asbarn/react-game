import React, { useState, useEffect } from "react";

const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(true);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => {
      setPlaying(false);
      setPlaying(true);
    });
    return () => {
      audio.removeEventListener("ended", () => {
        setPlaying(false);
        setPlaying(true);
      });
    };
  }, []);

  return [playing, toggle, audio];
};

const Player = ({ url, ending, musicVolume}) => {
  const [playing, togglePlaying, audio] = useAudio(url);
  const [volume, setVolume] = useState(1);  
};

export default Player;
