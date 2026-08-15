export default function BakiyeOzeti({ balance, totalIncome, totalExpense }) {
  return (
    <div style={{ backgroundColor: "#1e293b", borderRadius: "12px", padding: "20px", marginBottom: "24px", textAlign: "center" }}>
      <span style={{ color: "#94a3b8", fontSize: "14px" }}>Toplam Bakiye</span>
      <h1 style={{ margin: "8px 0 16px 0", color: balance >= 0 ? "#22c55e" : "#ef4444" }}>
        {balance.toLocaleString("tr-TR")} TL
      </h1>

      <div style={{ display: "flex", justifyContent: "space-around", borderTop: "1px solid #334155", paddingTop: "12px" }}>
        <div>
          <span style={{ color: "#94a3b8", fontSize: "12px" }}>Gelir</span>
          <div style={{ color: "#22c55e", fontWeight: "bold", fontSize: "15px" }}>
            +{totalIncome.toLocaleString("tr-TR")} TL
          </div>
        </div>
        <div>
          <span style={{ color: "#94a3b8", fontSize: "12px" }}>Gider</span>
          <div style={{ color: "#ef4444", fontWeight: "bold", fontSize: "15px" }}>
            -{totalExpense.toLocaleString("tr-TR")} TL
          </div>
        </div>
      </div>
    </div>
  );
}