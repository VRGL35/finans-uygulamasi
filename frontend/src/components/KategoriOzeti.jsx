import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function KategoriOzeti({ transactions, lang = "tr" }) {
  const isTr = lang === "tr";

  const { data, totalExpense } = useMemo(() => {
    const expenses = (transactions || []).filter((t) => t.type === "expense");

    const sum = (cat) =>
      expenses
        .filter((t) => t.category === cat)
        .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    const items = [
      { name: isTr ? "Market" : "Grocery", value: sum("market"), color: "#38bdf8" },
      { name: isTr ? "Fatura" : "Bills", value: sum("fatura"), color: "#c084fc" },
      { name: isTr ? "Ulaşım" : "Transport", value: sum("ulasim"), color: "#34d399" },
      { name: isTr ? "Diğer" : "Other", value: sum("diger"), color: "#f472b6" }
    ].filter((item) => item.value > 0);

    return {
      data: items,
      totalExpense: items.reduce((acc, curr) => acc + curr.value, 0)
    };
  }, [transactions, isTr]);

  return (
    <div className="glass-card">
      <h3 className="card-title">
        {isTr ? "Harcama Dağılımı" : "Expense Breakdown"}
      </h3>

      {totalExpense === 0 ? (
        <p className="kategori-empty">
          {isTr ? "Henüz bir gider kaydı yok." : "No expenses recorded yet."}
        </p>
      ) : (
        <div className="kategori-chart-row">
          <div
            className="kategori-donut"
            role="img"
            aria-label={isTr ? "Harcama dağılımı grafiği" : "Expense breakdown chart"}
          >
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
                  {data.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                      style={{ filter: `drop-shadow(0 0 6px ${entry.color})` }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    color: "var(--text-main)",
                    fontSize: "12px",
                    backdropFilter: "blur(10px)"
                  }}
                  itemStyle={{ color: "var(--text-main)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="kategori-legend">
            {data.map((item) => {
              const percent = Math.round((item.value / totalExpense) * 100);
              return (
                <div key={item.name}>
                  <div className="kategori-legend-header">
                    <span className="kategori-legend-name">{item.name}</span>
                    <span className="kategori-legend-percent" style={{ color: item.color }}>
                      %{percent}
                    </span>
                  </div>
                  <div className="kategori-bar-track">
                    <div
                      className="kategori-bar-fill"
                      style={{
                        width: `${(item.value / totalExpense) * 100}%`,
                        backgroundColor: item.color,
                        boxShadow: `0 0 8px ${item.color}`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}