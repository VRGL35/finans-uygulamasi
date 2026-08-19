import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast"; // Bildirimler için eklendi
import { playClickSound } from "../utils/soundUtils";

export default function GirisEkrani({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim().length > 0) {
      playClickSound();
      onLogin(username, rememberMe);
    }
  };

  const handleForgotPassword = () => {
    playClickSound();
    if (!username.trim()) {
      toast.error("Şifrenizi sıfırlamak için lütfen önce kullanıcı adınızı girin.", {
        icon: '⚠️',
      });
    } else {
      toast.success(`Şifre sıfırlama bağlantısı @${username} için e-posta adresinize gönderildi!`, {
        icon: '📧',
      });
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100%', 
      width: '100%', 
      padding: '20px' 
    }}>
      
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'var(--bg-card)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '40px 32px',
          boxShadow: '0 24px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--accent)', filter: 'blur(80px)', opacity: 0.2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '150px', height: '150px', background: 'var(--primary-btn)', filter: 'blur(80px)', opacity: 0.15, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              style={{
                width: '64px', height: '64px', borderRadius: '18px',
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div 
                  key={isLogin ? "login" : "register"}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {isLogin ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px var(--accent-glow))' }}>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  ) : (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px var(--accent-glow))' }}>
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              {isLogin ? 'Sisteme Giriş Yap' : 'Yeni Hesap Oluştur'}
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
              {isLogin ? 'Finansal kontrol paneline erişmek için bilgilerinizi girin.' : 'Kendi finansal uzay üssünüzü kurmak için aramıza katılın.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <input
                type="text"
                placeholder="Kullanıcı Adı"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="email"
                    placeholder="E-posta Adresi"
                    style={{ marginTop: "8px" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 4px 12px 4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <div
                  onClick={() => { playClickSound(); setRememberMe(!rememberMe); }}
                  style={{
                    width: '18px', height: '18px', borderRadius: '6px',
                    border: `1px solid ${rememberMe ? 'var(--accent)' : 'var(--border-color)'}`,
                    background: rememberMe ? 'var(--accent)' : 'rgba(0,0,0,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: rememberMe ? '0 0 10px var(--accent-glow)' : 'none'
                  }}
                >
                  {rememberMe && <span style={{ color: '#000', fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', userSelect: 'none' }}>Beni Hatırla</span>
              </label>

              {isLogin && (
                <span 
                  onClick={handleForgotPassword}
                  style={{ fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} 
                  onMouseOver={e=>e.target.style.color='var(--accent)'} 
                  onMouseOut={e=>e.target.style.color='var(--text-muted)'}
                >
                  Şifremi Unuttum
                </span>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary-btn) 100%)',
                border: 'none', color: '#000', fontSize: '15px', fontWeight: '800',
                cursor: 'pointer', boxShadow: '0 8px 20px var(--accent-glow)',
                textShadow: '0 1px 2px rgba(255,255,255,0.2)', transition: 'all 0.2s ease'
              }}
            >
              {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
            </motion.button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {isLogin ? 'Hesabınız yok mu?' : 'Zaten bir hesabınız var mı?'}
            </span>
            <button
              type="button"
              onClick={() => { playClickSound(); setIsLogin(!isLogin); }}
              style={{
                background: 'transparent', border: 'none', color: 'var(--text-main)',
                fontSize: '13px', fontWeight: '700', marginLeft: '6px', cursor: 'pointer',
                textDecoration: 'underline', textUnderlineOffset: '4px', textDecorationThickness: '1px', textDecorationColor: 'var(--accent)',
                transition: 'color 0.2s ease'
              }}
              onMouseOver={e=>e.target.style.color='var(--accent)'}
              onMouseOut={e=>e.target.style.color='var(--text-main)'}
            >
              {isLogin ? 'Hemen Kayıt Olun' : 'Giriş Yapın'}
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}