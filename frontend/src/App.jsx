import { useState } from "react";
import { initialTransactions } from "./data/mockData";
import HarcamaKarti from "./components/HarcamaKarti";
import HarcamaFormu from "./components/HarcamaFormu";
import BakiyeOzeti from "./components/BakiyeOzeti";
import FiltreAlani from "./components/FiltreAlani";

const CATEGORIES = [
  { id: "all", label: "Tümü" },
  { id: "market", label: "Market" },
  { id: "fatura", label: "Fatura" },
  { id: "ulasim", label: "Ulaşım" },
  { id: "maas", label: "Maaş" },
  { id: "diger", label: "Diğer" }
];

function App() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Ekleme, Silme ve Güncelleme İşlemleri
  const handleAddTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    if (editingTransaction?.id === id) {
      setEditingTransaction(null);
    }
  };

  const handleStartEdit = (tx) => {
    setEditingTransaction(tx);
  };

  const handleUpdateTransaction = (updatedTx) => {
    setTransactions((prev) =>
      prev.map((item) => (item.id === updatedTx.id ? updatedTx : item))
    );
    setEditingTransaction(null);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setStartDate("");
    setEndDate("");
  };

  // Filtreleme Hesaplaması
  const filteredTransactions = transactions.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesStartDate = !startDate || item.date >= startDate;
    const matchesEndDate = !endDate || item.date <= endDate;

    return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
  });

  // Finansal Özet Hesaplamaları
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

        {/* Bakiye Kartı Bileşeni */}
        <BakiyeOzeti balance={balance} totalIncome={totalIncome} totalExpense={totalExpense} />

        {/* Harcama Formu Bileşeni */}
        <HarcamaFormu
          onAddTransaction={handleAddTransaction}
          editingTransaction={editingTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          onCancelEdit={handleCancelEdit}
        />

        {/* Filtreleme ve Arama Bileşeni */}
        <FiltreAlani
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onClearFilters={handleClearFilters}
          categories={CATEGORIES}
        />

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