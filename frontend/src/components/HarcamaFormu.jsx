import { useState, useEffect, useRef } from "react";
import { playClickSound } from "../utils/soundUtils";

function CustomSelect({ value, onChange, options, className = "" }) {
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
    <div ref={dropdownRef} className={`select-wrap ${open ? "open" : ""} ${className}`}>
      <div
        className="select-trigger"
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          playClickSound();
          setOpen(!open);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            playClickSound();
            setOpen(!open);
          }
        }}
      >
        <span>{selectedOption?.label}</span>
        <span className="select-arrow">▼</span>
      </div>

      {open && (
        <div className="select-dropdown" role="listbox">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                className={`select-option ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  playClickSound();
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <span>{opt.label}</span>
                {isSelected && <span className="select-check">✓</span>}
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
    <form className="tx-form" onSubmit={handleSubmit}>
      <h3 className="tx-form-title">
        {editingTransaction
          ? (isEn ? "Edit Transaction" : "İşlemi Düzenle")
          : (isEn ? "Add New Transaction" : "Yeni İşlem Ekle")}
      </h3>

      <input
        type="text"
        placeholder={isEn ? "Title (e.g. Groceries, Salary, Steam)" : "Başlık (örn. Market, Maaş, Steam)"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div className="tx-form-row">
        <input
          className="flex-2"
          type="number"
          placeholder={isEn ? "Amount" : "Tutar"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <CustomSelect
          value={currency}
          onChange={setCurrency}
          options={currencyOptions}
          className="flex-1"
        />
      </div>

      <div className="tx-form-row">
        <CustomSelect
          value={type}
          onChange={setType}
          options={typeOptions}
          className="flex-1"
        />
        <CustomSelect
          value={category}
          onChange={setCategory}
          options={categoryOptions}
          className="flex-1"
        />
      </div>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <div className="tx-form-actions">
        <button type="submit" className="btn-submit">
          {editingTransaction
            ? (isEn ? "Update" : "Güncelle")
            : (isEn ? "Add" : "Ekle")}
        </button>

        {editingTransaction && (
          <button type="button" className="btn-cancel" onClick={onCancelEdit}>
            {isEn ? "Cancel" : "İptal"}
          </button>
        )}
      </div>
    </form>
  );
}