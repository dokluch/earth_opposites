import { useState, useCallback, useRef, useEffect } from "react";
import "leaflet/dist/leaflet.css";
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

  const handleMapClickA = useCallback(
    (latlng: LatLng) => {
      const anti = antipode(latlng);
      setPointA(latlng);
      setPointB(anti);
      setActivePairId(null);
      setFact(null);
      geocodeBoth(latlng, anti);
    },
    [geocodeBoth],
  );

  const handleMapClickB = useCallback(
    (latlng: LatLng) => {
      const anti = antipode(latlng);
      setPointB(latlng);
      setPointA(anti);
      setActivePairId(null);
      setFact(null);
      geocodeBoth(anti, latlng);
    },
    [geocodeBoth],
  );

  const handleGlobeDragA = useCallback(
    (latlng: LatLng) => {
      const anti = antipode(latlng);
      setPointA(latlng);
      setPointB(anti);
      setActivePairId(null);
      setFact(null);
      geocodeBoth(latlng, anti);
    },
    [geocodeBoth],
  );

  const handleGlobeDragB = useCallback(
    (latlng: LatLng) => {
      const anti = antipode(latlng);
      setPointB(latlng);
      setPointA(anti);
      setActivePairId(null);
      setFact(null);
      geocodeBoth(anti, latlng);
    },
    [geocodeBoth],
  );

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
    const randomPair =
      antipodalPairs[Math.floor(Math.random() * antipodalPairs.length)];
    handlePairSelect(randomPair);
  }, [handlePairSelect]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <svg
            className="header-icon"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="oklch(0.72 0.19 150)"
              strokeWidth="1.5"
            />
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="oklch(0.68 0.20 25)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <circle cx="10" cy="12" r="2.5" fill="oklch(0.72 0.19 150)" />
            <circle cx="22" cy="20" r="2.5" fill="oklch(0.68 0.20 25)" />
            <line
              x1="10"
              y1="12"
              x2="22"
              y2="20"
              stroke="oklch(0.60 0.10 50)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
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
        <a
          href="https://github.com/dokluch/earth_opposites"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-github"
          aria-label="View source on GitHub"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
        <p>
          Maps &copy;{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap
          </a>{" "}
          contributors &middot; Geocoding by{" "}
          <a
            href="https://nominatim.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nominatim
          </a>
          &middot; Rendered with{" "}
          <a
            href="https://leafletjs.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Leaflet
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
