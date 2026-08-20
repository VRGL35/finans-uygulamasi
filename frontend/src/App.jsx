import { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import "./App.css";
import HarcamaKarti from "./components/HarcamaKarti";
import HarcamaFormu from "./components/HarcamaFormu";
import BakiyeOzeti from "./components/BakiyeOzeti";
import YapayZekaAsistani from "./components/YapayZekaAsistani";
import ButceHedefleri from "./components/ButceHedefleri";
import FiltreAlani from "./components/FiltreAlani";
import RadyoPlayer from "./components/RadyoPlayer";
import GirisEkrani from "./components/GirisEkrani";
import TarihGostergesi from "./components/TarihGostergesi";
import MarketTicker from "./components/MarketTicker";
import IntroEkrani from "./components/IntroEkrani";

// Ağır modüller: sadece gerektiğinde yüklenir
const ThreeCanvas = lazy(() => import("./components/ThreeCanvas"));
const KategoriOzeti = lazy(() => import("./components/KategoriOzeti"));
const AylikEkstre = lazy(() => import("./components/AylikEkstre"));
const AyarlarModal = lazy(() => import("./components/AyarlarModal"));
const DilSecimModal = lazy(() => import("./components/DilSecimModal"));
const ButceKurulumModal = lazy(() => import("./components/ButceKurulumModal"));

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

  const tiltRef = useRef(null);
  const radyoRef = useRef(null);

  const [introState, setIntroState] = useState({ show: false, user: "", mode: "login" });

  const [transactions, setTransactions] = useState([]);
  const [rates, setRates] = useState({ USD: 34.25, EUR: 37.42, TRY: 1 });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);

  const t = translations[lang] || translations.tr;

  const categories = useMemo(() => [
    { id: "all", label: t.categories.all },
    { id: "market", label: t.categories.market },
    { id: "fatura", label: t.categories.fatura },
    { id: "ulasim", label: t.categories.ulasim },
    { id: "maas", label: t.categories.maas },
    { id: "diger", label: t.categories.diger }
  ], [t]);

  useEffect(() => {
    let raf;
    const handleMouseMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!tiltRef.current) return;
        const { innerWidth, innerHeight } = window;
        const normX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
        const normY = (e.clientY - innerHeight / 2) / (innerHeight / 2);

        tiltRef.current.style.transform = `translate3d(${normX * 3}px, 0, 0) rotateX(${-normY * 2.2}deg) rotateY(${normX * 2.5}deg)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  // Kur: hesaplamalar için 60 sn'de bir yenilenir (görsel ticker kendi kendine akar)
  useEffect(() => {
    let ignore = false;
    const load = () => {
      getExchangeRates().then((r) => {
        if (r && !ignore) setRates(r);
      });
    };
    load();
    const interval = setInterval(load, 60000);
    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    if (currentUser) {
      const savedLang = localStorage.getItem(`user_lang_${currentUser}`) || "tr";
      const savedTheme = localStorage.getItem(`user_theme_${currentUser}`) || "midnight";
      const savedAssistant = localStorage.getItem(`user_assistant_${currentUser}`);

      setLang(savedLang);
      setTheme(savedTheme);
      setShowAssistant(savedAssistant !== "false");

      getTransactions(currentUser)
        .then((data) => {
          if (!ignore) setTransactions(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          if (!ignore) {
            console.error("Veri çekme hatası:", err);
            setTransactions([]);
            toast.error(t.loadFailed);
          }
        });

      const isLangConfigured = localStorage.getItem(`lang_setup_completed_${currentUser}`);
      const isBudgetConfigured = localStorage.getItem(`budget_setup_completed_${currentUser}`);

      if (!isLangConfigured) {
        setShowLangModal(true);
      } else if (!isBudgetConfigured) {
        setShowBudgetModal(true);
      }
    }

    return () => {
      ignore = true;
    };
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
    toast.success(t.welcomeUser.replace("{user}", user), { icon: "🚀" });
  };

  const handleLogout = () => {
    playFuturisticChime();
    radyoRef.current?.stopAudio();
    setIntroState({ show: true, user: currentUser, mode: "logout" });
  };

  const handleIntroFinish = useCallback(() => {
    const { mode, user } = introState;

    if (mode === "login") {
      const isLangConfigured = localStorage.getItem(`lang_setup_completed_${user}`);
      const isBudgetConfigured = localStorage.getItem(`budget_setup_completed_${user}`);

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

    setIntroState({ show: false, user: "", mode: "login" });
  }, [introState]);

  const handleSelectLanguage = (selectedLang) => {
    setLang(selectedLang);
    if (currentUser) {
      localStorage.setItem(`user_lang_${currentUser}`, selectedLang);
      localStorage.setItem(`lang_setup_completed_${currentUser}`, "true");
    }
    setShowLangModal(false);
    toast.success((translations[selectedLang] || translations.tr).langUpdated);

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
    toast.success((translations[newLang] || translations.tr).settingsSaved);
  };

  const handleClearAllData = async () => {
    try {
      await clearUserTransactions(currentUser);
      setTransactions([]);
      setEditingTransaction(null);
      setShowSettingsModal(false);
      setBudgetTrigger((prev) => prev + 1);
      toast.success(t.dataCleared);
    } catch (err) {
      toast.error(t.dataClearFailed);
    }
  };

  const handleBudgetModalComplete = () => {
    setShowBudgetModal(false);
    setBudgetTrigger((prev) => prev + 1);
    toast.success(t.budgetsSet);
  };

  const handleAddTransaction = async (newTx) => {
    playClickSound();
    try {
      const payload = { ...newTx, username: currentUser };
      const savedTx = await addTransaction(payload);
      setTransactions((prev) => [savedTx, ...prev]);
      toast.success(t.txAdded);
    } catch (err) {
      toast.error(t.txAddFailed);
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
      toast.success(t.txDeleted);
    } catch (err) {
      toast.error(t.txDeleteFailed);
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
      toast.success(t.txUpdated);
    } catch (err) {
      toast.error(t.txUpdateFailed);
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

  const safeTransactions = useMemo(
    () => (Array.isArray(transactions) ? transactions : []),
    [transactions]
  );

  const filteredTransactions = useMemo(() => {
    return safeTransactions.filter((item) => {
      const safeTitle = item.title || "";
      const safeCategory = item.category || "";
      const safeDate = item.date || "";
      const safeSearch = searchTerm || "";

      const matchesSearch = safeTitle.toLowerCase().includes(safeSearch.toLowerCase());
      const matchesCategory = selectedCategory === "all" || safeCategory === selectedCategory;
      const matchesStartDate = !startDate || safeDate >= startDate;
      const matchesEndDate = !endDate || safeDate <= endDate;

      return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
    });
  }, [safeTransactions, searchTerm, selectedCategory, startDate, endDate]);

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const income = safeTransactions
      .filter((tx) => tx.type === "income")
      .reduce((acc, tx) => acc + convertToTRY(tx.amount || 0, tx.currency || "TRY", rates), 0);

    const expense = safeTransactions
      .filter((tx) => tx.type === "expense")
      .reduce((acc, tx) => acc + convertToTRY(tx.amount || 0, tx.currency || "TRY", rates), 0);

    return { totalIncome: income, totalExpense: expense, balance: income - expense };
  }, [safeTransactions, rates]);

  return (
    <div className="app-root" data-theme={theme}>
      <Toaster
        position="bottom-right"
        containerStyle={{ bottom: 40, right: 32 }}
        toastOptions={{ className: "custom-toast" }}
      />

      {introState.show && <IntroEkrani username={introState.user} mode={introState.mode} onFinish={handleIntroFinish} lang={lang} />}

      <Suspense fallback={null}>
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
        {showBudgetModal && !showLangModal && !introState.show && currentUser && (
          <ButceKurulumModal username={currentUser} onComplete={handleBudgetModalComplete} lang={lang} />
        )}
      </Suspense>

      <Suspense fallback={null}>
        <ThreeCanvas />
      </Suspense>
      <RadyoPlayer ref={radyoRef} isUserLoggedIn={Boolean(currentUser)} />

      <div ref={tiltRef} className={`app-content${introState.show ? " intro-hidden" : ""}`}>
        {!currentUser ? (
          <GirisEkrani onLogin={handleLogin} lang={lang} />
        ) : (
          <div className="dashboard-shell">

            <motion.div
              className="topbar"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="topbar-user">
                <div className="avatar-badge">👤</div>
                <div>
                  <span className="user-meta-label">{t.loggedInAs}</span>
                  <strong className="user-meta-name">@{currentUser}</strong>
                </div>
              </div>

              <MarketTicker lang={lang} baseRates={rates} />

              <div className="topbar-actions">
                <button
                  type="button"
                  className="btn btn-settings"
                  onClick={() => { playClickSound(); setShowSettingsModal(true); }}
                >
                  <span>⚙️</span><span>{t.settings}</span>
                </button>
                <button type="button" className="btn btn-logout" onClick={handleLogout}>
                  {t.logout}
                </button>
              </div>
            </motion.div>

            <div className="dashboard-grid">

              <motion.div
                className="left-col custom-tx-scroll"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
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
                      <YapayZekaAsistani transactions={safeTransactions} lang={lang} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <HarcamaFormu onAddTransaction={handleAddTransaction} editingTransaction={editingTransaction} onUpdateTransaction={handleUpdateTransaction} onCancelEdit={handleCancelEdit} lang={lang} />
                <ButceHedefleri transactions={safeTransactions} rates={rates} currentUser={currentUser} budgetTrigger={budgetTrigger} lang={lang} />
                <Suspense fallback={<div className="glass-card skeleton-card" />}>
                  <KategoriOzeti transactions={safeTransactions} lang={lang} />
                </Suspense>
              </motion.div>

              <motion.div
                className="right-col"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Suspense fallback={<div className="glass-card skeleton-card" />}>
                  <AylikEkstre transactions={safeTransactions} currentUser={currentUser} lang={lang} />
                </Suspense>
                <FiltreAlani
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={(cat) => { playClickSound(); setSelectedCategory(cat); }}
                  onClearFilters={handleClearFilters}
                  categories={categories}
                  lang={lang}
                />

                <div className="tx-panel">
                  <div className="tx-panel-header">
                    <h3 className="tx-panel-title">
                      {t.recentTransactions} ({filteredTransactions.length})
                    </h3>
                  </div>

                  <div className="tx-list custom-tx-scroll">
                    {filteredTransactions.length === 0 ? (
                      <p className="tx-empty">{t.noTransactions}</p>
                    ) : (
                      <AnimatePresence>
                        {filteredTransactions.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: -50 }}
                            layout
                            transition={{ duration: 0.2 }}
                          >
                            <HarcamaKarti transaction={item} rates={rates} onDelete={handleDeleteTransaction} onEdit={handleStartEdit} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="footer-center">
              <TarihGostergesi lang={lang} />
            </div>
          </div>
        )}
      </div>

      <div className="watermark">
        <span>@vrgl</span>
      </div>
    </div>
  );
}