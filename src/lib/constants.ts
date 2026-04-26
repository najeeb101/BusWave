export const APP_NAME = "RouteyAI"

export const ROLES = {
  PLATFORM_ADMIN: "platform_admin",
  SCHOOL_ADMIN: "school_admin",
  DRIVER: "driver",
  PARENT: "parent",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_HOME: Record<Role, string> = {
  platform_admin: "/admin",
  school_admin: "/school",
  driver: "/driver",
  parent: "/parent",
}

export const DEFAULT_BUS_CAPACITY = 40
export const DEFAULT_BUS_COLORS = [
  "#3B82F6", // blue
  "#10B981", // emerald
  "#F59E0B", // amber
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#84CC16", // lime
  "#F97316", // orange
]

export const GPS_BROADCAST_INTERVAL_MS = 4000
