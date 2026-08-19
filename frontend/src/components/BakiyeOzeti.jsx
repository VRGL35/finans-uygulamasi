export default function BakiyeOzeti({ balance, totalIncome, totalExpense, lang = "tr" }) {
  const isPositive = balance >= 0;

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid var(--border-color)",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        flexShrink: 0, /* İŞTE SIKIŞMAYI ENGELLEYEN SİHİRLİ KOD */
        boxSizing: "border-box"
      }}
    >
      <div>
        <h2 style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "1.5px", margin: "0 0 12px 0", textTransform: "uppercase" }}>
          {lang === "tr" ? "Toplam Bakiye" : "Total Balance"}
        </h2>
        <div style={{ fontSize: "36px", fontWeight: "800", color: isPositive ? "#34d399" : "#f87171", display: "flex", alignItems: "baseline", gap: "4px" }}>
          {balance.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          <span style={{ fontSize: "20px", fontWeight: "600" }}>₺</span>
        </div>
      </div>

      <div style={{ height: "2px", width: "100%", backgroundColor: isPositive ? "rgba(52, 211, 153, 0.2)" : "rgba(248, 113, 113, 0.2)", borderRadius: "2px" }} />

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {/* Gelir Kutusu */}
        <div style={{ flex: 1, minWidth: "120px", backgroundColor: "rgba(52, 211, 153, 0.05)", border: "1px solid rgba(52, 211, 153, 0.1)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "#34d399", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
            ↗ {lang === "tr" ? "Toplam Gelir" : "Total Income"}
          </span>
          <span style={{ fontSize: "16px", color: "#34d399", fontWeight: "700" }}>
            +{totalIncome.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", { maximumFractionDigits: 0 })} TL
          </span>
        </div>

        {/* Gider Kutusu */}
        <div style={{ flex: 1, minWidth: "120px", backgroundColor: "rgba(248, 113, 113, 0.05)", border: "1px solid rgba(248, 113, 113, 0.1)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "#f87171", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
            ↘ {lang === "tr" ? "Toplam Gider" : "Total Expense"}
          </span>
          <span style={{ fontSize: "16px", color: "#f87171", fontWeight: "700" }}>
            -{totalExpense.toLocaleString(lang === "tr" ? "tr-TR" : "en-US", { maximumFractionDigits: 0 })} TL
          </span>
        </div>
      </div>
    </div>
  );
}