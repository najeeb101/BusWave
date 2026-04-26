import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateInviteCode(prefix = "RTY") {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let body = ""
  for (let i = 0; i < 6; i++) {
    body += chars[Math.floor(Math.random() * chars.length)]
  }
  return `${prefix}-${body.slice(0, 3)}${body.slice(3)}`
}

export function formatDistanceKm(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

export function formatDurationMin(min: number) {
  if (min < 60) return `${Math.round(min)} min`
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}
