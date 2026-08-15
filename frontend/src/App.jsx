import { useState } from "react";
import { initialTransactions } from "./data/mockData";
import HarcamaKarti from "./components/HarcamaKarti";
import HarcamaFormu from "./components/HarcamaFormu";

function App() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Ekleme
  const handleAddTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Silme
  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    if (editingTransaction?.id === id) {
      setEditingTransaction(null);
    }
  };

  // Düzenleme Başlatma
  const handleStartEdit = (tx) => {
    setEditingTransaction(tx);
  };

  // Düzenlemeyi Kaydetme
  const handleUpdateTransaction = (updatedTx) => {
    setTransactions((prev) =>
      prev.map((item) => (item.id === updatedTx.id ? updatedTx : item))
    );
    setEditingTransaction(null);
  };

  // Düzenlemeyi İptal Etme
  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const filteredTransactions = transactions.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const categories = [
    { id: "all", label: "Tümü" },
    { id: "market", label: "Market" },
    { id: "fatura", label: "Fatura" },
    { id: "ulasim", label: "Ulaşım" },
    { id: "maas", label: "Maaş" },
    { id: "diger", label: "Diğer" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", padding: "30px 16px" }}>
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Finans Takip</h2>

        {/* Bakiye Özeti */}
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

        {/* Form Alanı (Ekleme / Güncelleme) */}
        <HarcamaFormu
          onAddTransaction={handleAddTransaction}
          editingTransaction={editingTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          onCancelEdit={handleCancelEdit}
        />

        {/* Filtreleme ve Arama */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="İşlem ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #334155",
              backgroundColor: "#1e293b",
              color: "#ffffff",
              boxSizing: "border-box",
              marginBottom: "12px"
            }}
          />

          <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "6px" }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: "none",
                  fontSize: "12px",
                  cursor: "pointer",
                  backgroundColor: selectedCategory === cat.id ? "#3b82f6" : "#1e293b",
                  color: selectedCategory === cat.id ? "#ffffff" : "#94a3b8",
                  whiteSpace: "nowrap"
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Harcama Listesi */}
        <h3 style={{ fontSize: "16px", color: "#cbd5e1", marginBottom: "12px" }}>
          Son İşlemler ({filteredTransactions.length})
        </h3>
        <div>
          {filteredTransactions.length === 0 ? (
            <p style={{ color: "#64748b", textAlign: "center", padding: "20px" }}>
              Eşleşen işlem bulunamadı.
            </p>
          ) : (
            filteredTransactions.map((item) => (
              <HarcamaKarti
                key={item.id}
                transaction={item}
                onDelete={handleDeleteTransaction}
                onEdit={handleStartEdit}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;