export default function FiltreAlani({
  searchTerm,
  setSearchTerm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedCategory,
  setSelectedCategory,
  onClearFilters,
  categories = [],
  lang = "tr"
}) {
  const isEn = lang === "en";

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        padding: "16px",
        borderRadius: "14px",
        border: "1px solid var(--border-color)",
        marginBottom: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        transition: "all 0.3s ease"
      }}
    >
      <input
        type="text"
        placeholder={isEn ? "Search transactions..." : "İşlem ara..."}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ flex: 1 }}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                backgroundColor: isSelected ? "var(--primary-btn)" : "var(--bg-input)",
                color: isSelected ? "#ffffff" : "var(--text-muted)",
                border: isSelected ? "1px solid var(--accent)" : "1px solid var(--border-color)",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: isSelected ? "600" : "normal",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {(searchTerm || startDate || endDate || selectedCategory !== "all") && (
        <button
          type="button"
          onClick={onClearFilters}
          style={{
            backgroundColor: "transparent",
            color: "#f87171",
            border: "1px dashed #ef4444",
            padding: "6px",
            borderRadius: "6px",
            fontSize: "11px",
            cursor: "pointer"
          }}
        >
          {isEn ? "Clear Filters ✕" : "Filtreleri Temizle ✕"}
        </button>
      )}
    </div>
  );
}