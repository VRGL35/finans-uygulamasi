import { useState, useEffect, useRef } from "react";
import { playClickSound } from "../utils/soundUtils";

function CustomSelect({ value, onChange, options, style = {} }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div ref={dropdownRef} style={{ position: "relative", ...style }}>
      <div
        onClick={() => {
          playClickSound();
          setOpen(!open);
        }}
        style={{
          backgroundColor: "var(--bg-input)",
          border: open ? "1px solid var(--accent)" : "1px solid var(--border-color)",
          boxShadow: open ? "0 0 10px var(--accent-glow)" : "none",
          borderRadius: open ? "10px 10px 0 0" : "10px",
          color: "var(--text-main)",
          padding: "10px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          transition: "border-color 0.2s, box-shadow 0.2s"
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: "600" }}>{selectedOption?.label}</span>
        <span
          style={{
            fontSize: "10px",
            color: "var(--text-muted)",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s"
          }}
        >
          ▼
        </span>
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#0b1329", // Kesinlikle şeffaf olmayan katı koyu renk
            border: "1px solid var(--accent)",
            borderTop: "none",
            borderRadius: "0 0 10px 10px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.95)",
            zIndex: 9999,
            overflow: "hidden"
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  playClickSound();
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  padding: "10px 14px",
                  fontSize: "13px",
                  fontWeight: isSelected ? "700" : "500",
                  color: isSelected ? "var(--accent)" : "var(--text-main)",
                  backgroundColor: isSelected ? "rgba(0, 150, 255, 0.15)" : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "background 0.15s"
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span>{opt.label}</span>
                {isSelected && <span style={{ fontSize: "12px" }}>✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function HarcamaFormu({
  onAddTransaction,
  editingTransaction,
  onUpdateTransaction,
  onCancelEdit,
  lang = "tr"
}) {
  const isEn = lang === "en";

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [currency, setCurrency] = useState("TRY");
  const [category, setCategory] = useState("market");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount);
      setType(editingTransaction.type);
      setCurrency(editingTransaction.currency || "TRY");
      setCategory(editingTransaction.category || "market");
      setDate(editingTransaction.date || new Date().toISOString().slice(0, 10));
    } else {
      setTitle("");
      setAmount("");
      setType("expense");
      setCurrency("TRY");
      setCategory("market");
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [editingTransaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    const txData = {
      title,
      amount: parseFloat(amount),
      type,
      currency,
      category,
      date
    };

    if (editingTransaction) {
      onUpdateTransaction({ ...txData, id: editingTransaction.id });
    } else {
      onAddTransaction(txData);
    }

    if (!editingTransaction) {
      setTitle("");
      setAmount("");
    }
  };

  const currencyOptions = [
    { value: "TRY", label: "₺ TRY" },
    { value: "USD", label: "$ USD" },
    { value: "EUR", label: "€ EUR" }
  ];

  const typeOptions = [
    { value: "expense", label: isEn ? "Expense" : "Gider" },
    { value: "income", label: isEn ? "Income" : "Gelir" }
  ];

  const categoryOptions = [
    { value: "market", label: isEn ? "Groceries" : "Market" },
    { value: "fatura", label: isEn ? "Bills" : "Fatura" },
    { value: "ulasim", label: isEn ? "Transport" : "Ulaşım" },
    { value: "maas", label: isEn ? "Salary" : "Maaş" },
    { value: "diger", label: isEn ? "Other" : "Diğer" }
  ];

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "var(--bg-card)",
        padding: "18px 20px",
        borderRadius: "16px",
        border: "1px solid var(--border-color)",
        marginBottom: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "all 0.3s ease"
      }}
    >
      <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-main)", margin: 0 }}>
        {editingTransaction
          ? isEn ? "Edit Transaction" : "İşlemi Düzenle"
          : isEn ? "Add New Transaction" : "Yeni İşlem Ekle"}
      </h3>

      <input
        type="text"
        placeholder={isEn ? "Title (e.g. Groceries, Salary, Steam)" : "Başlık (örn. Market, Maaş, Steam)"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="number"
          placeholder={isEn ? "Amount" : "Tutar"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{ flex: 2 }}
        />
        <CustomSelect
          value={currency}
          onChange={setCurrency}
          options={currencyOptions}
          style={{ flex: 1 }}
        />
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <CustomSelect
          value={type}
          onChange={setType}
          options={typeOptions}
          style={{ flex: 1 }}
        />
        <CustomSelect
          value={category}
          onChange={setCategory}
          options={categoryOptions}
          style={{ flex: 1 }}
        />
      </div>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
        <button
          type="submit"
          style={{
            flex: 1,
            backgroundColor: "var(--primary-btn)",
            color: "#ffffff",
            border: "1px solid var(--accent)",
            boxShadow: "0 0 15px var(--accent-glow)",
            padding: "12px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          {editingTransaction
            ? isEn ? "Update" : "Güncelle"
            : isEn ? "Add" : "Ekle"}
        </button>

        {editingTransaction && (
          <button
            type="button"
            onClick={onCancelEdit}
            style={{
              backgroundColor: "var(--border-color)",
              color: "var(--text-main)",
              border: "none",
              padding: "12px 18px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            {isEn ? "Cancel" : "İptal"}
          </button>
        )}
      </div>
    </form>
  );
}