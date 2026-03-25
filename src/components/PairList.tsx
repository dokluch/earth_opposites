import { useState, useMemo, useEffect, memo } from "react";
import type { AntipodalPair } from "../data/antipodalCities";

interface Props {
  pairs: AntipodalPair[];
  activePairId: number | null;
  onSelect: (pair: AntipodalPair) => void;
}

const PAGE_SIZE = 20;

export default memo(function PairList({
  pairs,
  activePairId,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pairs;
    return pairs.filter(
      (p) =>
        p.cityA.name.toLowerCase().includes(q) ||
        p.cityB.name.toLowerCase().includes(q) ||
        p.cityA.country.toLowerCase().includes(q) ||
        p.cityB.country.toLowerCase().includes(q),
    );
  }, [pairs, query]);

  // Reset visible count when search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="pair-list">
      <h3 className="pair-list-title">Antipodal City Pairs</h3>
      <p className="pair-list-subtitle">
        Cities on exact opposite sides of the Earth
      </p>
      <div className="pair-search-wrapper">
        <label htmlFor="pair-search" className="sr-only">
          Search by city or country
        </label>
        <input
          id="pair-search"
          className="pair-search"
          type="text"
          placeholder="Search by city or country…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <ul className="pair-list-items">
        {visible.map((p) => (
          <li key={p.id}>
            <button
              className={`pair-card ${activePairId === p.id ? "pair-card--active" : ""}`}
              onClick={() => onSelect(p)}
              aria-pressed={activePairId === p.id}
            >
              <span className="pair-card-cities">
                <span className="pair-city pair-city-a">{p.cityA.name}</span>
                <span className="pair-arrow">⟷</span>
                <span className="pair-city pair-city-b">{p.cityB.name}</span>
              </span>
              <span className="pair-card-countries">
                {p.cityA.country} — {p.cityB.country}
              </span>
              <span className="pair-card-offset">±{p.offsetKm} km offset</span>
            </button>
          </li>
        ))}
      </ul>
      {hasMore && (
        <div className="pair-list-more">
          <button
            className="pair-list-more-btn"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          >
            Show more ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
});
