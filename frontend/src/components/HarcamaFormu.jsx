import { useState } from "react";

export default function HarcamaFormu({ onAddTransaction }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("market");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Lütfen bir başlık girin.");
      return;
    }
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError("Lütfen 0'dan büyük geçerli bir tutar girin.");
      return;
    }

    setError("");

    const newTransaction = {
      id: Date.now(),
      title: title.trim(),
      amount: numericAmount,
      type,
      category,
      date: new Date().toISOString().split("T")[0]
    };

    onAddTransaction(newTransaction);

    setTitle("");
    setAmount("");
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    boxSizing: "border-box",
    marginBottom: "10px"
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px", marginBottom: "24px" }}>
      <h3 style={{ margin: "0 0 14px 0", fontSize: "16px", color: "#cbd5e1" }}>Yeni İşlem Ekle</h3>
      
      {error && <div style={{ color: "#ef4444", fontSize: "13px", marginBottom: "10px" }}>{error}</div>}

      <input
        type="text"
        placeholder="Başlık (örn. Market, Fatura)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={inputStyle}
      />

      <input
        type="number"
        placeholder="Tutar (TL)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={inputStyle}
      />

      <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
        <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
          <option value="expense">Gider</option>
          <option value="income">Gelir</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
          <option value="market">Market</option>
          <option value="fatura">Fatura</option>
          <option value="ulasim">Ulaşım</option>
          <option value="maas">Maaş</option>
          <option value="diger">Diğer</option>
        </select>
      </div>

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Ekle
      </button>
    </form>
  );
}