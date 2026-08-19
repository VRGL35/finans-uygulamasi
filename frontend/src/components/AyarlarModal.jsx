import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playClickSound } from "../utils/soundUtils";

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

  useEffect(() => {
    setTempLang(currentLang);
    setTempTheme(currentTheme);
    setTempAi(currentShowAssistant);
  }, [currentLang, currentTheme, currentShowAssistant]);

  const handleSaveClick = () => {
    try { playClickSound(); } catch(e) {}
    if (onSave) {
      onSave(tempLang, tempTheme, tempAi); 
    }
  };

  const handleResetClick = () => {
    try { playClickSound(); } catch(e) {}
    if (window.confirm(tempLang === 'tr' ? "Tüm veriler silinecek. Emin misin?" : "All data will be deleted. Are you sure?")) {
      if (onClearAllData) {
        onClearAllData();
      }
    }
  };

  const L = {
    tr: {
      title: "Sistem Ayarları",
      lang: "Dil Seçimi",
      theme: "Arayüz Teması",
      aiTitle: "Yapay Zeka Asistanı",
      aiDesc: "Finansal analiz ve akıllı tahminleme",
      save: "Değişiklikleri Kaydet",
      reset: "Tüm Verileri Sıfırla",
      themes: { dark: "Karanlık", cyberpunk: "Siberpunk", midnight: "Gece Yarısı", emerald: "Zümrüt" }
    },
    en: {
      title: "System Settings",
      lang: "Language",
      theme: "Interface Theme",
      aiTitle: "AI Assistant",
      aiDesc: "Financial analysis & smart predictions",
      save: "Save Changes",
      reset: "Factory Reset",
      themes: { dark: "Dark", cyberpunk: "Cyberpunk", midnight: "Midnight", emerald: "Emerald" }
    }
  }[tempLang] || {};

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)', zIndex: 9999,
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        style={{
          width: '100%', maxWidth: '440px',
          backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
          borderRadius: '24px', padding: '30px',
          boxShadow: '0 24px 50px rgba(0,0,0,0.5)', position: 'relative'
        }}
      >
        <button 
          onClick={() => { try { playClickSound(); } catch(e){} if (onClose) onClose(); }}
          style={{
            position: 'absolute', top: '24px', right: '24px',
            background: 'transparent', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', padding: '4px', display: 'flex'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-main)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px var(--text-main))' }}>
            <circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>{L?.title || "Ayarlar"}</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: '600' }}>{L?.lang || "Dil"}</label>
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              {['tr', 'en'].map((lng) => (
                <button
                  key={lng}
                  type="button"
                  onClick={() => { try { playClickSound(); } catch(e){} setTempLang(lng); }}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                    background: tempLang === lng ? 'var(--text-main)' : 'transparent',
                    color: tempLang === lng ? 'var(--bg-scene)' : 'var(--text-main)',
                    fontWeight: tempLang === lng ? '700' : '500',
                    fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s ease',
                    boxShadow: tempLang === lng ? '0 4px 12px rgba(255,255,255,0.1)' : 'none'
                  }}
                >
                  {lng === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: '600' }}>{L?.theme || "Tema"}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {['dark', 'cyberpunk', 'midnight', 'emerald'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { try { playClickSound(); } catch(e){} setTempTheme(t); }}
                  style={{
                    padding: '12px 8px', borderRadius: '12px',
                    background: tempTheme === t ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${tempTheme === t ? 'var(--text-main)' : 'var(--border-color)'}`,
                    color: tempTheme === t ? 'var(--text-main)' : 'var(--text-muted)',
                    fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease',
                    boxShadow: tempTheme === t ? 'inset 0 0 10px rgba(255,255,255,0.05)' : 'none'
                  }}
                >
                  {L?.themes?.[t] || t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)',
            background: 'rgba(0,0,0,0.2)' 
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-main)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 12 2.1 7.1"></path><path d="M12 12l9.9 4.9"></path></svg>
                <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>{L?.aiTitle || "Asistan"}</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{L?.aiDesc || "Aç / Kapat"}</span>
            </div>
            
            <div 
              onClick={() => { try { playClickSound(); } catch(e){} setTempAi(!tempAi); }}
              style={{
                width: '50px', height: '26px', borderRadius: '30px',
                background: tempAi ? 'var(--text-main)' : 'var(--bg-input)',
                border: `1px solid ${tempAi ? 'var(--text-main)' : 'var(--border-color)'}`,
                position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease'
              }}
            >
              <motion.div 
                animate={{ x: tempAi ? 24 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                  width: '20px', height: '20px', backgroundColor: tempAi ? 'var(--bg-scene)' : 'var(--text-muted)',
                  borderRadius: '50%', position: 'absolute', top: '2px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                }}
              />
            </div>
          </div>

        </div>

        <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveClick}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
              border: 'none', color: '#000', fontSize: '15px', fontWeight: '800',
              cursor: 'pointer', boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
            }}
          >
            {L?.save || "Kaydet"}
          </motion.button>

          <button
            onClick={handleResetClick}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444', fontSize: '14px', fontWeight: '600',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.border = '1px solid #ef4444'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.border = '1px solid rgba(239, 68, 68, 0.3)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            {L?.reset || "Sıfırla"}
          </button>
        </div>

      </motion.div>
    </div>
  );
}