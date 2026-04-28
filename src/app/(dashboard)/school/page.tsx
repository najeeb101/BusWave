import { createClient } from '@/lib/supabase/server'
import SchoolOverviewClient from './SchoolOverviewClient'
import type { BusRow } from './buses/BusesTable'

type AnnouncementRow = {
  id: string
  message: string
  bus_id: string | null
  bus_name: string | null
  created_at: string
}

type SchoolStats = {
  bus_count: number
  active_buses: number
  student_count: number
  route_count: number
}

type SchoolInfo = {
  id: string
  name: string
  address: string
}

export default async function SchoolOverviewPage() {
  const supabase = createClient()

  const [infoResult, statsResult, busesResult, announcementsResult] = await Promise.all([
    supabase.rpc('get_school_info'),
    supabase.rpc('get_school_stats'),
    supabase.rpc('get_buses_with_drivers'),
    supabase.rpc('get_recent_announcements', { p_limit: 5 }),
  ])

  const school        = infoResult.data as SchoolInfo | null
  const stats         = statsResult.data as SchoolStats | null
  const buses         = (busesResult.data ?? []) as BusRow[]
  const announcements = (announcementsResult.data ?? []) as AnnouncementRow[]

  return (
    <SchoolOverviewClient
      schoolName={school?.name ?? 'Your School'}
      stats={stats}
      initialBuses={buses}
      initialAnnouncements={announcements}
    />
  )
}
