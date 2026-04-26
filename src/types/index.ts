export type LngLat = [number, number]

export interface Waypoint {
  lat: number
  lng: number
  student_id: string | null
  stop_order: number
  eta_offset_min: number
}

export interface BusLocationUpdate {
  bus_id: string
  lat: number
  lng: number
  heading: number | null
  speed: number | null
  timestamp: string
}
