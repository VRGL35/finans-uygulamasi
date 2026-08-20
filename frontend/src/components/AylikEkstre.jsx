import { useState } from "react";
import { exportToPDF, exportToExcel } from "../utils/exportUtils";
import { playClickSound } from "../utils/soundUtils";
import { translations } from "../utils/translations";

export default function AylikEkstre({ transactions, currentUser, lang = "tr" }) {
  const t = translations[lang] || translations.tr;
  const [busy, setBusy] = useState(null);

  const handleExport = async (type) => {
    playClickSound();
    setBusy(type);
    try {
      if (type === "pdf") {
        await exportToPDF(transactions, currentUser, lang);
      } else {
        await exportToExcel(transactions, currentUser, lang);
      }
    } catch (err) {
      console.error("Export hatası:", err);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="glass-card">
      <h3 className="card-title">{t.monthlyStatement}</h3>

      <div className="ekstre-buttons">
        <button
          type="button"
          className="btn-export pdf"
          disabled={busy !== null}
          onClick={() => handleExport("pdf")}
        >
          {busy === "pdf" ? "⏳" : `📄 ${lang === "tr" ? "PDF İndir" : "Download PDF"}`}
        </button>
        <button
          type="button"
          className="btn-export excel"
          disabled={busy !== null}
          onClick={() => handleExport("excel")}
        >
          {busy === "excel" ? "⏳" : `📊 ${lang === "tr" ? "Excel İndir" : "Download Excel"}`}
        </button>
      </div>
    </div>
  );
}