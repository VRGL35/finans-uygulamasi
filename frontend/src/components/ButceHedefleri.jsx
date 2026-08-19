import { useState, useEffect } from "react";
import { convertToTRY } from "../services/currencyService";
import { playClickSound, playFuturisticChime } from "../utils/soundUtils";

export default function ButceHedefleri({
  transactions,
  rates,
  currentUser,
  budgetTrigger,
  lang = "tr"
}) {
  const isEn = lang === "en";

  const CATEGORY_NAMES = {
    market: { label: isEn ? "Groceries" : "Market", icon: "🛒" },
    fatura: { label: isEn ? "Bills" : "Fatura", icon: "📄" },
    ulasim: { label: isEn ? "Transport" : "Ulaşım", icon: "🚌" },
    diger: { label: isEn ? "Other" : "Diğer", icon: "📦" }
  };

  const DEFAULT_BUDGETS = { market: 5000, fatura: 3000, ulasim: 1500, diger: 2000 };

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem(`user_budgets_${currentUser}`);
    return saved ? JSON.parse(saved) : DEFAULT_BUDGETS;
  });

  const [isDisabled, setIsDisabled] = useState(() => {
    return localStorage.getItem(`user_budgets_disabled_${currentUser}`) === "true";
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState(budgets);

  useEffect(() => {
    const saved = localStorage.getItem(`user_budgets_${currentUser}`);
    const initial = saved ? JSON.parse(saved) : DEFAULT_BUDGETS;
    const disabledStatus = localStorage.getItem(`user_budgets_disabled_${currentUser}`) === "true";
    
    setBudgets(initial);
    setEditValues(initial);
    setIsDisabled(disabledStatus);
  }, [currentUser, budgetTrigger]);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthlyCategoryExpenses = transactions
    .filter((t) => t.type === "expense" && t.date && t.date.startsWith(currentMonth))
    .reduce((acc, t) => {
      const cat = t.category || "diger";
      const amountInTRY = convertToTRY(t.amount, t.currency || "TRY", rates);
      acc[cat] = (acc[cat] || 0) + amountInTRY;
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
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          padding: "12px 18px",
          borderRadius: "14px",
          border: "1px dashed var(--border-color)",
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.3s ease"
        }}
      >
        <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "500" }}>
          {isEn ? "Budget limit tracking is disabled." : "Bütçe limit takibi devre dışı bırakıldı."}
        </span>
        <button
          type="button"
          onClick={handleEnableBudgets}
          style={{
            backgroundColor: "var(--accent-glow)",
            color: "var(--accent)",
            border: "1px solid var(--accent)",
            padding: "6px 14px",
            borderRadius: "8px",
            fontSize: "11px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          {isEn ? "Enable Limits" : "Limitleri Tekrar Aç"}
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        padding: "16px",
        borderRadius: "14px",
        border: "1px solid var(--border-color)",
        marginBottom: "16px",
        transition: "all 0.3s ease"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}></span>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-main)", margin: 0 }}>
            {isEn ? "Monthly Budget Limits" : "Aylık Bütçe Hedefleri"}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => {
            playClickSound();
            setIsEditing(!isEditing);
          }}
          style={{
            backgroundColor: isEditing ? "var(--bg-input)" : "var(--accent-glow)",
            color: isEditing ? "var(--text-main)" : "var(--accent)",
            border: isEditing ? "1px solid var(--border-color)" : "1px solid var(--accent)",
            padding: "5px 12px",
            borderRadius: "6px",
            fontSize: "11px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          {isEditing
            ? isEn ? "Close" : "Kapat"
            : isEn ? "⚙️ Set Limits" : "⚙️ Limitleri Ayarla"}
        </button>
      </div>

      {isEditing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
          {Object.entries(CATEGORY_NAMES).map(([key, cat]) => (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <span style={{ fontSize: "12px", color: "var(--text-main)" }}>
                {cat.icon} {cat.label} {isEn ? "Limit (TL):" : "Limiti (TL):"}
              </span>
              <input
                type="number"
                value={editValues[key] || 0}
                onChange={(e) =>
                  setEditValues({ ...editValues, [key]: Number(e.target.value) })
                }
                style={{
                  width: "110px",
                  padding: "6px 8px",
                  fontSize: "12px",
                  textAlign: "right"
                }}
              />
            </div>
          ))}

          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={handleSave}
              style={{
                flex: 1,
                backgroundColor: "var(--primary-btn)",
                color: "#ffffff",
                border: "none",
                padding: "8px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              {isEn ? "Save" : "Kaydet"}
            </button>

            <button
              type="button"
              onClick={handleDisableBudgets}
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                color: "#f87171",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              {isEn ? "Disable Budget Limits ✕" : "Artık Limit Belirlemeyeceğim ✕"}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {Object.entries(CATEGORY_NAMES).map(([key, cat]) => {
            const spent = monthlyCategoryExpenses[key] || 0;
            const limit = budgets[key] || 1;
            const percentage = Math.round((spent / limit) * 100);

            let statusColor = "var(--accent)";
            let statusText = "";

            if (percentage >= 100) {
              statusColor = "#ef4444";
              statusText = isEn ? "🚨 Exceeded!" : "🚨 Aşıldı!";
            } else if (percentage >= 75) {
              statusColor = "#f59e0b";
              statusText = isEn ? "⚠️ Approaching" : "⚠️ Yaklaştı";
            }

            return (
              <div key={key}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    marginBottom: "4px"
                  }}
                >
                  <span style={{ color: "var(--text-main)" }}>
                    {cat.icon} {cat.label}{" "}
                    {statusText && (
                      <span style={{ color: statusColor, fontWeight: "600", fontSize: "11px" }}>
                        {statusText}
                      </span>
                    )}
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    <strong style={{ color: statusColor }}>
                      {spent.toLocaleString(isEn ? "en-US" : "tr-TR", { maximumFractionDigits: 0 })} TL
                    </strong>{" "}
                    / {limit.toLocaleString(isEn ? "en-US" : "tr-TR")} TL ({percentage}%)
                  </span>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "7px",
                    backgroundColor: "var(--bg-input)",
                    borderRadius: "4px",
                    overflow: "hidden",
                    border: "1px solid var(--border-color)"
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      height: "100%",
                      backgroundColor: statusColor,
                      boxShadow: percentage >= 100 ? "0 0 8px rgba(239, 68, 68, 0.8)" : "none",
                      borderRadius: "4px",
                      transition: "width 0.4s ease-out, background-color 0.3s"
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