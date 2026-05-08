import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Card } from '@/components/primitives/Card'
import { ScreenHeader } from '@/components/primitives/ScreenHeader'
import { StatusPill } from '@/components/primitives/StatusPill'
import { useParentContext } from '@/features/parent/context/ParentDataContext'
import { colors } from '@/lib/colors'
import { routes } from '@/lib/navigation/routes'
import type { RouteUpdateType } from '@/types/route'

const typeIcon: Record<RouteUpdateType, string> = {
  ok: '✅',
  info: 'ℹ️',
  warn: '⚠️',
}

function attendancePill(status: 'boarded' | 'absent' | null) {
  if (status === 'boarded') return { label: 'On Bus', tone: 'success' as const }
  if (status === 'absent') return { label: 'Absent', tone: 'danger' as const }
  return { label: 'Waiting', tone: 'warning' as const }
}

export function ParentHomeScreen() {
  const router = useRouter()
  const { loading, error, child, attendanceStatus, announcements, etaMinutes } = useParentContext()

  const pill = attendancePill(attendanceStatus)
  const etaDisplay = attendanceStatus === 'boarded'
    ? 'On Bus'
    : attendanceStatus === 'absent'
      ? 'Absent'
      : etaMinutes === null
        ? '--'
        : etaMinutes <= 1
          ? 'Arriving'
          : `~${etaMinutes} min`

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        subtitle="Good morning"
        action={
          <TouchableOpacity
            onPress={() => router.push(routes.parentNotifications)}
            accessibilityLabel="Open notifications"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.08)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 17 }}>🔔</Text>
          </TouchableOpacity>
        }
      />

      {/* Child banner */}
      <View style={{ backgroundColor: colors.dark, paddingHorizontal: 20, paddingBottom: 18 }}>
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.07)',
            borderRadius: 16,
            padding: 14,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.06)',
          }}
        >
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              backgroundColor: colors.primaryLight,
              borderWidth: 2.5,
              borderColor: colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_800ExtraBold', fontSize: 16 }}>
              {child?.initials ?? '?'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 15 }}>
              {child?.name ?? (loading ? 'Loading...' : 'No child linked')}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 1 }}>
              {child?.busName ?? 'Unassigned'}
            </Text>
          </View>
          {!loading && child && <StatusPill label={pill.label} tone={pill.tone} />}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <View style={{ borderColor: '#FECACA', borderWidth: 1, backgroundColor: '#FEF2F2', borderRadius: 14, padding: 14 }}>
            <Text style={{ color: '#B91C1C', fontSize: 12, fontFamily: 'Inter_600SemiBold' }}>{error}</Text>
          </View>
        )}

        {/* ETA Hero Card */}
        <View
          style={{
            backgroundColor: colors.primary,
            borderRadius: 22,
            padding: 18,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 16,
            elevation: 6,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 10,
                fontFamily: 'Inter_700Bold',
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                marginBottom: 5,
              }}
            >
              📍 ETA to Your Stop
            </Text>
            <Text style={{ color: colors.accent, fontFamily: 'Inter_800ExtraBold', fontSize: 32, letterSpacing: -1 }}>
              {etaDisplay}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 3 }}>
              {attendanceStatus === 'boarded'
                ? 'Your child is on the bus'
                : attendanceStatus === 'absent'
                  ? 'Your child is marked absent today'
                  : etaMinutes
                    ? 'Estimated time based on live GPS'
                    : 'Waiting for bus GPS to start'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push(routes.parentMap)}
            style={{
              backgroundColor: 'rgba(255,255,255,0.14)',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 14,
              alignItems: 'center',
              minWidth: 80,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <Text style={{ fontSize: 22 }}>📍</Text>
            <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 11, marginTop: 4, letterSpacing: 0.5 }}>LIVE</Text>
          </TouchableOpacity>
        </View>

        {/* Route Info Card */}
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Text style={{ fontSize: 16 }}>🚌</Text>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.dark }}>Route Info</Text>
          </View>
          <View style={{ gap: 10 }}>
            {([
              ['Bus', child?.busName ?? '—'],
              ['Stop', child?.homeAddress ?? '—'],
              ['School', child?.schoolName ?? '—'],
            ] as [string, string][]).map(([label, value]) => (
              <View
                key={label}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 16,
                  paddingVertical: 6,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.borderLight,
                }}
              >
                <Text style={{ fontSize: 13, color: colors.subtle, fontFamily: 'Inter_500Medium' }}>{label}</Text>
                <Text style={{ fontSize: 13, color: colors.dark, fontFamily: 'Inter_600SemiBold', flex: 1, textAlign: 'right' }} numberOfLines={1}>
                  {value}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Today's Updates */}
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Text style={{ fontSize: 16 }}>📋</Text>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: colors.dark }}>{"Today's Updates"}</Text>
          </View>
          {loading && (
            <Text style={{ fontSize: 13, color: colors.subtle, fontFamily: 'Inter_500Medium' }}>Loading...</Text>
          )}
          {!loading && announcements.length === 0 && (
            <Text style={{ fontSize: 13, color: colors.subtle, fontFamily: 'Inter_400Regular' }}>No updates yet today.</Text>
          )}
          <View style={{ gap: 12 }}>
            {announcements.slice(0, 3).map(update => (
              <View key={update.id} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 14, marginTop: -1 }}>{typeIcon[update.type]}</Text>
                <Text style={{ width: 46, fontSize: 11, color: colors.subtle, fontFamily: 'Inter_500Medium' }}>{update.time}</Text>
                <Text style={{ flex: 1, fontSize: 12, color: colors.dark, fontFamily: 'Inter_400Regular', lineHeight: 18 }}>
                  {update.body}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* View all link */}
        {announcements.length > 3 && (
          <TouchableOpacity
            onPress={() => router.push(routes.parentNotifications)}
            style={{ alignItems: 'center', paddingVertical: 8 }}
          >
            <Text style={{ fontSize: 13, color: colors.primary, fontFamily: 'Inter_600SemiBold' }}>
              View all {announcements.length} updates →
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
