import { useState, useEffect } from "react";

export default function TarihGostergesi({ lang = "tr" }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const locale = lang === "en" ? "en-US" : "tr-TR";

  const dateStr = time.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long"
  });

  const timeStr = time.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  return (
    <div
      style={{
        textAlign: "center",
        fontSize: "13px",
        color: "var(--text-muted)",
        padding: "12px 18px",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease"
      }}
    >
      <span style={{ fontWeight: "500" }}>{dateStr}</span>
      <span style={{ margin: "0 10px", color: "var(--border-color)" }}>•</span>
      <strong style={{ color: "var(--accent)", letterSpacing: "0.5px" }}>{timeStr}</strong>
    </div>
  );
}