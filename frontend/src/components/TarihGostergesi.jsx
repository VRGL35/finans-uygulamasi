import { useState, useEffect } from "react";

export default function TarihGostergesi() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long"
  });

  const formattedTime = currentDateTime.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  return (
    <div
      style={{
        margin: "20px auto 0 auto",
        maxWidth: "380px",
        backgroundColor: "rgba(30, 41, 59, 0.6)",
        border: "1px solid #334155",
        padding: "10px 18px",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
        fontSize: "12px",
        color: "#cbd5e1"
      }}
    >
      <span>{formattedDate}</span>
      <span style={{ color: "#64748b" }}>•</span>
      <span style={{ color: "#38bdf8", fontWeight: "600", letterSpacing: "0.5px" }}>
        {formattedTime}
      </span>
    </div>
  );
}