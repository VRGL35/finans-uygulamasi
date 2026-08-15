import { useState } from "react";
import { initialTransactions } from "./data/mockData";
import HarcamaKarti from "./components/HarcamaKarti";

function App() {
  const [transactions] = useState(initialTransactions);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", padding: "30px 16px" }}>
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Finans Takip</h2>

        {/* Bakiye ve Özet Kutuları */}
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

        {/* Harcama Listesi */}
        <h3 style={{ fontSize: "16px", color: "#cbd5e1", marginBottom: "12px" }}>Son İşlemler</h3>
        <div>
          {transactions.map((item) => (
            <HarcamaKarti key={item.id} transaction={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;