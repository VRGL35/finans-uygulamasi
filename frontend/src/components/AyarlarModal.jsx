import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { playClickSound } from "../utils/soundUtils";

const THEMES = ["dark", "cyberpunk", "midnight", "emerald"];

export default function AyarlarModal({
  currentLang = "tr",
  currentTheme = "midnight",
  currentShowAssistant = true,
  onSave,
  onClose,
  onClearAllData
}) {
  const [tempLang, setTempLang] = useState(currentLang);
  const [tempTheme, setTempTheme] = useState(currentTheme);
  const [tempAi, setTempAi] = useState(currentShowAssistant);
  const [resetArmed, setResetArmed] = useState(false);
  const panelRef = useRef(null);
  const armTimer = useRef(null);

  useEffect(() => {
    setTempLang(currentLang);
    setTempTheme(currentTheme);
    setTempAi(currentShowAssistant);
  }, [currentLang, currentTheme, currentShowAssistant]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    document.addEventListener("keydown", handleKey);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => () => clearTimeout(armTimer.current), []);

  const click = () => {
    try { playClickSound(); } catch (e) {}
  };

  const handleSaveClick = () => {
    click();
    if (onSave) onSave(tempLang, tempTheme, tempAi);
  };

  const handleResetClick = () => {
    click();
    if (!resetArmed) {
      setResetArmed(true);
      armTimer.current = setTimeout(() => setResetArmed(false), 3000);
      return;
    }
    clearTimeout(armTimer.current);
    if (onClearAllData) onClearAllData();
  };

  const L = {
    tr: {
      title: "Sistem Ayarları",
      close: "Kapat",
      lang: "Dil Seçimi",
      theme: "Arayüz Teması",
      aiTitle: "Yapay Zeka Asistanı",
      aiDesc: "Finansal analiz ve akıllı tahminleme",
      save: "Değişiklikleri Kaydet",
      reset: "Tüm Verileri Sıfırla",
      resetConfirm: "Emin misin? Onay için tekrar tıkla",
      themes: { dark: "Karanlık", cyberpunk: "Siberpunk", midnight: "Gece Yarısı", emerald: "Zümrüt" }
    },
    en: {
      title: "System Settings",
      close: "Close",
      lang: "Language",
      theme: "Interface Theme",
      aiTitle: "AI Assistant",
      aiDesc: "Financial analysis & smart predictions",
      save: "Save Changes",
      reset: "Factory Reset",
      resetConfirm: "Are you sure? Click again to confirm",
      themes: { dark: "Dark", cyberpunk: "Cyberpunk", midnight: "Midnight", emerald: "Emerald" }
    }
  }[tempLang] || {};

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          click();
          if (onClose) onClose();
        }
      }}
    >
      <motion.div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={L?.title || "Ayarlar"}
        className="settings-modal"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <button
          type="button"
          className="modal-close-btn"
          aria-label={L?.close || "Kapat"}
          onClick={() => { click(); if (onClose) onClose(); }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="settings-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-main)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <h2 className="settings-title">{L?.title || "Ayarlar"}</h2>
        </div>

        <div className="settings-body">

          <div>
            <span className="field-label">{L?.lang || "Dil"}</span>
            <div className="segmented">
              {["tr", "en"].map((lng) => (
                <button
                  key={lng}
                  type="button"
                  aria-pressed={tempLang === lng}
                  className={`segmented-btn ${tempLang === lng ? "active" : ""}`}
                  onClick={() => { click(); setTempLang(lng); }}
                >
                  {lng === "tr" ? "🇹🇷 Türkçe" : "🇬🇧 English"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="field-label">{L?.theme || "Tema"}</span>
            <div className="theme-grid">
              {THEMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={tempTheme === t}
                  className={`theme-btn ${tempTheme === t ? "active" : ""}`}
                  onClick={() => { click(); setTempTheme(t); }}
                >
                  {L?.themes?.[t] || t}
                </button>
              ))}
            </div>
          </div>

          <div className="ai-row">
            <div>
              <div className="ai-title-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-main)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 12 2.1 7.1"></path><path d="M12 12l9.9 4.9"></path></svg>
                <span className="ai-title">{L?.aiTitle || "Asistan"}</span>
              </div>
              <span className="ai-desc">{L?.aiDesc || "Aç / Kapat"}</span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={tempAi}
              className={`switch ${tempAi ? "on" : ""}`}
              onClick={() => { click(); setTempAi(!tempAi); }}
            >
              <span className="switch-knob" />
            </button>
          </div>

        </div>

        <div className="settings-actions">
          <button type="button" className="btn-save" onClick={handleSaveClick}>
            {L?.save || "Kaydet"}
          </button>

          <button
            type="button"
            className={`btn-reset ${resetArmed ? "armed" : ""}`}
            onClick={handleResetClick}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            {resetArmed ? (L?.resetConfirm || "Emin misin?") : (L?.reset || "Sıfırla")}
          </button>
        </div>

      </motion.div>
    </div>
  );
}