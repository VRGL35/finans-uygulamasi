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
            <div className="budget-emoji" aria-hidden="true">🎯</div>
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
            <div className="budget-emoji" aria-hidden="true">⚙️</div>
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