import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type ParentChildProfile = {
  id: string
  name: string
  initials: string
  homeAddress: string
  stopOrder: number | null
  busId: string | null
  busName: string | null
  busColor: string
  schoolName: string | null
}

export type ParentAnnouncement = {
  id: string
  from: string
  body: string
  time: string
  type: 'ok' | 'info' | 'warn'
}

export type ParentRoutePoint = {
  lat: number
  lng: number
  stopOrder: number
  studentId: string
}

export type ParentBusLocation = {
  lat: number
  lng: number
}

type StudentRow = {
  id: string
  name: string
  home_address: string
  stop_order: number | null
  bus_id: string | null
}

type BusRow = {
  name: string
  color: string | null
  school_id: string | null
}

type SchoolRow = {
  name: string
}

type AnnouncementRow = {
  id: string
  message: string
  created_at: string
}

type WaypointRow = {
  lat: number
  lng: number
  stop_order: number
  student_id: string
}

type RouteRow = {
  waypoints: WaypointRow[] | null
  encoded_polyline: string | null
}

type AttendanceRow = {
  status: 'boarded' | 'absent' | null
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return ((parts[0]?.[0] ?? 'S') + (parts[1]?.[0] ?? '')).toUpperCase()
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function getLocalDateKey() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function useParentData() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [child, setChild] = useState<ParentChildProfile | null>(null)
  const [routePoints, setRoutePoints] = useState<ParentRoutePoint[]>([])
  const [encodedPolyline, setEncodedPolyline] = useState<string | null>(null)
  const [busLocation, setBusLocation] = useState<ParentBusLocation | null>(null)
  const [attendanceStatus, setAttendanceStatus] = useState<'boarded' | 'absent' | null>(null)
  const [announcements, setAnnouncements] = useState<ParentAnnouncement[]>([])
  const etaAlertSent = useRef(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: authData, error: authErr } = await supabase.auth.getUser()
      if (authErr) throw authErr
      const user = authData.user
      if (!user) throw new Error('No authenticated user')

      const { data: studentData, error: studentErr } = await supabase
        .from('students')
        .select('id, name, home_address, stop_order, bus_id')
        .eq('parent_id', user.id)
        .limit(1)
        .maybeSingle()
      if (studentErr) throw studentErr
      if (!studentData) throw new Error('No child linked to this parent account')

      const student = studentData as StudentRow

      let busName: string | null = null
      let busColor = '#3B82F6'
      let schoolName: string | null = null
      if (student.bus_id) {
        const { data: busData } = await supabase
          .from('buses')
          .select('name, color, school_id')
          .eq('id', student.bus_id)
          .maybeSingle()
        const bus = busData as BusRow | null
        busName = bus?.name ?? null
        busColor = bus?.color ?? '#3B82F6'
        if (bus?.school_id) {
          const { data: schoolData } = await supabase
            .from('schools')
            .select('name')
            .eq('id', bus.school_id)
            .maybeSingle()
          schoolName = (schoolData as SchoolRow | null)?.name ?? null
        }
      }

      setChild({
        id: student.id,
        name: student.name,
        initials: initialsFromName(student.name),
        homeAddress: student.home_address,
        stopOrder: student.stop_order,
        busId: student.bus_id,
        busName,
        busColor,
        schoolName,
      })

      if (student.bus_id) {
        const { data: routeData } = await supabase
          .from('routes')
          .select('waypoints, encoded_polyline')
          .eq('bus_id', student.bus_id)
          .order('optimized_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        const route = routeData as RouteRow | null
        const points = (route?.waypoints ?? [])
          .filter((wp) => typeof wp?.lat === 'number' && typeof wp?.lng === 'number')
          .sort((a, b) => a.stop_order - b.stop_order)
          .map((wp) => ({
            lat: wp.lat,
            lng: wp.lng,
            stopOrder: wp.stop_order,
            studentId: wp.student_id,
          }))
        setRoutePoints(points)
        setEncodedPolyline(route?.encoded_polyline ?? null)

        const { data: locData } = await supabase
          .from('bus_locations')
          .select('location')
          .eq('bus_id', student.bus_id)
          .order('timestamp', { ascending: false })
          .limit(1)
          .maybeSingle()
        const locText = (locData as { location?: string } | null)?.location ?? null
        const match = locText?.match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/)
        if (match?.[1] && match?.[2]) {
          setBusLocation({ lng: Number(match[1]), lat: Number(match[2]) })
        } else {
          setBusLocation(null)
        }
      } else {
        setRoutePoints([])
        setEncodedPolyline(null)
        setBusLocation(null)
      }

      const today = getLocalDateKey()
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('status')
        .eq('student_id', student.id)
        .eq('date', today)
        .limit(1)
        .maybeSingle()
      const attendance = attendanceData as AttendanceRow | null
      setAttendanceStatus(attendance?.status ?? null)

      if (student.bus_id) {
        const { data: announcementsData } = await supabase
          .from('announcements')
          .select('id, message, created_at')
          .or(`bus_id.eq.${student.bus_id},bus_id.is.null`)
          .order('created_at', { ascending: false })
          .limit(25)
        setAnnouncements(
          ((announcementsData ?? []) as AnnouncementRow[]).map((a) => ({
            id: a.id,
            from: schoolName ?? 'School',
            body: a.message,
            time: new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'info' as const,
          })),
        )
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load parent data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    etaAlertSent.current = false
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!child?.busId || !child.id) return
    const locationChannel = supabase
      .channel(`parent-bus-location-${child.busId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bus_locations', filter: `bus_id=eq.${child.busId}` },
        (payload) => {
          const locText = (payload.new as { location?: string })?.location ?? null
          const match = locText?.match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/)
          if (match?.[1] && match?.[2]) {
            setBusLocation({ lng: Number(match[1]), lat: Number(match[2]) })
          }
        },
      )
      .subscribe()

    const announcementChannel = supabase
      .channel(`parent-announcements-${child.busId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'announcements' }, () => refresh())
      .subscribe()

    const attendanceChannel = supabase
      .channel(`parent-attendance-${child.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance', filter: `student_id=eq.${child.id}` },
        () => refresh(),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(locationChannel)
      supabase.removeChannel(announcementChannel)
      supabase.removeChannel(attendanceChannel)
    }
  }, [child?.busId, child?.id, refresh])

  // Fire a push notification once per session when bus is ≤5 min from child's stop
  useEffect(() => {
    if (!busLocation || !child || attendanceStatus !== null || etaAlertSent.current) return
    const childPoint = routePoints.find((p) => p.studentId === child.id)
    if (!childPoint) return
    const distKm = haversineKm(busLocation.lat, busLocation.lng, childPoint.lat, childPoint.lng)
    const minutes = Math.max(1, Math.round((distKm / 25) * 60))
    if (minutes <= 5) {
      etaAlertSent.current = true
      supabase.functions.invoke('send-notification', {
        body: { type: 'eta_alert', student_id: child.id },
      }).catch(() => {}) // non-critical, fail silently
    }
  }, [attendanceStatus, busLocation, child, routePoints])

  const etaMinutes = useMemo(() => {
    if (!busLocation || !child || attendanceStatus !== null) return null
    const childPoint = routePoints.find((p) => p.studentId === child.id)
    if (!childPoint) return null
    const distKm = haversineKm(busLocation.lat, busLocation.lng, childPoint.lat, childPoint.lng)
    return Math.max(1, Math.round((distKm / 25) * 60))
  }, [busLocation, child, routePoints, attendanceStatus])

  return {
    loading,
    error,
    child,
    routePoints,
    encodedPolyline,
    busLocation,
    attendanceStatus,
    announcements,
    etaMinutes,
    refresh,
  }
}
