import { memo } from "react";
import type { LatLng } from "../lib/antipode";
import { formatCoord, haversineKm, throughEarthKm } from "../lib/antipode";

interface Props {
  pointA: LatLng | null;
  pointB: LatLng | null;
  placeA: string | null;
  placeB: string | null;
  loading: boolean;
  fact: string | null;
}

export default memo(function InfoPanel({
  pointA,
  pointB,
  placeA,
  placeB,
  loading,
  fact,
}: Props) {
  if (!pointA || !pointB) {
    return (
      <div className="info-panel info-panel--empty">
        <div className="info-empty-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <circle cx="14" cy="18" r="3" fill="oklch(0.72 0.19 150)" />
            <circle cx="34" cy="30" r="3" fill="oklch(0.68 0.20 25)" />
            <line
              x1="14"
              y1="18"
              x2="34"
              y2="30"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          </svg>
        </div>
        <p className="info-empty-text">
          Click anywhere on the left map to find its antipode
        </p>
        <p className="info-empty-hint">or pick a pair from the list below</p>
      </div>
    );
  }

  const surfaceD = haversineKm(pointA, pointB);
  const throughD = throughEarthKm(pointA, pointB);

  return (
    <div className="info-panel">
      <div className="info-row">
        <div className="info-point info-point-a">
          <span
            className="info-dot"
            style={{ background: "oklch(0.72 0.19 150)" }}
          />
          <div>
            <span className="info-place">
              {loading ? "Looking up…" : placeA || "Unknown location"}
            </span>
            <span className="info-coords">{formatCoord(pointA)}</span>
          </div>
        </div>

        <div className="info-connector">
          <svg width="60" height="24" viewBox="0 0 60 24">
            <line
              x1="0"
              y1="12"
              x2="60"
              y2="12"
              stroke="oklch(0.5 0.04 230)"
              strokeWidth="1"
              strokeDasharray="4 3"
            />
            <polygon points="55,8 60,12 55,16" fill="oklch(0.5 0.04 230)" />
            <polygon points="5,8 0,12 5,16" fill="oklch(0.5 0.04 230)" />
          </svg>
          <span className="info-diameter">
            {throughD.toFixed(0)} km through Earth
          </span>
        </div>

        <div className="info-point info-point-b">
          <span
            className="info-dot"
            style={{ background: "oklch(0.68 0.20 25)" }}
          />
          <div>
            <span className="info-place">
              {loading ? "Looking up…" : placeB || "Unknown location"}
            </span>
            <span className="info-coords">{formatCoord(pointB)}</span>
          </div>
        </div>
      </div>

      <div className="info-stats">
        <div className="info-stat">
          <span className="info-stat-value">{surfaceD.toFixed(0)}</span>
          <span className="info-stat-label">km surface distance</span>
        </div>
        <div className="info-stat">
          <span className="info-stat-value">{throughD.toFixed(0)}</span>
          <span className="info-stat-label">km straight through</span>
        </div>
        <div className="info-stat">
          <span className="info-stat-value">
            {((surfaceD / 40075) * 100).toFixed(1)}%
          </span>
          <span className="info-stat-label">of Earth's circumference</span>
        </div>
      </div>

      {fact && (
        <div className="info-fact">
          <span className="info-fact-icon">✦</span>
          {fact}
        </div>
      )}
    </div>
  );
});
