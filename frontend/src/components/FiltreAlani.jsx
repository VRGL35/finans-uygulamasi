import { translations } from "../utils/translations";

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
  const t = translations[lang] || translations.tr;

  const hasActiveFilter =
    searchTerm || startDate || endDate || selectedCategory !== "all";

  return (
    <div className="filter-panel">
      <input
        type="text"
        placeholder={t.searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="filter-date-row">
        <input
          className="flex-1"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          className="flex-1"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="filter-chips">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`chip ${isSelected ? "active" : ""}`}
              aria-pressed={isSelected}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {hasActiveFilter && (
        <button
          type="button"
          className="btn-clear-filters"
          onClick={onClearFilters}
        >
          {t.clearFilters}
        </button>
      )}
    </div>
  );
}