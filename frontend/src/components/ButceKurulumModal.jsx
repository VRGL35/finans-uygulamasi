import { useState } from "react";
import { motion } from "framer-motion";
import { translations } from "../utils/translations";

const EXPENSE_CATEGORIES = ["market", "fatura", "ulasim", "diger"];

export default function ButceKurulumModal({ username, onComplete, lang = "tr" }) {
  const [step, setStep] = useState(1);
  const [limits, setLimits] = useState({ market: "", fatura: "", ulasim: "", diger: "" });

  const t = translations[lang] || translations.tr;

  const handleSkip = () => {
    localStorage.setItem(`budget_setup_completed_${username}`, "true");
    onComplete();
  };

  const handleStartSetup = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(`user_budgets_${username}`) || "{}");
      setLimits({
        market: saved.market ?? "",
        fatura: saved.fatura ?? "",
        ulasim: saved.ulasim ?? "",
        diger: saved.diger ?? ""
      });
    } catch (e) {
      // bozuk JSON — boş formla başla
    }
    setStep(2);
  };

  const handleSave = () => {
    const parsed = {};
    EXPENSE_CATEGORIES.forEach((cat) => {
      const val = parseFloat(limits[cat]);
      if (!isNaN(val) && val > 0) parsed[cat] = val;
    });

    localStorage.setItem(`user_budgets_${username}`, JSON.stringify(parsed));
    localStorage.setItem(`user_budgets_disabled_${username}`, "false");
    localStorage.setItem(`budget_setup_completed_${username}`, "true");
    onComplete();
  };

  return (
    <div className="modal-overlay">
      <motion.div
        className="budget-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t.budgetQuestion}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        {step === 1 && (
          <>
            <div className="modal-icon-box" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            </div>
            <h2 className="budget-title">{t.budgetQuestion}</h2>
            <p className="budget-desc">{t.budgetQuestionDesc}</p>

            <div className="budget-actions">
              <button type="button" className="btn-budget-skip" onClick={handleSkip}>
                {t.budgetNo}
              </button>
              <button type="button" className="btn-budget-yes" onClick={handleStartSetup}>
                {t.budgetYes}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="modal-icon-box" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="20" x2="23" y2="20"></line>
              </svg>
            </div>
            <h2 className="budget-title">{t.monthlyBudgets}</h2>
            <p className="budget-desc">{t.budgetStep2Desc}</p>

            <div className="budget-form">
              {EXPENSE_CATEGORIES.map((cat) => (
                <div className="budget-field" key={cat}>
                  <label htmlFor={`budget-${cat}`}>{t.categories[cat]}</label>
                  <input
                    id={`budget-${cat}`}
                    type="number"
                    min="0"
                    placeholder={t.budgetLimitPlaceholder}
                    value={limits[cat]}
                    onChange={(e) =>
                      setLimits((prev) => ({ ...prev, [cat]: e.target.value }))
                    }
                  />
                </div>
              ))}
            </div>

            <div className="budget-actions">
              <button type="button" className="btn-budget-skip" onClick={() => setStep(1)}>
                {t.cancel}
              </button>
              <button type="button" className="btn-budget-yes" onClick={handleSave}>
                {t.save}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}