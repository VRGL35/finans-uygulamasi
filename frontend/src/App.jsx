import { useState, useEffect } from "react";
import HarcamaKarti from "./components/HarcamaKarti";
import HarcamaFormu from "./components/HarcamaFormu";
import BakiyeOzeti from "./components/BakiyeOzeti";
import FiltreAlani from "./components/FiltreAlani";
import RadyoPlayer from "./components/RadyoPlayer";
import GirisEkrani from "./components/GirisEkrani";
import TarihGostergesi from "./components/TarihGostergesi";
import KategoriOzeti from "./components/KategoriOzeti";
import AylikEkstre from "./components/AylikEkstre";
import { getTransactions, addTransaction, deleteTransaction, updateTransaction } from "./services/api";

const CATEGORIES = [
  { id: "all", label: "Tümü" },
  { id: "market", label: "Market" },
  { id: "fatura", label: "Fatura" },
  { id: "ulasim", label: "Ulaşım" },
  { id: "maas", label: "Maaş" },
  { id: "diger", label: "Diğer" }
];

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem("active_user") || null;
  });

  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Kullanıcıya ait işlemleri JSON Server üzerinden al
  useEffect(() => {
    if (currentUser) {
      getTransactions(currentUser)
        .then((data) => setTransactions(data))
        .catch((err) => console.error(err));
    }
  }, [currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("active_user", user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("active_user");
    setTransactions([]);
    setEditingTransaction(null);
  };

  const handleAddTransaction = async (newTx) => {
    try {
      const payload = { ...newTx, username: currentUser };
      const savedTx = await addTransaction(payload);
      setTransactions((prev) => [savedTx, ...prev]);
    } catch (err) {
      alert("Harcama eklenirken bir hata oluştu.");
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      if (editingTransaction?.id === id) {
        setEditingTransaction(null);
      }
    } catch (err) {
      alert("Silme işlemi başarısız.");
    }
  };

  const handleStartEdit = (tx) => {
    setEditingTransaction(tx);
  };

  const handleUpdateTransaction = async (updatedTx) => {
    try {
      const savedTx = await updateTransaction(updatedTx.id, { ...updatedTx, username: currentUser });
      setTransactions((prev) =>
        prev.map((item) => (item.id === savedTx.id ? savedTx : item))
      );
      setEditingTransaction(null);
    } catch (err) {
      alert("Güncelleme işlemi başarısız.");
    }
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

  const filteredTransactions = transactions.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesStartDate = !startDate || item.date >= startDate;
    const matchesEndDate = !endDate || item.date <= endDate;
    return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
  });

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc" }}>
      <RadyoPlayer />

      {!currentUser ? (
        <GirisEkrani onLogin={handleLogin} />
      ) : (
        <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px 16px 40px 16px" }}>
          {/* Üst Başlık & Çıkış */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>Hoş geldin,</span>
              <h3 style={{ margin: 0, color: "#38bdf8" }}>@{currentUser}</h3>
            </div>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#334155",
                color: "#f8fafc",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              Çıkış Yap 🚪
            </button>
          </div>

          <BakiyeOzeti balance={balance} totalIncome={totalIncome} totalExpense={totalExpense} />

          {/* Aylık Ekstre Butonu ve Modal Ekranı */}
          <AylikEkstre transactions={transactions} currentUser={currentUser} />

          {/* Kategori Yüzdeleri */}
          <KategoriOzeti transactions={transactions} />

          <HarcamaFormu
            onAddTransaction={handleAddTransaction}
            editingTransaction={editingTransaction}
            onUpdateTransaction={handleUpdateTransaction}
            onCancelEdit={handleCancelEdit}
          />

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

          <TarihGostergesi />
        </div>
      )}
    </div>
  );
}

export default App;