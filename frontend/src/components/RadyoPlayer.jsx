import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle
} from "react";
import { playClickSound } from "../utils/soundUtils";

const playlist = [
  { title: "Just a Joke", artist: "Yurie Kokubu", src: "/music/sarki1.mp3" },
  { title: "Easy", artist: "Commoders", src: "/music/sarki2.mp3" },
  { title: "Pink and White", artist: "Frank Ocean", src: "/music/sarki3.mp3" },
  { title: "Satelitte", artist: "Harry Styles", src: "/music/sarki4.mp3" },
  { title: "Casio", artist: "Jungle", src: "/music/sarki5.mp3" },

];

const RadyoPlayer = forwardRef(({ isUserLoggedIn }, ref) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isGlowing, setIsGlowing] = useState(false);

  const audioRef = useRef(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    let timeout;
    const triggerTwinkle = () => {
      const randomDelay = Math.random() * 5000 + 2000;
      timeout = setTimeout(() => {
        setIsGlowing(true);
        const activeDuration = Math.random() * 300 + 200;
        setTimeout(() => {
          setIsGlowing(false);
        }, activeDuration);
        triggerTwinkle();
      }, randomDelay);
    };
    triggerTwinkle();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const playRandomTrack = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * playlist.length);
    } while (playlist.length > 1 && randomIndex === currentTrackIndex);

    setCurrentTrackIndex(randomIndex);
    setIsPlaying(true);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
        audioRef.current.play().catch(() => {});
      }
    }, 50);
  };

  useImperativeHandle(ref, () => ({
    playRandomAudio: playRandomTrack,
    playAudio: playRandomTrack,
    stopAudio: () => {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }));

  const togglePlay = () => {
    playClickSound();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleNext = () => {
    playClickSound();
    playRandomTrack();
  };

  const handlePrev = () => {
    playClickSound();
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const currentTrack = playlist[currentTrackIndex];

  if (!isUserLoggedIn) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "45px",
        zIndex: 900,
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: "24px"
      }}
    >
      <style>
        {`
          .star-range {
            -webkit-appearance: none;
            width: 100%;
            height: 2px;
            background: rgba(255, 255, 255, 0.25);
            border-radius: 2px;
            cursor: pointer;
          }
          .star-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 10px;
            width: 10px;
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
            transition: box-shadow 0.3s ease-in-out;
            box-shadow: ${isGlowing ? "0 0 14px #ffffff, 0 0 24px #ffffff" : "0 0 2px rgba(255, 255, 255, 0.3)"};
          }
          .normal-range {
            -webkit-appearance: none;
            width: 60px;
            height: 2px;
            background: rgba(255, 255, 255, 0.25);
            border-radius: 2px;
            cursor: pointer;
          }
          .normal-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 8px;
            width: 8px;
            border-radius: 50%;
            background: var(--text-main);
          }
        `}
      </style>

      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={playRandomTrack}
      />

      <div style={{ display: "flex", flexDirection: "column", minWidth: "120px" }}>
        <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-main)" }}>{currentTrack.title}</span>
        <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>{currentTrack.artist}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button onClick={handlePrev} style={{ background: "none", border: "none", color: "var(--text-main)", cursor: "pointer", fontSize: "12px" }}>⏮</button>
        <button onClick={togglePlay} style={{ background: "none", border: "none", color: "var(--text-main)", cursor: "pointer", fontSize: "16px" }}>
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button onClick={handleNext} style={{ background: "none", border: "none", color: "var(--text-main)", cursor: "pointer", fontSize: "12px" }}>⏭</button>
      </div>

      <input
        type="range"
        className="star-range"
        min="0"
        max={duration || 100}
        value={currentTime}
        onChange={(e) => {
          const newTime = Number(e.target.value);
          setCurrentTime(newTime);
          if (audioRef.current) audioRef.current.currentTime = newTime;
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "12px" }}>🔊</span>
        <input
          type="range"
          className="normal-range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
});

export default RadyoPlayer;