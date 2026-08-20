import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { translations } from "../utils/translations";
import { resetPassword } from "../utils/auth";
import { playClickSound } from "../utils/soundUtils";

export default function SifreSifirlamaModal({ username, maskedEmail, lang = "tr", onClose }) {
  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  const t = translations[lang] || translations.tr;

  const handleSubmit = (e) => {
    e.preventDefault();
    playClickSound();

    if (pass1.length < 4) {
      toast.error(t.errShortPassword, { icon: "⚠️" });
      return;
    }
    if (pass1 !== pass2) {
      toast.error(t.errPassMismatch, { icon: "⚠️" });
      return;
    }

    const res = resetPassword({ username, email, newPassword: pass1 });
    if (!res.ok) {
      toast.error(
        res.error === "emailMismatch" ? t.errEmailMismatch : t.errNoAccount,
        { icon: "⚠️" }
      );
      return;
    }

    toast.success(t.resetSuccess, { icon: "🔐" });
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="budget-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t.resetTitle}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <div className="modal-icon-box" aria-hidden="true">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            <circle cx="12" cy="16" r="1.5"></circle>
          </svg>
        </div>

        <h2 className="budget-title">{t.resetTitle}</h2>
        <p className="budget-desc">{t.resetDesc}</p>

        <div className="reset-hint">
          {(t.resetHint || "Kayıtlı e-posta: {email}").replace("{email}", maskedEmail)}
        </div>

        <form className="budget-form" onSubmit={handleSubmit}>
          <div className="budget-field">
            <label htmlFor="reset-email">{t.resetEmailLabel}</label>
            <input
              id="reset-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="budget-field">
            <label htmlFor="reset-pass1">{t.resetNewPass}</label>
            <input
              id="reset-pass1"
              type="password"
              required
              value={pass1}
              onChange={(e) => setPass1(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="budget-field">
            <label htmlFor="reset-pass2">{t.resetConfirm}</label>
            <input
              id="reset-pass2"
              type="password"
              required
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="budget-actions">
            <button type="button" className="btn-budget-skip" onClick={onClose}>
              {t.cancel}
            </button>
            <button type="submit" className="btn-budget-yes">
              {t.resetSubmit}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}