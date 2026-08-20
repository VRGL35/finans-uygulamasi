import { useState, useEffect } from "react";
import { convertToTRY } from "../services/currencyService";
import { playClickSound, playFuturisticChime } from "../utils/soundUtils";
import { translations } from "../utils/translations";

const CATEGORY_ICONS = { market: "🛒", fatura: "📄", ulasim: "🚌", diger: "📦" };
const DEFAULT_BUDGETS = { market: 5000, fatura: 3000, ulasim: 1500, diger: 2000 };

const readBudgets = (user) => {
  try {
    const saved = JSON.parse(localStorage.getItem(`user_budgets_${user}`) || "null");
    return saved && typeof saved === "object" ? { ...DEFAULT_BUDGETS, ...saved } : DEFAULT_BUDGETS;
  } catch (e) {
    return DEFAULT_BUDGETS;
  }
};

export default function ButceHedefleri({
  transactions,
  rates,
  currentUser,
  budgetTrigger,
  lang = "tr"
}) {
  const t = translations[lang] || translations.tr;
  const locale = lang === "en" ? "en-US" : "tr-TR";

  const [budgets, setBudgets] = useState(() => readBudgets(currentUser));
  const [isDisabled, setIsDisabled] = useState(() => {
    return localStorage.getItem(`user_budgets_disabled_${currentUser}`) === "true";
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState(budgets);

  useEffect(() => {
    const initial = readBudgets(currentUser);
    setBudgets(initial);
    setEditValues(initial);
    setIsDisabled(localStorage.getItem(`user_budgets_disabled_${currentUser}`) === "true");
  }, [currentUser, budgetTrigger]);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthlyCategoryExpenses = (Array.isArray(transactions) ? transactions : [])
    .filter((tx) => tx.type === "expense" && tx.date && tx.date.startsWith(currentMonth))
    .reduce((acc, tx) => {
      const cat = tx.category || "diger";
      acc[cat] = (acc[cat] || 0) + convertToTRY(tx.amount || 0, tx.currency || "TRY", rates);
      return acc;
    }, {});

  const handleSave = () => {
    playClickSound();
    setBudgets(editValues);
    localStorage.setItem(`user_budgets_${currentUser}`, JSON.stringify(editValues));
    localStorage.setItem(`user_budgets_disabled_${currentUser}`, "false");
    setIsDisabled(false);
    setIsEditing(false);
  };

  const handleDisableBudgets = () => {
    playFuturisticChime();
    setIsDisabled(true);
    localStorage.setItem(`user_budgets_disabled_${currentUser}`, "true");
    setIsEditing(false);
  };

  const handleEnableBudgets = () => {
    playFuturisticChime();
    setIsDisabled(false);
    localStorage.setItem(`user_budgets_disabled_${currentUser}`, "false");
  };

  if (isDisabled) {
    return (
      <div className="budget-panel disabled">
        <span className="budget-disabled-text">{t.budgetsDisabled}</span>
        <button type="button" className="btn-budget-enable" onClick={handleEnableBudgets}>
          {t.enableBudgets}
        </button>
      </div>
    );
  }

  return (
    <div className="budget-panel">
      <div className="budget-header">
        <div className="budget-header-title">
          <span aria-hidden="true">🎯</span>
          <h3>{t.monthlyBudgets}</h3>
        </div>

        <button
          type="button"
          className={`btn-budget-edit ${isEditing ? "editing" : ""}`}
          onClick={() => {
            playClickSound();
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? t.close : t.setLimits}
        </button>
      </div>

      {isEditing ? (
        <div className="budget-edit-list">
          {Object.keys(CATEGORY_ICONS).map((key) => (
            <div className="budget-edit-row" key={key}>
              <span className="budget-edit-label">
                {CATEGORY_ICONS[key]} {t.categories[key]} {t.budgetLimitLabel}
              </span>
              <input
                className="budget-edit-input"
                type="number"
                min="0"
                value={editValues[key] || 0}
                onChange={(e) =>
                  setEditValues({ ...editValues, [key]: Number(e.target.value) })
                }
                aria-label={`${t.categories[key]} ${t.budgetLimitLabel}`}
              />
            </div>
          ))}

          <div className="budget-edit-actions">
            <button type="button" className="btn-budget-save" onClick={handleSave}>
              {t.save}
            </button>
            <button type="button" className="btn-budget-disable" onClick={handleDisableBudgets}>
              {t.disableBudgets}
            </button>
          </div>
        </div>
      ) : (
        <div className="budget-list">
          {Object.keys(CATEGORY_ICONS).map((key) => {
            const spent = monthlyCategoryExpenses[key] || 0;
            const limit = budgets[key] || 1;
            const percentage = Math.round((spent / limit) * 100);

            let statusColor = "var(--accent)";
            let statusText = "";

            if (percentage >= 100) {
              statusColor = "#ef4444";
              statusText = t.limitExceeded;
            } else if (percentage >= 75) {
              statusColor = "#f59e0b";
              statusText = t.limitApproaching;
            }

            return (
              <div key={key}>
                <div className="budget-row-header">
                  <span className="budget-cat">
                    {CATEGORY_ICONS[key]} {t.categories[key]}{" "}
                    {statusText && (
                      <span className="budget-status" style={{ color: statusColor }}>
                        {statusText}
                      </span>
                    )}
                  </span>
                  <span className="budget-nums">
                    <strong style={{ color: statusColor }}>
                      {spent.toLocaleString(locale, { maximumFractionDigits: 0 })} TL
                    </strong>{" "}
                    / {limit.toLocaleString(locale)} TL ({percentage}%)
                  </span>
                </div>

                <div className="budget-track">
                  <div
                    className="budget-fill"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: statusColor,
                      boxShadow: percentage >= 100 ? "0 0 8px rgba(239, 68, 68, 0.8)" : "none"
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}