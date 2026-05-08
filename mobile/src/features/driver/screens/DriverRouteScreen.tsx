import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Mapbox from '@rnmapbox/maps'
import { ScreenHeader } from '@/components/primitives/ScreenHeader'
import { useDriverContext } from '@/features/driver/context/DriverDataContext'
import { colors } from '@/lib/colors'
import { supabase } from '@/lib/supabase'

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '')

function decodePolyline(encoded: string): Array<[number, number]> {
  let index = 0
  let lat = 0
  let lng = 0
  const coordinates: Array<[number, number]> = []
  while (index < encoded.length) {
    let shift = 0; let result = 0; let byte: number
    do { byte = encoded.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5 } while (byte >= 0x20)
    const dLat = (result & 1) ? ~(result >> 1) : (result >> 1); lat += dLat
    shift = 0; result = 0
    do { byte = encoded.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5 } while (byte >= 0x20)
    const dLng = (result & 1) ? ~(result >> 1) : (result >> 1); lng += dLng
    coordinates.push([lng / 1e5, lat / 1e5])
  }
  return coordinates
}

function getLocalDateKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function DriverRouteScreen() {
  const { loading, error, profile, stops, boardedIds, setBoardedIds, absentIds, setAbsentIds, routePoints, encodedPolyline } = useDriverContext()
  const [savingId, setSavingId] = useState<string | null>(null)
  const mapCoordinates = encodedPolyline
    ? decodePolyline(encodedPolyline)
    : routePoints.map((point) => [point.lng, point.lat] as [number, number])
  const mapCenter = mapCoordinates[0] ?? [51.531, 25.2854]
  const totalStudents = stops.reduce((sum, s) => sum + s.students.length, 0)
  const boardedCount = boardedIds.size

  async function markStudent(id: string, status: 'boarded' | 'absent') {
    if (!profile || savingId) return
    const today = getLocalDateKey()
    const wasBoarded = boardedIds.has(id)
    const wasAbsent = absentIds.has(id)
    const isUnmarking = (status === 'boarded' && wasBoarded) || (status === 'absent' && wasAbsent)

    setSavingId(id)
    // Optimistic update
    setBoardedIds((prev) => { const n = new Set(prev); if (status === 'boarded' && !isUnmarking) n.add(id); else n.delete(id); return n })
    setAbsentIds((prev) => { const n = new Set(prev); if (status === 'absent' && !isUnmarking) n.add(id); else n.delete(id); return n })

    try {
      // Always delete existing record first to avoid duplicates
      await supabase.from('attendance').delete()
        .eq('student_id', id).eq('bus_id', profile.busId).eq('date', today)
      if (!isUnmarking) {
        const { error } = await supabase.from('attendance')
          .insert({ student_id: id, bus_id: profile.busId, status, date: today })
        if (error) throw error
      }
    } catch {
      // Revert optimistic update
      setBoardedIds((prev) => { const n = new Set(prev); if (wasBoarded) n.add(id); else n.delete(id); return n })
      setAbsentIds((prev) => { const n = new Set(prev); if (wasAbsent) n.add(id); else n.delete(id); return n })
    } finally {
      setSavingId(null)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        back
        title={profile?.routeName ?? 'Route'}
        subtitle={`${profile?.busName ?? 'Unassigned Bus'} · Tap to check in`}
      />

      {error && (
        <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
          <View style={{ borderColor: '#FECACA', borderWidth: 1, backgroundColor: '#FEF2F2', borderRadius: 12, padding: 12, flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
            <Text style={{ fontSize: 15 }}>❌</Text>
            <Text style={{ color: '#B91C1C', fontSize: 12, fontFamily: 'Inter_600SemiBold', flex: 1 }}>{error}</Text>
          </View>
        </View>
      )}

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 0 }} showsVerticalScrollIndicator={false}>

        {/* Map */}
        {!loading && mapCoordinates.length > 0 && (
          <View style={{ height: 240, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <Mapbox.MapView style={{ flex: 1 }} styleURL={Mapbox.StyleURL.Street}>
              <Mapbox.Camera centerCoordinate={mapCenter} zoomLevel={11} />
              <Mapbox.ShapeSource id="route-line" shape={{ type: 'Feature', geometry: { type: 'LineString', coordinates: mapCoordinates }, properties: {} }}>
                <Mapbox.LineLayer id="route-line-layer" style={{ lineColor: colors.primary, lineWidth: 4, lineOpacity: 0.9 }} />
              </Mapbox.ShapeSource>
              <Mapbox.ShapeSource
                id="route-stops"
                shape={{ type: 'FeatureCollection', features: routePoints.map((p) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [p.lng, p.lat] }, properties: { stopOrder: p.stopOrder } })) }}
              >
                <Mapbox.CircleLayer id="route-stops-layer" style={{ circleRadius: 5, circleColor: colors.success, circleStrokeColor: '#FFFFFF', circleStrokeWidth: 2 }} />
              </Mapbox.ShapeSource>
            </Mapbox.MapView>

            {/* Floating route info pill */}
            <View
              style={{
                position: 'absolute',
                bottom: 10,
                left: 12,
                right: 12,
                backgroundColor: 'rgba(15,23,42,0.82)',
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 16 }}>🗺️</Text>
                <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 13 }}>
                  {profile?.routeName ?? 'Route'} · {stops.length} stops
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success }} />
                <Text style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter_500Medium', fontSize: 12 }}>Active</Text>
              </View>
            </View>
          </View>
        )}


        {/* Progress summary bar */}
        {!loading && totalStudents > 0 && (
          <View
            style={{
              backgroundColor: colors.surface,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              paddingHorizontal: 20,
              paddingVertical: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 16 }}>👥</Text>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: colors.dark }}>
                {boardedCount}/{totalStudents}
              </Text>
              <Text style={{ fontSize: 13, color: colors.subtle, fontFamily: 'Inter_400Regular' }}>boarded</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 110, height: 8, backgroundColor: colors.borderLight, borderRadius: 4, overflow: 'hidden' }}>
                <View
                  style={{
                    height: '100%',
                    width: `${totalStudents > 0 ? Math.round((boardedCount / totalStudents) * 100) : 0}%`,
                    backgroundColor: boardedCount === totalStudents ? colors.success : colors.primary,
                    borderRadius: 4,
                  }}
                />
              </View>
              <View
                style={{
                  backgroundColor: boardedCount === totalStudents ? colors.successBg : colors.infoBg,
                  borderRadius: 8,
                  paddingHorizontal: 7,
                  paddingVertical: 3,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Inter_700Bold',
                    fontSize: 11,
                    color: boardedCount === totalStudents ? colors.success : colors.info,
                  }}
                >
                  {totalStudents > 0 ? Math.round((boardedCount / totalStudents) * 100) : 0}%
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Stops list */}
        <View style={{ padding: 16, gap: 10 }}>
          {loading && (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Text style={{ fontSize: 18 }}>⏳</Text>
              <Text style={{ fontSize: 13, color: colors.subtle, fontFamily: 'Inter_500Medium' }}>Loading route data...</Text>
            </View>
          )}

          {!loading && stops.length === 0 && (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 24,
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Text style={{ fontSize: 32 }}>🗺️</Text>
              <Text style={{ fontSize: 14, color: colors.dark, fontFamily: 'Inter_700Bold' }}>No stops assigned</Text>
              <Text style={{ fontSize: 12, color: colors.subtle, fontFamily: 'Inter_400Regular', textAlign: 'center' }}>
                Contact your school admin to set up your route.
              </Text>
            </View>
          )}

          {stops.map((stop, index) => {
            const stopDone = stop.students.length > 0 && stop.students.every((s) => boardedIds.has(s.id) || absentIds.has(s.id))
            const hasActiveStopBefore = stops.slice(0, index).some((ps) => ps.students.length > 0 && !ps.students.every((s) => boardedIds.has(s.id) || absentIds.has(s.id)))
            const isCurrent = !stopDone && stop.students.length > 0 && !hasActiveStopBefore

            return (
              <View
                key={stop.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 18,
                  borderWidth: isCurrent ? 1.5 : 1,
                  borderColor: isCurrent ? colors.info : stopDone ? colors.success : colors.border,
                  overflow: 'hidden',
                  shadowColor: colors.dark,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 6,
                  elevation: 1,
                }}
              >
                {/* Stop header */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 14,
                  backgroundColor: isCurrent ? colors.infoBg : stopDone ? colors.successBg : colors.surface,
                  gap: 10,
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    {/* Stop number badge */}
                    <View style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: stopDone ? colors.success : isCurrent ? colors.info : colors.borderLight,
                      borderWidth: stopDone || isCurrent ? 0 : 1.5,
                      borderColor: colors.border,
                    }}>
                      {stopDone
                        ? <Text style={{ color: '#FFFFFF', fontSize: 12, fontFamily: 'Inter_800ExtraBold' }}>✓</Text>
                        : isCurrent
                          ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' }} />
                          : <Text style={{ color: colors.muted, fontSize: 11, fontFamily: 'Inter_700Bold' }}>{index + 1}</Text>
                      }
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: stopDone ? colors.muted : colors.dark }}>
                        {stop.name}
                      </Text>
                      {stop.students.length > 0 && (
                        <Text style={{ fontSize: 11, color: isCurrent ? colors.info : colors.subtle, fontFamily: 'Inter_400Regular', marginTop: 1 }}>
                          {stop.students.filter(s => boardedIds.has(s.id)).length}/{stop.students.length} boarded
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 13, fontFamily: 'Inter_700Bold', color: isCurrent ? colors.info : stopDone ? colors.success : colors.subtle }}>
                      {stop.eta}
                    </Text>
                    <Text style={{ fontSize: 10, fontFamily: 'Inter_600SemiBold', color: stopDone ? colors.success : isCurrent ? colors.info : colors.subtle, marginTop: 1 }}>
                      {stopDone ? 'Done ✓' : isCurrent ? 'Now' : 'Upcoming'}
                    </Text>
                  </View>
                </View>

                {/* Student rows */}
                {stop.students.map((student) => {
                  const isBoarded = boardedIds.has(student.id)
                  const isAbsent = absentIds.has(student.id)
                  const isSaving = savingId === student.id
                  const rowBg = isBoarded ? 'rgba(16,185,129,0.04)' : isAbsent ? 'rgba(239,68,68,0.04)' : 'transparent'
                  const avatarBg = isBoarded ? colors.successBg : isAbsent ? colors.dangerBg : colors.infoBg
                  const avatarBorder = isBoarded ? 'rgba(16,185,129,0.3)' : isAbsent ? 'rgba(239,68,68,0.3)' : '#BFDBFE'
                  const avatarColor = isBoarded ? colors.success : isAbsent ? colors.danger : colors.primary
                  const nameColor = (isBoarded || isAbsent) ? colors.muted : colors.dark
                  return (
                    <View
                      key={student.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 14,
                        paddingVertical: 11,
                        borderTopWidth: 1,
                        borderTopColor: colors.borderLight,
                        gap: 10,
                        backgroundColor: rowBg,
                        opacity: isSaving ? 0.6 : 1,
                      }}
                    >
                      {/* Avatar */}
                      <View style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: avatarBg,
                        borderWidth: 1.5,
                        borderColor: avatarBorder,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Text style={{ fontSize: 12, fontFamily: 'Inter_700Bold', color: avatarColor }}>
                          {student.initials}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontFamily: 'Inter_600SemiBold', color: nameColor }}>
                          {student.name}
                        </Text>
                        <Text style={{ fontSize: 11, color: colors.subtle, fontFamily: 'Inter_400Regular' }}>{student.grade}</Text>
                      </View>

                      {/* Action buttons */}
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        <TouchableOpacity
                          onPress={() => !isSaving && markStudent(student.id, 'boarded')}
                          disabled={isSaving}
                          activeOpacity={0.7}
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 16,
                            backgroundColor: isBoarded ? colors.successBg : colors.borderLight,
                            borderWidth: 1,
                            borderColor: isBoarded ? 'rgba(16,185,129,0.3)' : colors.border,
                            minWidth: 64,
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ fontSize: 11, fontFamily: 'Inter_700Bold', color: isBoarded ? colors.successMid : colors.muted }}>
                            {isBoarded ? '✓ Boarded' : 'Board'}
                          </Text>
                        </TouchableOpacity>

                        {!isBoarded && (
                          <TouchableOpacity
                            onPress={() => !isSaving && markStudent(student.id, 'absent')}
                            disabled={isSaving}
                            activeOpacity={0.7}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 6,
                              borderRadius: 16,
                              backgroundColor: isAbsent ? colors.dangerBg : colors.borderLight,
                              borderWidth: 1,
                              borderColor: isAbsent ? 'rgba(239,68,68,0.3)' : colors.border,
                              minWidth: 56,
                              alignItems: 'center',
                            }}
                          >
                            <Text style={{ fontSize: 11, fontFamily: 'Inter_700Bold', color: isAbsent ? colors.danger : colors.muted }}>
                              {isAbsent ? '✕ Absent' : 'Absent'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )
                })}
              </View>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
