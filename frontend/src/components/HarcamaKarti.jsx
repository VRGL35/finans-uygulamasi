import { convertToTRY } from "../services/currencyService";

export default function HarcamaKarti({ transaction, rates, onDelete, onEdit }) {
  const isIncome = transaction.type === "income";
  const amountTRY = convertToTRY(transaction.amount, transaction.currency || "TRY", rates);

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderLeft: `4px solid ${isIncome ? "#10b981" : "#ef4444"}`,
        padding: "14px 18px",
        borderRadius: "14px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease"
      }}
    >
      <div>
        <h4 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-main)", margin: "0 0 4px 0" }}>
          {transaction.title}
        </h4>
        <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {transaction.category} • {transaction.date}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ textAlign: "right" }}>
          <strong
            style={{
              fontSize: "15px",
              color: isIncome ? "#34d399" : "#f87171",
              display: "block"
            }}
          >
            {isIncome ? "+" : "-"}{transaction.amount} {transaction.currency || "TRY"}
          </strong>
          {transaction.currency && transaction.currency !== "TRY" && (
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              ≈ {amountTRY.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} TL
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onEdit(transaction)}
          style={{
            background: "none",
            border: "none",
            color: "var(--accent)",
            cursor: "pointer",
            fontSize: "15px",
            padding: "4px"
          }}
          title="Düzenle"
        >
          ✏️
        </button>

        <button
          type="button"
          onClick={() => onDelete(transaction.id)}
          style={{
            background: "none",
            border: "none",
            color: "#f87171",
            cursor: "pointer",
            fontSize: "15px",
            padding: "4px"
          }}
          title="Sil"
        >
          ✕
        </button>
      </div>
    </div>
  );
}