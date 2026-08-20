import { exportToPDF, exportToExcel } from "../utils/exportUtils";
import { playClickSound } from "../utils/soundUtils";

export default function AylikEkstre({ transactions, currentUser, lang = "tr" }) {
  const isTr = lang === "tr";

  const handleExport = (type) => {
    playClickSound();
    if (type === "pdf") {
      exportToPDF(transactions, currentUser, lang);
    } else {
      exportToExcel(transactions, currentUser, lang);
    }
  };

  return (
    <div className="glass-card">
      <h3 className="card-title">
        {isTr ? "Aylık Ekstre ve Rapor Al" : "Monthly Statement & Report"}
      </h3>

      <div className="ekstre-buttons">
        <button
          type="button"
          className="btn-export pdf"
          onClick={() => handleExport("pdf")}
          aria-label={isTr ? "PDF olarak indir" : "Download as PDF"}
        >
          📄 {isTr ? "PDF İndir" : "Download PDF"}
        </button>
        <button
          type="button"
          className="btn-export excel"
          onClick={() => handleExport("excel")}
          aria-label={isTr ? "Excel olarak indir" : "Download as Excel"}
        >
          📊 {isTr ? "Excel İndir" : "Download Excel"}
        </button>
      </div>
    </div>
  );
}