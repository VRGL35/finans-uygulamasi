import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { translations } from "../utils/translations";

export default function YapayZekaAsistani({ transactions, lang = "tr" }) {
  const [mesaj, setMesaj] = useState("");
  const [displayedText, setDisplayedText] = useState("");

  const t = translations[lang] || translations.tr;
  const A = t.assistant || translations.tr.assistant; // eski translations'a karşı emniyet
  const locale = lang === "tr" ? "tr-TR" : "en-US";

  useEffect(() => {
    const safeTx = Array.isArray(transactions) ? transactions : [];

    if (safeTx.length === 0) {
      setMesaj(A.idle);
      return;
    }

    const expenses = safeTx.filter((tx) => tx.type === "expense");
    const incomes = safeTx.filter((tx) => tx.type === "income");

    const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const totalIncome = incomes.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    const categoryTotals = {};
    expenses.forEach((tx) => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + Number(tx.amount || 0);
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
      analiz += A.critical;
    } else if (totalIncome > totalExpense * 1.5 && totalExpense > 0) {
      analiz += A.savings;
    } else if (totalIncome > 0) {
      analiz += A.stable;
    } else {
      analiz += A.waitingIncome;
    }

    if (maxCategory && totalExpense > 0) {
      const catName = t.categories[maxCategory] || maxCategory;
      analiz += A.leakage
        .replace("{category}", catName)
        .replace("{amount}", maxAmount.toLocaleString(locale));
    }

    setMesaj(analiz);
  }, [transactions, lang]);

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
      className="ai-assistant"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="ai-brain" aria-hidden="true">🧠</div>

      <div className="ai-content">
        <h4 className="ai-title">{A.title}</h4>
        <p className="ai-text">
          {displayedText}
          <span className="ai-cursor" aria-hidden="true" />
        </p>
      </div>
    </motion.div>
  );
}