import { exportToPDF, exportToExcel } from "../utils/exportUtils";
import { playClickSound } from "../utils/soundUtils";

export default function AylikEkstre({ transactions, currentUser, lang }) {
  
  const handleExport = (type) => {
    playClickSound();
    if (type === 'pdf') exportToPDF(transactions, currentUser);
    else exportToExcel(transactions, currentUser);
  };

  return (
    <div style={{
      backgroundColor: "var(--bg-card)",
      backdropFilter: "blur(16px)",
      border: "1px solid var(--border-color)",
      borderRadius: "24px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    }}>
      <h3 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-main)", margin: 0 }}>
        {lang === 'tr' ? 'Aylık Ekstre ve Rapor Al' : 'Monthly Statement & Report'}
      </h3>
      
      <div style={{ display: "flex", gap: "10px" }}>
        <button 
          onClick={() => handleExport('pdf')}
          style={{ flex: 1, padding: "10px", borderRadius: "12px", border: "1px solid var(--accent)", background: "transparent", color: "var(--accent)", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
        >
          PDF İndir
        </button>
        <button 
          onClick={() => handleExport('excel')}
          style={{ flex: 1, padding: "10px", borderRadius: "12px", border: "1px solid #34d399", background: "transparent", color: "#34d399", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
        >
          Excel İndir
        </button>
      </div>
    </div>
  );
}