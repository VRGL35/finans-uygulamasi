import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { playClickSound } from "../utils/soundUtils";
import { translations } from "../utils/translations";
import { loginUser, registerUser, requestPasswordReset, maskEmail } from "../utils/auth";
import SifreSifirlamaModal from "./SifreSifirlamaModal";

export default function GirisEkrani({ onLogin, lang = "tr" }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [resetInfo, setResetInfo] = useState(null);

  const t = translations[lang] || translations.tr;

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = username.trim();
    if (!name) return;

    if (password.length < 4) {
      toast.error(t.errShortPassword, { icon: "⚠️" });
      return;
    }

    if (isLogin) {
      const res = loginUser({ username: name, password });
      if (!res.ok) {
        playClickSound();
        toast.error(
          res.error === "wrongPassword" ? t.errWrongPassword : t.errNoAccount,
          { icon: "⚠️" }
        );
        return;
      }
      playClickSound();
      onLogin(name, rememberMe);
    } else {
      const res = registerUser({ username: name, password, email: email.trim() });
      if (!res.ok) {
        playClickSound();
        toast.error(t.errUserTaken, { icon: "⚠️" });
        return;
      }
      toast.success(t.registerSuccess, { icon: "🎉" });
      playClickSound();
      onLogin(name, rememberMe);
    }
  };

  const handleForgotPassword = () => {
    playClickSound();
    const name = username.trim();

    if (!name) {
      toast.error(t.resetNeedsUsername, { icon: "⚠️" });
      return;
    }

    const res = requestPasswordReset(name);
    if (!res.ok) {
      toast.error(res.error === "noEmail" ? t.errNoEmail : t.errNoAccount, { icon: "⚠️" });
      return;
    }

    setResetInfo({ masked: maskEmail(res.email) });
  };

  const switchMode = () => {
    playClickSound();
    setIsLogin(!isLogin);
    setPassword("");
  };

  return (
    <div className="login-container">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
      >
        <div className="login-glow-top" aria-hidden="true" />
        <div className="login-glow-bottom" aria-hidden="true" />

        <div className="login-content">

          <div className="login-icon-box">
            <motion.div whileHover={{ scale: 1.05, rotate: 5 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? "login" : "register"}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {isLogin ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  ) : (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

          <div className="login-header">
            <h2 className="login-title">{isLogin ? t.loginTitle : t.registerTitle}</h2>
            <p className="login-subtitle">{isLogin ? t.loginDesc : t.registerDesc}</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                placeholder={t.usernamePlaceholder}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
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
                    placeholder={t.emailPlaceholder}
                    className="email-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <input
                type="password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            <div className="checkbox-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => {
                    playClickSound();
                    setRememberMe(e.target.checked);
                  }}
                />
                <span className="checkbox-visual">
                  <span className="checkbox-check">✓</span>
                </span>
                <span className="checkbox-text">{t.rememberMe}</span>
              </label>

              {isLogin && (
                <button type="button" className="forgot-link" onClick={handleForgotPassword}>
                  {t.forgotPassword}
                </button>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn-login"
            >
              {isLogin ? t.loginSubmit : t.registerSubmit}
            </motion.button>
          </form>

          <div className="login-toggle">
            <span className="login-toggle-text">
              {isLogin ? t.noAccount : t.hasAccount}
            </span>
            <button type="button" className="login-toggle-btn" onClick={switchMode}>
              {isLogin ? t.goRegister : t.goLogin}
            </button>
          </div>

        </div>
      </motion.div>

      {resetInfo && (
        <SifreSifirlamaModal
          username={username.trim()}
          maskedEmail={resetInfo.masked}
          lang={lang}
          onClose={() => setResetInfo(null)}
        />
      )}
    </div>
  );
}