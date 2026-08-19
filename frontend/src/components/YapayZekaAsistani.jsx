import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function YapayZekaAsistani({ transactions }) {
  const [mesaj, setMesaj] = useState("");
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (transactions.length === 0) {
      setMesaj("Sistem beklemede. Veri setini oluşturmak için lütfen harcama girmeye başla...");
      return;
    }

    const expenses = transactions.filter(t => t.type === "expense");
    const incomes = transactions.filter(t => t.type === "income");

    const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalIncome = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);

    const categoryTotals = {};
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
    });

    let maxCategory = "";
    let maxAmount = 0;
    for (const [cat, amount] of Object.entries(categoryTotals)) {
      if (amount > maxAmount) {
        maxAmount = amount;
        maxCategory = cat;
      }
    }

    let analiz = "";

    if (totalExpense > totalIncome && totalIncome > 0) {
      analiz += "Kritik Uyarı: Harcamaların, nakit akışını aşmış durumda. Likiditeyi korumak için kemerleri sıkmalıyız. ";
    } else if (totalIncome > totalExpense * 1.5 && totalExpense > 0) {
      analiz += "Muazzam bir tasarruf oranına ulaştın! Bu nakit fazlalığını enflasyona karşı korumak için portföyünde değerlendirmeyi düşünebilirsin. ";
    } else if (totalIncome > 0) {
      analiz += "Nakit akışın stabil ve bütçen şu an dengede görünüyor. ";
    } else {
      analiz += "Sistem analizi için gelir kalemi bekleniyor. ";
    }

    if (maxCategory && totalExpense > 0) {
      const catNames = { market: "Market", fatura: "Fatura", ulasim: "Ulaşım", maas: "Maaş", diger: "Diğer" };
      analiz += `Bütçendeki en büyük sızıntı "${catNames[maxCategory] || maxCategory}" kalemi (${maxAmount} TL). Bu kategoriyi optimize edersen kâr marjın yükselecektir.`;
    }

    setMesaj(analiz);
  }, [transactions]);

  useEffect(() => {
    if (!mesaj) return;
    
    let i = 0;
    setDisplayedText("");
    
    const timer = setInterval(() => {
      i++;
      setDisplayedText(mesaj.slice(0, i)); 
      
      if (i >= mesaj.length) {
        clearInterval(timer);
      }
    }, 25);
    
    return () => clearInterval(timer);
  }, [mesaj]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        backgroundColor: "rgba(52, 211, 153, 0.05)",
        border: "1px solid rgba(52, 211, 153, 0.3)",
        borderRadius: "20px",
        padding: "20px",
        display: "flex",
        gap: "16px",
        alignItems: "flex-start",
        boxShadow: "0 8px 32px rgba(52, 211, 153, 0.1)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0
      }}
    >
      <div style={{ fontSize: "28px", filter: "drop-shadow(0 0 10px rgba(52,211,153,0.8))", flexShrink: 0 }}>
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
          🧠
        </motion.div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}> {/* minWidth: 0 metnin esnek yapıda alt satıra inmesini zorunlu kılar */}
        <h4 style={{ margin: "0 0 8px 0", color: "#34d399", fontSize: "13px", fontWeight: "800", letterSpacing: "1.5px" }}>
          SİSTEM ASİSTANI AKTİF
        </h4>
        <p style={{ 
          margin: 0, 
          fontSize: "14px", 
          color: "var(--text-main)", 
          lineHeight: "1.6", 
          minHeight: "44px",
          wordWrap: "break-word", 
          whiteSpace: "normal" 
        }}>
          {displayedText}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            style={{ display: "inline-block", width: "8px", height: "14px", backgroundColor: "#34d399", marginLeft: "4px", verticalAlign: "middle" }}
          />
        </p>
      </div>
    </motion.div>
  );
}