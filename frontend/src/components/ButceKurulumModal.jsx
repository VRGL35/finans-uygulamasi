import { useState } from "react";
import { motion } from "framer-motion";

export default function ButceKurulumModal({ username, onComplete, lang = "tr" }) {
  const [step, setStep] = useState(1);
  const isTr = lang === "tr";

  const handleSkip = () => {
    localStorage.setItem(`budget_setup_completed_${username}`, "true");
    onComplete();
  };

  const handleStartSetup = () => {
    
    setStep(2); 
    
    
  };

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
        {step === 1 && (
          <>
            <div style={{ fontSize: "48px", marginBottom: "16px", filter: "drop-shadow(0 0 10px rgba(244, 114, 182, 0.5))" }}>
              🎯
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-main)", margin: "0 0 8px 0" }}>
              {isTr ? "Bütçe Limiti Belirlemek İster misiniz?" : "Set a Budget Limit?"}
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 28px 0", lineHeight: "1.5" }}>
              {isTr 
                ? "Harcamalarınızı kontrol altında tutmak için kategorilerinize aylık limit koyabilirsiniz." 
                : "You can set monthly limits for your categories to keep your expenses under control."}
            </p>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleSkip}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "12px",
                  color: "var(--text-main)",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)"; }}
              >
                {isTr ? "Hayır, Geç" : "Skip"}
              </button>
              
              <button
                onClick={handleStartSetup}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "linear-gradient(135deg, var(--accent) 0%, #2563eb 100%)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px var(--accent-glow)",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {isTr ? "Evet, Belirle ✨" : "Yes, Set it ✨"}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}