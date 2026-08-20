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
    <div className="radio-player">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={playRandomTrack}
      />

      <div className="radio-track-info">
        <span className="radio-track-title">{currentTrack.title}</span>
        <span className="radio-track-artist">{currentTrack.artist}</span>
      </div>

      <div className="radio-controls">
        <button
          type="button"
          className="radio-btn prev"
          onClick={handlePrev}
          aria-label="Önceki şarkı"
        >
          ⏮
        </button>
        <button
          type="button"
          className="radio-btn play"
          onClick={togglePlay}
          aria-label={isPlaying ? "Duraklat" : "Oynat"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button
          type="button"
          className="radio-btn next"
          onClick={handleNext}
          aria-label="Sonraki şarkı"
        >
          ⏭
        </button>
      </div>

      <input
        type="range"
        className={`star-range ${isGlowing ? "glowing" : ""}`}
        min="0"
        max={duration || 100}
        value={currentTime}
        onChange={(e) => {
          const newTime = Number(e.target.value);
          setCurrentTime(newTime);
          if (audioRef.current) audioRef.current.currentTime = newTime;
        }}
        aria-label="Şarkı ilerleme çubuğu"
      />

      <div className="radio-volume">
        <span className="radio-volume-icon" aria-hidden="true">🔊</span>
        <input
          type="range"
          className="normal-range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Ses seviyesi"
        />
      </div>
    </div>
  );
});

export default RadyoPlayer;