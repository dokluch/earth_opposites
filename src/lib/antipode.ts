/**
 * Core antipode maths and reverse-geocoding helpers.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

/** Return the mathematical antipode of a point. */
export function antipode(p: LatLng): LatLng {
  return {
    lat: -p.lat,
    lng: p.lng > 0 ? p.lng - 180 : p.lng + 180,
  };
}

const R_EARTH_KM = 6371;

/** Haversine distance in km between two points. */
export function haversineKm(a: LatLng, b: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R_EARTH_KM * Math.asin(Math.sqrt(h));
}

/** Format a coordinate pair for display. */
export function formatCoord(p: LatLng): string {
  const latDir = p.lat >= 0 ? "N" : "S";
  const lngDir = p.lng >= 0 ? "E" : "W";
  return `${Math.abs(p.lat).toFixed(4)}° ${latDir}, ${Math.abs(p.lng).toFixed(4)}° ${lngDir}`;
}

/** Distance through the Earth's centre (simple diameter approximation). */
export function throughEarthKm(a: LatLng, b: LatLng): number {
  // For true antipodes this is ~12 742 km. We compute the chord length.
  const toRad = (d: number) => (d * Math.PI) / 180;
  const phi1 = toRad(a.lat),
    lam1 = toRad(a.lng);
  const phi2 = toRad(b.lat),
    lam2 = toRad(b.lng);
  // Convert to cartesian
  const x1 = Math.cos(phi1) * Math.cos(lam1);
  const y1 = Math.cos(phi1) * Math.sin(lam1);
  const z1 = Math.sin(phi1);
  const x2 = Math.cos(phi2) * Math.cos(lam2);
  const y2 = Math.cos(phi2) * Math.sin(lam2);
  const z2 = Math.sin(phi2);
  const dx = x2 - x1,
    dy = y2 - y1,
    dz = z2 - z1;
  return R_EARTH_KM * Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Reverse-geocode a lat/lng to a place name using OpenStreetMap Nominatim.
 * Rate-limited (1 req/s policy), returns null on failure.
 */
export async function reverseGeocode(p: LatLng): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${p.lat}&lon=${p.lng}&format=json&zoom=10&addressdetails=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "EarthOpposites/1.0 (educational app)" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;

    const addr = data.address;
    const parts: string[] = [];
    if (addr.city || addr.town || addr.village || addr.hamlet)
      parts.push(addr.city || addr.town || addr.village || addr.hamlet);
    if (addr.state) parts.push(addr.state);
    if (addr.country) parts.push(addr.country);
    return parts.length
      ? parts.join(", ")
      : data.display_name?.split(",").slice(0, 3).join(",") || null;
  } catch {
    return null;
  }
}
