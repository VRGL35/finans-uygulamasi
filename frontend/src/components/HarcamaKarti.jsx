import { convertToTRY } from "../services/currencyService";

export default function HarcamaKarti({ transaction, rates, onDelete, onEdit }) {
  const isIncome = transaction.type === "income";
  const amountTRY = convertToTRY(transaction.amount, transaction.currency || "TRY", rates);

  return (
    <div className={`tx-card ${isIncome ? "income" : "expense"}`}>
      <div>
        <h4 className="tx-card-title">{transaction.title}</h4>
        <span className="tx-card-meta">
          {transaction.category} • {transaction.date}
        </span>
      </div>

      <div className="tx-card-right">
        <div className="tx-card-amount-wrap">
          <strong className={`tx-card-amount ${isIncome ? "income" : "expense"}`}>
            {isIncome ? "+" : "-"}{transaction.amount} {transaction.currency || "TRY"}
          </strong>
          {transaction.currency && transaction.currency !== "TRY" && (
            <span className="tx-card-approx">
              ≈ {amountTRY.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} TL
            </span>
          )}
        </div>

        <button
          type="button"
          className="tx-card-btn edit"
          onClick={() => onEdit(transaction)}
          title="Düzenle"
          aria-label="Düzenle"
        >
          ✏️
        </button>

        <button
          type="button"
          className="tx-card-btn delete"
          onClick={() => onDelete(transaction.id)}
          title="Sil"
          aria-label="Sil"
        >
          ✕
        </button>
      </div>
    </div>
  );
}