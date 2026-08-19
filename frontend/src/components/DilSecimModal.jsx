import { motion } from "framer-motion";

export default function DilSecimModal({ onSelectLanguage }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, type: "spring" }}
        style={{
          backgroundColor: "var(--bg-card)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid var(--border-color)",
          borderRadius: "24px",
          padding: "32px",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px", filter: "drop-shadow(0 0 10px rgba(56, 189, 248, 0.5))" }}>
          🌐
        </div>
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-main)", margin: "0 0 8px 0" }}>
          Dil Seçimi / Select Language
        </h2>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 24px 0", lineHeight: "1.5" }}>
          Lütfen devam etmek için bir dil seçin. / Please choose a language to continue.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={() => onSelectLanguage("tr")}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              color: "var(--text-main)",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.15)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)"; e.currentTarget.style.borderColor = "var(--border-color)"; }}
          >
            <span>🇹🇷</span> Türkçe
          </button>
          
          <button
            onClick={() => onSelectLanguage("en")}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              color: "var(--text-main)",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.15)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)"; e.currentTarget.style.borderColor = "var(--border-color)"; }}
          >
            <span>🇬🇧</span> English
          </button>
        </div>
      </motion.div>
    </div>
  );
}