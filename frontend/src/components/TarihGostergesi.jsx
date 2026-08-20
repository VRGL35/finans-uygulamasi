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
    <div className="date-widget">
      <span className="date-widget-date">{dateStr}</span>
      <span className="date-widget-sep" aria-hidden="true">•</span>
      <strong className="date-widget-time">{timeStr}</strong>
    </div>
  );
}