import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function KategoriOzeti({ transactions, lang = "tr" }) {
  const isTr = lang === "tr";


  const expenses = transactions.filter(t => t.type === "expense");

  const data = [
    { name: isTr ? "Market" : "Grocery", value: expenses.filter(t => t.category === "market").reduce((acc, curr) => acc + Number(curr.amount), 0), color: "#38bdf8" },
    { name: isTr ? "Fatura" : "Bills", value: expenses.filter(t => t.category === "fatura").reduce((acc, curr) => acc + Number(curr.amount), 0), color: "#c084fc" },
    { name: isTr ? "Ulaşım" : "Transport", value: expenses.filter(t => t.category === "ulasim").reduce((acc, curr) => acc + Number(curr.amount), 0), color: "#34d399" },
    { name: isTr ? "Diğer" : "Other", value: expenses.filter(t => t.category === "diger").reduce((acc, curr) => acc + Number(curr.amount), 0), color: "#f472b6" }
  ].filter(item => item.value > 0); 

  const totalExpense = data.reduce((acc, curr) => acc + curr.value, 0);

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
      }}
    >
      <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-main)", marginTop: 0, marginBottom: "16px", letterSpacing: "0.5px" }}>
        {isTr ? "Harcama Dağılımı" : "Expense Breakdown"}
      </h3>

      {totalExpense === 0 ? (
        <p style={{ color: "var(--text-muted)", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
          {isTr ? "Henüz bir gider kaydı yok." : "No expenses recorded yet."}
        </p>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Halka Grafik */}
          <div style={{ width: "120px", height: "120px", position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={55}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 6px ${entry.color})` }} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(15,23,42,0.9)", border: "1px solid var(--border-color)", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                  itemStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* İlerleme Çubukları (Legend) */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
            {data.map((item, index) => (
              <div key={index}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                  <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>{item.name}</span>
                  <span style={{ color: item.color, fontWeight: "700" }}>%{Math.round((item.value / totalExpense) * 100)}</span>
                </div>
                <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ width: `${(item.value / totalExpense) * 100}%`, height: "100%", backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}