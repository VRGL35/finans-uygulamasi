export default function BakiyeOzeti({ balance, totalIncome, totalExpense, lang = "tr" }) {
  const isPositive = balance >= 0;
  const locale = lang === "tr" ? "tr-TR" : "en-US";

  return (
    <div className="glass-card balance-card">
      <div>
        <h2 className="balance-label">
          {lang === "tr" ? "Toplam Bakiye" : "Total Balance"}
        </h2>
        <div className={`balance-value ${isPositive ? "positive" : "negative"}`}>
          {balance.toLocaleString(locale, { maximumFractionDigits: 0 })}
          <span className="balance-currency">₺</span>
        </div>
      </div>

      <div
        className={`balance-divider ${isPositive ? "positive" : "negative"}`}
        aria-hidden="true"
      />

      <div className="balance-stats">
        <div className="stat-box income">
          <span className="stat-label">
            ↗ {lang === "tr" ? "Toplam Gelir" : "Total Income"}
          </span>
          <span className="stat-value">
            +{totalIncome.toLocaleString(locale, { maximumFractionDigits: 0 })} TL
          </span>
        </div>

        <div className="stat-box expense">
          <span className="stat-label">
            ↘ {lang === "tr" ? "Toplam Gider" : "Total Expense"}
          </span>
          <span className="stat-value">
            -{totalExpense.toLocaleString(locale, { maximumFractionDigits: 0 })} TL
          </span>
        </div>
      </div>
    </div>
  );
}