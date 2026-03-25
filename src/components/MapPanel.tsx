import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import type { LatLng } from "../lib/antipode";

interface Props {
  id: string;
  center: LatLng;
  marker: LatLng | null;
  label: string;
  interactive: boolean;
  onMapClick?: (latlng: LatLng) => void;
  accentColor: string;
}

export default function MapPanel({
  id,
  center,
  marker,
  label,
  interactive,
  onMapClick,
  accentColor,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  // Initialise map
  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
        // Dark-tinted base to match our theme
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      },
      center: [center.lng, center.lat],
      zoom: 2,
      attributionControl: {},
      interactive,
    });

    if (interactive) {
      map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Click handler
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !onMapClick) return;

    const handler = (e: maplibregl.MapMouseEvent) => {
      onMapClick({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    };
    map.on("click", handler);
    return () => {
      map.off("click", handler);
    };
  }, [onMapClick]);

  // Update marker + fly to
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    if (marker) {
      // Create pulsing dot element
      const el = document.createElement("div");
      el.className = "map-marker";
      el.style.setProperty("--accent", accentColor);

      markerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([marker.lng, marker.lat])
        .addTo(map);

      map.flyTo({ center: [marker.lng, marker.lat], zoom: 5, duration: 1800 });
    }
  }, [marker, accentColor]);

  return (
    <div className="map-panel">
      <span className="map-label" style={{ color: accentColor }}>
        {label}
      </span>
      <div ref={containerRef} className="map-container" />
    </div>
  );
}
