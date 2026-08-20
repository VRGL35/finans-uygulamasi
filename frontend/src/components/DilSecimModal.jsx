import { motion } from "framer-motion";

export default function DilSecimModal({ onSelectLanguage }) {
  return (
    <div className="modal-overlay">
      <motion.div
        className="budget-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Dil Seçimi / Select Language"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <div className="modal-icon-box" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>

        <h2 className="budget-title">Dil Seçimi / Select Language</h2>
        <p className="budget-desc">
          Lütfen devam etmek için bir dil seçin. / Please choose a language to continue.
        </p>

        <div className="lang-buttons">
          <button type="button" className="btn-lang" onClick={() => onSelectLanguage("tr")}>
            <span aria-hidden="true">🇹🇷</span> Türkçe
          </button>

          <button type="button" className="btn-lang" onClick={() => onSelectLanguage("en")}>
            <span aria-hidden="true">🇬🇧</span> English
          </button>
        </div>
      </motion.div>
    </div>
  );
}