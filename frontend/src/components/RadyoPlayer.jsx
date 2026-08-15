import { useState, useRef, useEffect } from "react";

const PLAYLIST = [
  {
    title: "Just a Joke",
    artist: "Yurie Kokubu",
    src: "/music/sarki1.mp3"
  },
  {
    title: "Easy",
    artist: "Commodores",
    src: "/music/sarki2.mp3"
  }
];

export default function RadyoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(0.25);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const currentTrack = PLAYLIST[currentIndex] || { title: "Müzik Yok", artist: "-", src: "" };

  // Otomatik Oynatma: Sayfada herhangi bir yere ilk tıklandığı an müziği başlatır
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && currentTrack.src) {
        audioRef.current.volume = volume;
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Tarayıcı engellerse hata basmasını önle
          });
      }
      // İlk tetiklenmeden sonra dinleyicileri kaldır
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    // Önce doğrudan başlatmayı dene (bazı izinli tarayıcılar için)
    if (audioRef.current && currentTrack.src) {
      audioRef.current.volume = volume;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Tarayıcı doğrudan başlatmaya izin vermezse ilk etkileşimi bekle
          window.addEventListener("click", handleFirstInteraction);
          window.addEventListener("keydown", handleFirstInteraction);
        });
    }

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [currentTrack.src]);

  // Şarkı veya ses seviyesi değiştiğinde
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentIndex, isPlaying, volume]);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack.src) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime || 0);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || !secs) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "#0b1329",
        borderBottom: "1px solid #1e293b",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "14px",
        fontSize: "13px",
        color: "#cbd5e1"
      }}
    >
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleNext}
      />

      {/* Şarkı Bilgisi */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "140px" }}>
        <span style={{ fontSize: "16px" }}>🎵</span>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: "600", color: "#f8fafc", whiteSpace: "nowrap" }}>
            {currentTrack.title}
          </span>
          <span style={{ fontSize: "11px", color: "#94a3b8" }}>
            {currentTrack.artist} ({currentIndex + 1}/{PLAYLIST.length})
          </span>
        </div>
      </div>

      {/* Kontroller */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: 1, maxWidth: "320px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={handlePrev}
            style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "14px" }}
            title="Önceki"
          >
            ⏮
          </button>

          <button
            onClick={togglePlay}
            style={{
              backgroundColor: isPlaying ? "#22c55e" : "#3b82f6",
              border: "none",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              color: "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px"
            }}
            title={isPlaying ? "Durdur" : "Oynat"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          <button
            onClick={handleNext}
            style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "14px" }}
            title="Sonraki"
          >
            ⏭
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", fontSize: "11px", color: "#64748b" }}>
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            style={{ flex: 1, accentColor: "#3b82f6", height: "4px", cursor: "pointer" }}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Ses */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "12px", color: "#94a3b8" }}>🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          style={{ width: "55px", accentColor: "#3b82f6", cursor: "pointer" }}
          title="Ses"
        />
      </div>
    </div>
  );
}