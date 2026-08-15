const categoryIcons = {
  market: "🛒",
  maas: "💰",
  fatura: "⚡",
  ulasim: "🚌",
  diger: "📌"
};

export default function HarcamaKarti({ transaction, onDelete, onEdit }) {
  const isIncome = transaction.type === "income";
  const icon = categoryIcons[transaction.category] || categoryIcons.diger;

  const cardStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 18px",
    margin: "10px 0",
    borderRadius: "12px",
    backgroundColor: "#1e293b",
    borderLeft: `5px solid ${isIncome ? "#22c55e" : "#ef4444"}`,
    color: "#ffffff"
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "24px" }}>{icon}</span>
        <div>
          <h4 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>{transaction.title}</h4>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            {transaction.category.toUpperCase()} • {transaction.date}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ fontWeight: "700", fontSize: "16px", color: isIncome ? "#22c55e" : "#ef4444" }}>
          {isIncome ? "+" : "-"}{transaction.amount.toLocaleString("tr-TR")} TL
        </div>

        {/* Düzenle Butonu */}
        <button
          type="button"
          onClick={() => onEdit(transaction)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: "15px",
            padding: "6px",
            borderRadius: "4px"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#38bdf8";
            e.currentTarget.style.backgroundColor = "#334155";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="Düzenle"
        >
          ✏️
        </button>

        {/* Sil Butonu */}
        <button
          type="button"
          onClick={() => onDelete(transaction.id)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: "18px",
            lineHeight: 1,
            padding: "6px",
            borderRadius: "4px"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ef4444";
            e.currentTarget.style.backgroundColor = "#334155";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="Kaydı Sil"
        >
          ✕
        </button>
      </div>
    </div>
  );
}