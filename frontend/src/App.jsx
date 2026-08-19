import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import HarcamaKarti from "./components/HarcamaKarti";
import HarcamaFormu from "./components/HarcamaFormu";
import BakiyeOzeti from "./components/BakiyeOzeti";
import YapayZekaAsistani from "./components/YapayZekaAsistani";
import ButceHedefleri from "./components/ButceHedefleri";
import ButceKurulumModal from "./components/ButceKurulumModal";
import DilSecimModal from "./components/DilSecimModal";
import AyarlarModal from "./components/AyarlarModal";
import FiltreAlani from "./components/FiltreAlani";
import RadyoPlayer from "./components/RadyoPlayer";
import GirisEkrani from "./components/GirisEkrani";
import TarihGostergesi from "./components/TarihGostergesi";
import KategoriOzeti from "./components/KategoriOzeti";
import AylikEkstre from "./components/AylikEkstre";
import ThreeCanvas from "./components/ThreeCanvas";
import IntroEkrani from "./components/IntroEkrani";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
  clearUserTransactions
} from "./services/api";
import { getExchangeRates, convertToTRY } from "./services/currencyService";
import { playClickSound, playFuturisticChime } from "./utils/soundUtils";
import { translations } from "./utils/translations";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem("active_user") || sessionStorage.getItem("active_user") || null;
  });

  const [lang, setLang] = useState("tr");
  const [theme, setTheme] = useState("midnight");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  
  const [showAssistant, setShowAssistant] = useState(true);
  
  const [budgetTrigger, setBudgetTrigger] = useState(0);

  const [tilt, setTilt] = useState({ rx: 0, ry: 0, tx: 0 });
  const radyoRef = useRef(null);

  const [introState, setIntroState] = useState({ show: false, user: "", mode: "login" });

  const [transactions, setTransactions] = useState([]);
  const [rates, setRates] = useState({ USD: 34.25, EUR: 37.42, TRY: 1 });
  const [rateTrend, setRateTrend] = useState({ USD: "up", EUR: "up" });
  const [isFlashing, setIsFlashing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);

  const t = translations[lang] || translations.tr;

  const categories = [
    { id: "all", label: t.categories.all },
    { id: "market", label: t.categories.market },
    { id: "fatura", label: t.categories.fatura },
    { id: "ulasim", label: t.categories.ulasim },
    { id: "maas", label: t.categories.maas },
    { id: "diger", label: t.categories.diger }
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const normY = (e.clientY - innerHeight / 2) / (innerHeight / 2);

      setTilt({
        rx: -normY * 2.2,
        ry: normX * 2.5,
        tx: normX * 3
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    getExchangeRates().then((initialRates) => {
      if (initialRates) setRates(initialRates);
    });

    const interval = setInterval(() => {
      setRates((prev) => {
        const deltaUSD = Math.random() * 0.04 - 0.018;
        const deltaEUR = Math.random() * 0.04 - 0.018;
        const newUSD = Math.max(1, Number((prev.USD + deltaUSD).toFixed(3)));
        const newEUR = Math.max(1, Number((prev.EUR + deltaEUR).toFixed(3)));

        setRateTrend({
          USD: deltaUSD >= 0 ? "up" : "down",
          EUR: deltaEUR >= 0 ? "up" : "down"
        });

        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 500);

        return { USD: newUSD, EUR: newEUR, TRY: 1 };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentUser) {
      const savedLang = localStorage.getItem(`user_lang_${currentUser}`) || "tr";
      const savedTheme = localStorage.getItem(`user_theme_${currentUser}`) || "midnight";
      const savedAssistant = localStorage.getItem(`user_assistant_${currentUser}`);
      
      setLang(savedLang);
      setTheme(savedTheme);
      setShowAssistant(savedAssistant !== "false");

      getTransactions(currentUser)
        .then((data) => {
          setTransactions(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.error("Veri çekme hatası:", err);
          setTransactions([]); 
        });

      const isLangConfigured = localStorage.getItem(`lang_setup_completed_${currentUser}`);
      const isBudgetConfigured = localStorage.getItem(`budget_setup_completed_${currentUser}`);

      if (!isLangConfigured) {
        setShowLangModal(true);
      } else if (!isBudgetConfigured) {
        setShowBudgetModal(true);
      }
    }
  }, [currentUser]);

  const handleLogin = (user, rememberMe = true) => {
    playFuturisticChime();
    radyoRef.current?.playAudio();

    setCurrentUser(user);
    if (rememberMe) {
      localStorage.setItem("active_user", user);
    } else {
      sessionStorage.setItem("active_user", user);
      localStorage.removeItem("active_user");
    }

    setIntroState({ show: true, user: user, mode: "login" });
    toast.success(lang === "tr" ? `Hoş geldin, ${user}!` : `Welcome back, ${user}!`, { icon: '🚀' });
  };

  const handleLogout = () => {
    playFuturisticChime();
    radyoRef.current?.stopAudio();
    setIntroState({ show: true, user: currentUser, mode: "logout" });
  };

  const handleIntroFinish = useCallback(() => {
    setIntroState((prevState) => {
      if (prevState.mode === "login") {
        const isLangConfigured = localStorage.getItem(`lang_setup_completed_${prevState.user}`);
        const isBudgetConfigured = localStorage.getItem(`budget_setup_completed_${prevState.user}`);

        if (!isLangConfigured) {
          setShowLangModal(true);
        } else if (!isBudgetConfigured) {
          setShowBudgetModal(true);
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem("active_user");
        sessionStorage.removeItem("active_user");
        setTransactions([]);
        setEditingTransaction(null);
        setShowSettingsModal(false);
        setShowLangModal(false);
        setShowBudgetModal(false);
      }
      return { show: false, user: "", mode: "login" };
    });
  }, []);

  const handleSelectLanguage = (selectedLang) => {
    setLang(selectedLang);
    if (currentUser) {
      localStorage.setItem(`user_lang_${currentUser}`, selectedLang);
      localStorage.setItem(`lang_setup_completed_${currentUser}`, "true");
    }
    setShowLangModal(false);
    toast.success(selectedLang === "tr" ? "Dil güncellendi!" : "Language updated!");

    const isBudgetConfigured = localStorage.getItem(`budget_setup_completed_${currentUser}`);
    if (!isBudgetConfigured) {
      setShowBudgetModal(true);
    }
  };

  const handleSaveSettings = (newLang, newTheme, newShowAssistant) => {
    setLang(newLang);
    setTheme(newTheme);
    setShowAssistant(newShowAssistant);
    setShowSettingsModal(false);
    
    if (currentUser) {
      localStorage.setItem(`user_lang_${currentUser}`, newLang);
      localStorage.setItem(`user_theme_${currentUser}`, newTheme);
      localStorage.setItem(`user_assistant_${currentUser}`, newShowAssistant ? "true" : "false");
    }
    toast.success(newLang === "tr" ? "Ayarlar kaydedildi." : "Settings saved.");
  };

  const handleClearAllData = async () => {
    try {
      await clearUserTransactions(currentUser);
      setTransactions([]);
      setEditingTransaction(null);
      setShowSettingsModal(false);
      setBudgetTrigger((prev) => prev + 1);
      toast.success(lang === "tr" ? "Tüm veriler sıfırlandı." : "All data cleared.");
    } catch (err) {
      toast.error(lang === "tr" ? "Sıfırlama başarısız oldu." : "Failed to reset data.");
    }
  };

  const handleBudgetModalComplete = () => {
    setShowBudgetModal(false);
    setBudgetTrigger((prev) => prev + 1);
    toast.success(lang === "tr" ? "Bütçe hedefleri kuruldu." : "Budget goals set.");
  };

  const handleAddTransaction = async (newTx) => {
    playClickSound();
    try {
      const payload = { ...newTx, username: currentUser };
      const savedTx = await addTransaction(payload);
      setTransactions((prev) => [savedTx, ...prev]);
      toast.success(lang === "tr" ? "İşlem başarıyla eklendi!" : "Transaction added!");
    } catch (err) {
      toast.error(lang === "tr" ? "Harcama eklenirken hata oluştu." : "Error adding transaction.");
    }
  };

  const handleDeleteTransaction = async (id) => {
    playClickSound();
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      if (editingTransaction?.id === id) {
        setEditingTransaction(null);
      }
      toast.success(lang === "tr" ? "Kayıt silindi." : "Record deleted.");
    } catch (err) {
      toast.error(lang === "tr" ? "Silme başarısız." : "Delete failed.");
    }
  };

  const handleStartEdit = (tx) => {
    playClickSound();
    setEditingTransaction(tx);
  };

  const handleUpdateTransaction = async (updatedTx) => {
    playClickSound();
    try {
      const savedTx = await updateTransaction(updatedTx.id, { ...updatedTx, username: currentUser });
      setTransactions((prev) =>
        prev.map((item) => (item.id === savedTx.id ? savedTx : item))
      );
      setEditingTransaction(null);
      toast.success(lang === "tr" ? "İşlem güncellendi." : "Transaction updated.");
    } catch (err) {
      toast.error(lang === "tr" ? "Güncelleme başarısız." : "Update failed.");
    }
  };

  const handleCancelEdit = () => {
    playClickSound();
    setEditingTransaction(null);
  };

  const handleClearFilters = () => {
    playClickSound();
    setSearchTerm("");
    setSelectedCategory("all");
    setStartDate("");
    setEndDate("");
  };

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const filteredTransactions = safeTransactions.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesStartDate = !startDate || item.date >= startDate;
    const matchesEndDate = !endDate || item.date <= endDate;
    return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
  });

  const totalIncome = safeTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + convertToTRY(t.amount, t.currency || "TRY", rates), 0);

  const totalExpense = safeTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + convertToTRY(t.amount, t.currency || "TRY", rates), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div
      data-theme={theme}
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        boxSizing: "border-box",
        backgroundColor: "transparent",
        color: "var(--text-main)",
        paddingTop: "32px",
        paddingBottom: "16px",
        position: "relative",
        perspective: "1200px",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Toaster
        position="bottom-right"
        containerStyle={{ bottom: 40, right: 32 }}
        toastOptions={{
          style: {
            background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--accent)',
            backdropFilter: 'blur(10px)', fontSize: '13px', fontWeight: '600', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          },
        }}
      />

      <style>
        {`
          .custom-tx-scroll::-webkit-scrollbar { width: 8px; }
          .custom-tx-scroll::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 4px; margin: 4px; }
          .custom-tx-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 4px; }
          .custom-tx-scroll::-webkit-scrollbar-thumb:hover { background: var(--accent); }
          @media (max-width: 900px) { .dashboard-grid { grid-template-columns: 1fr !important; overflow-y: auto !important; height: auto !important; } }
        `}
      </style>

      {introState.show && <IntroEkrani username={introState.user} mode={introState.mode} onFinish={handleIntroFinish} />}
      
      {showSettingsModal && (
        <AyarlarModal 
          currentLang={lang} 
          currentTheme={theme} 
          currentShowAssistant={showAssistant} 
          onSave={handleSaveSettings} 
          onClose={() => setShowSettingsModal(false)} 
          username={currentUser || "guest"} 
          onClearAllData={handleClearAllData} 
        />
      )}
      
      {showLangModal && !introState.show && currentUser && <DilSecimModal onSelectLanguage={handleSelectLanguage} />}
      {showBudgetModal && !showLangModal && !introState.show && currentUser && <ButceKurulumModal username={currentUser} onComplete={handleBudgetModalComplete} lang={lang} />}

      <ThreeCanvas />
      <RadyoPlayer ref={radyoRef} isUserLoggedIn={Boolean(currentUser)} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          opacity: introState.show ? 0 : 1,
          pointerEvents: introState.show ? "none" : "auto",
          transition: "opacity 0.3s ease",
          transform: `translate3d(${tilt.tx}px, 0, 0) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          willChange: "transform",
          flex: 1, 
          display: "flex", 
          flexDirection: "column",
          minHeight: 0
        }}
      >
        {!currentUser ? (
          <GirisEkrani onLogin={handleLogin} />
        ) : (
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 28px", width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                backgroundColor: "var(--bg-card)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                padding: "16px 24px", borderRadius: "20px", marginBottom: "20px", flexShrink: 0,
                border: "1px solid var(--border-color)", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)", flexWrap: "wrap", gap: "12px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "50%", backgroundColor: "var(--bg-input)", border: "1px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", boxShadow: "0 0 15px var(--accent-glow)" }}>👤</div>
                <div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", letterSpacing: "0.5px" }}>{t.loggedInAs}</span>
                  <strong style={{ color: "var(--accent)", fontSize: "15px", letterSpacing: "0.5px" }}>@{currentUser}</strong>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "8px 18px", borderRadius: "12px", backgroundColor: "rgba(0,0,0,0.25)", border: isFlashing ? "1px solid var(--accent)" : "1px solid var(--border-color)", boxShadow: isFlashing ? "0 0 16px var(--accent-glow)" : "inset 0 2px 4px rgba(0,0,0,0.1)", transition: "all 0.3s ease" }}>
                <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: "600", letterSpacing: "0.5px" }}>{t.liveMarket}:</span>
                <span style={{ color: rateTrend.USD === "up" ? "#34d399" : "#f87171", fontSize: "13px", fontWeight: "700" }}>1 $ = {rates.USD.toFixed(2)} ₺ {rateTrend.USD === "up" ? "▲" : "▼"}</span>
                <span style={{ color: rateTrend.EUR === "up" ? "#34d399" : "#f87171", fontSize: "13px", fontWeight: "700" }}>1 € = {rates.EUR.toFixed(2)} ₺ {rateTrend.EUR === "up" ? "▲" : "▼"}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button type="button" onClick={() => { playClickSound(); setShowSettingsModal(true); }} style={{ backgroundColor: "rgba(56, 189, 248, 0.1)", color: "var(--accent)", border: "1px solid var(--accent)", padding: "8px 16px", borderRadius: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s ease" }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "var(--accent)"; e.currentTarget.style.color = "#000"; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.1)"; e.currentTarget.style.color = "var(--accent)"; }}>
                  <span>⚙️</span><span>{t.settings}</span>
                </button>
                <button type="button" onClick={handleLogout} style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#f87171", border: "1px solid #ef4444", padding: "8px 16px", borderRadius: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease" }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#ef4444"; e.currentTarget.style.color = "#fff"; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)"; e.currentTarget.style.color = "#f87171"; }}>
                  {t.logout}
                </button>
              </div>
            </motion.div>

            <div className="dashboard-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", flex: 1, minHeight: 0 }}>
              
              <motion.div 
                className="custom-tx-scroll"
                initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                style={{ display: "flex", flexDirection: "column", gap: "24px", overflowY: "auto", paddingRight: "8px", height: "100%" }}
              >
                <BakiyeOzeti balance={balance} totalIncome={totalIncome} totalExpense={totalExpense} lang={lang} />
                
                <AnimatePresence>
                  {showAssistant && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.3 }}
                    >
                      <YapayZekaAsistani transactions={safeTransactions} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <HarcamaFormu onAddTransaction={handleAddTransaction} editingTransaction={editingTransaction} onUpdateTransaction={handleUpdateTransaction} onCancelEdit={handleCancelEdit} lang={lang} />
                <ButceHedefleri transactions={safeTransactions} rates={rates} currentUser={currentUser} budgetTrigger={budgetTrigger} lang={lang} />
                <KategoriOzeti transactions={safeTransactions} lang={lang} />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                style={{ display: "flex", flexDirection: "column", gap: "20px", height: "100%", minHeight: 0 }}
              >
                <AylikEkstre transactions={safeTransactions} currentUser={currentUser} lang={lang} />
                <FiltreAlani searchTerm={searchTerm} setSearchTerm={setSearchTerm} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} selectedCategory={selectedCategory} setSelectedCategory={(cat) => { playClickSound(); setSelectedCategory(cat); }} onClearFilters={handleClearFilters} categories={categories} lang={lang} />

                <div style={{ backgroundColor: "var(--bg-card)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid var(--border-color)", borderRadius: "24px", padding: "24px", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexShrink: 0 }}>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-main)", margin: 0, letterSpacing: "0.5px" }}>
                      {t.recentTransactions} ({filteredTransactions.length})
                    </h3>
                  </div>

                  <div className="custom-tx-scroll" style={{ display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto", flex: 1, minHeight: 0, paddingRight: "8px" }}>
                    {filteredTransactions.length === 0 ? (
                      <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px", fontSize: "13px", margin: "auto 0" }}>{t.noTransactions}</p>
                    ) : (
                      <AnimatePresence>
                        {filteredTransactions.map((item) => (
                          <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, x: -50 }} layout transition={{ duration: 0.2 }}>
                            <HarcamaKarti transaction={item} rates={rates} onDelete={handleDeleteTransaction} onEdit={handleStartEdit} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            <div style={{ marginTop: "16px", width: "100%", display: "flex", justifyContent: "center", flexShrink: 0 }}>
              <TarihGostergesi lang={lang} />
            </div>
          </div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: "24px", right: "32px", zIndex: 90, pointerEvents: "none", userSelect: "none" }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "1.5px" }}>@vrgl</span>
      </div>
    </div>
  );
}