import { useState, useMemo } from "react";
import type { AntipodalPair } from "../data/antipodalCities";

interface Props {
  pairs: AntipodalPair[];
  activePairId: number | null;
  onSelect: (pair: AntipodalPair) => void;
}

export default function PairList({ pairs, activePairId, onSelect }: Props) {
  const [query, setQuery] = useState("");

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

  return (
    <div className="pair-list">
      <h3 className="pair-list-title">Antipodal City Pairs</h3>
      <p className="pair-list-subtitle">Cities on exact opposite sides of the Earth</p>
      <div className="pair-search-wrapper">
        <input
          className="pair-search"
          type="text"
          placeholder="Search by city or country…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <ul className="pair-list-items">
        {filtered.map((p) => (
          <li key={p.id}>
            <button
              className={`pair-card ${activePairId === p.id ? "pair-card--active" : ""}`}
              onClick={() => onSelect(p)}
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
    </div>
  );
}
