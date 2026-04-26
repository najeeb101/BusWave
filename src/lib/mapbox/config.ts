export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ""

/** Doha city center — used as default map view and fallback location. */
export const DOHA_CENTER: [number, number] = [51.531, 25.286]

/** Qatar bounding box — used to bias geocoding & restrict map exploration.
 *  Format: [minLng, minLat, maxLng, maxLat] */
export const QATAR_BBOX: [number, number, number, number] = [
  50.75, 24.47, 51.64, 26.15,
]

export const DEFAULT_MAP_STYLE = "mapbox://styles/mapbox/streets-v12"
export const DEFAULT_ZOOM = 11
export const FOCUSED_ZOOM = 14

/** Mapbox API endpoints — use server-side wherever possible to keep token usage tracked. */
export const MAPBOX_API = {
  geocoding: "https://api.mapbox.com/geocoding/v5/mapbox.places",
  directions: "https://api.mapbox.com/directions/v5/mapbox/driving",
  matrix: "https://api.mapbox.com/directions-matrix/v1/mapbox/driving",
} as const
