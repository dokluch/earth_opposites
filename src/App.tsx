import { useState, useCallback, useRef, useEffect } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import MapPanel from "./components/MapPanel";
import GlobeVis from "./components/GlobeVis";
import InfoPanel from "./components/InfoPanel";
import PairList from "./components/PairList";
import { antipode, reverseGeocode } from "./lib/antipode";
import antipodalPairs from "./data/antipodalCities";
import type { AntipodalPair } from "./data/antipodalCities";
import type { LatLng } from "./lib/antipode";
import "./App.css";

function App() {
  const [pointA, setPointA] = useState<LatLng | null>(null);
  const [pointB, setPointB] = useState<LatLng | null>(null);
  const [placeA, setPlaceA] = useState<string | null>(null);
  const [placeB, setPlaceB] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePairId, setActivePairId] = useState<number | null>(null);
  const [fact, setFact] = useState<string | null>(null);
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didInit = useRef(false);

  const geocodeBoth = useCallback((a: LatLng, b: LatLng) => {
    setLoading(true);
    setPlaceA(null);
    setPlaceB(null);
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    geocodeTimer.current = setTimeout(async () => {
      const [nameA, nameB] = await Promise.all([
        reverseGeocode(a),
        reverseGeocode(b),
      ]);
      setPlaceA(nameA);
      setPlaceB(nameB);
      setLoading(false);
    }, 350);
  }, []);

  const handleMapClickA = useCallback((latlng: LatLng) => {
    const anti = antipode(latlng);
    setPointA(latlng);
    setPointB(anti);
    setActivePairId(null);
    setFact(null);
    geocodeBoth(latlng, anti);
  }, [geocodeBoth]);

  const handleMapClickB = useCallback((latlng: LatLng) => {
    const anti = antipode(latlng);
    setPointB(latlng);
    setPointA(anti);
    setActivePairId(null);
    setFact(null);
    geocodeBoth(anti, latlng);
  }, [geocodeBoth]);

  const handleGlobeDragA = useCallback((latlng: LatLng) => {
    const anti = antipode(latlng);
    setPointA(latlng);
    setPointB(anti);
    setActivePairId(null);
    setFact(null);
    geocodeBoth(latlng, anti);
  }, [geocodeBoth]);

  const handleGlobeDragB = useCallback((latlng: LatLng) => {
    const anti = antipode(latlng);
    setPointB(latlng);
    setPointA(anti);
    setActivePairId(null);
    setFact(null);
    geocodeBoth(anti, latlng);
  }, [geocodeBoth]);

  const handlePairSelect = useCallback((pair: AntipodalPair) => {
    setPointA(pair.cityA);
    setPointB(pair.cityB);
    setPlaceA(`${pair.cityA.name}, ${pair.cityA.country}`);
    setPlaceB(`${pair.cityB.name}, ${pair.cityB.country}`);
    setActivePairId(pair.id);
    setFact(pair.fact);
    setLoading(false);
  }, []);

  // Select a random pair on first load
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const randomPair = antipodalPairs[Math.floor(Math.random() * antipodalPairs.length)];
    handlePairSelect(randomPair);
  }, [handlePairSelect]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <svg className="header-icon" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="oklch(0.72 0.19 150)" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="14" stroke="oklch(0.68 0.20 25)" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="10" cy="12" r="2.5" fill="oklch(0.72 0.19 150)" />
            <circle cx="22" cy="20" r="2.5" fill="oklch(0.68 0.20 25)" />
            <line x1="10" y1="12" x2="22" y2="20" stroke="oklch(0.60 0.10 50)" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
          <h1 className="header-title">
            Earth <span className="header-title-accent">Opposites</span>
          </h1>
        </div>
        <p className="header-tagline">
          Discover what's on the exact opposite side of the world
        </p>
      </header>

      <main className="main">
        <div className="maps-row">
          <MapPanel
            id="map-a"
            center={{ lat: 20, lng: 0 }}
            marker={pointA}
            label="Your Point"
            interactive
            onMapClick={handleMapClickA}
            accentColor="oklch(0.72 0.19 150)"
          />
          <MapPanel
            id="map-b"
            center={{ lat: -20, lng: 180 }}
            marker={pointB}
            label="Antipode"
            interactive
            onMapClick={handleMapClickB}
            accentColor="oklch(0.68 0.20 25)"
          />
        </div>

        <div className="globe-row">
          <GlobeVis
            pointA={pointA}
            pointB={pointB}
            onPointADrag={handleGlobeDragA}
            onPointBDrag={handleGlobeDragB}
          />
        </div>

        <InfoPanel
          pointA={pointA}
          pointB={pointB}
          placeA={placeA}
          placeB={placeB}
          loading={loading}
          fact={fact}
        />
      </main>

      <section className="pairs-section">
        <PairList
          pairs={antipodalPairs}
          activePairId={activePairId}
          onSelect={handlePairSelect}
        />
      </section>

      <footer className="footer">
        <p>
          Maps &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors
          &middot; Geocoding by <a href="https://nominatim.org" target="_blank" rel="noopener noreferrer">Nominatim</a>
          &middot; Rendered with <a href="https://maplibre.org" target="_blank" rel="noopener noreferrer">MapLibre GL</a>
        </p>
      </footer>
    </div>
  );
}

export default App
