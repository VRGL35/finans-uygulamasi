export default function KategoriOzeti({ transactions }) {
  const expenses = transactions.filter((t) => t.type === "expense");
  const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);

  const categoryTotals = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  if (totalExpense === 0) return null;

  const categoryNames = {
    market: "Market",
    fatura: "Fatura",
    ulasim: "Ulaşım",
    diger: "Diğer"
  };

  return (
    <div style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "12px", marginBottom: "20px" }}>
      <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#cbd5e1" }}>Harcama Dağılımı (Giderler)</h4>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {Object.entries(categoryTotals).map(([catKey, amount]) => {
          const percent = Math.round((amount / totalExpense) * 100);
          return (
            <div key={catKey}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                <span>{categoryNames[catKey] || catKey}</span>
                <span style={{ color: "#94a3b8" }}>{amount.toLocaleString("tr-TR")} TL (%{percent})</span>
              </div>
              <div style={{ height: "6px", backgroundColor: "#0f172a", borderRadius: "3px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${percent}%`,
                    backgroundColor: "#ef4444",
                    borderRadius: "3px"
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}