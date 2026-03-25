import { useRef, useEffect } from "react";
import L from "leaflet";
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
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialise map
  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current, {
      center: [center.lat, center.lng],
      zoom: 2,
      zoomControl: false,
      attributionControl: true,
      dragging: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      touchZoom: interactive,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    if (interactive) {
      L.control.zoom({ position: "bottomright" }).addTo(map);
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

    const handler = (e: L.LeafletMouseEvent) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
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
      const el = document.createElement("div");
      el.className = "map-marker";
      el.style.setProperty("--accent", accentColor);

      const icon = L.divIcon({
        html: el,
        className: "map-marker-wrapper",
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      markerRef.current = L.marker([marker.lat, marker.lng], { icon }).addTo(
        map,
      );

      map.stop(); // cancel any in-progress animation
      map.flyTo([marker.lat, marker.lng], 5, {
        duration: 1.8,
        easeLinearity: 0.15,
      });
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
