import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card } from '@/components/primitives/Card'
import { ScreenHeader } from '@/components/primitives/ScreenHeader'
import { useParentContext } from '@/features/parent/context/ParentDataContext'
import { colors } from '@/lib/colors'
import type { RouteUpdateType } from '@/types/route'

const typeColor: Record<RouteUpdateType, string> = {
  ok: colors.success,
  info: colors.info,
  warn: colors.warning,
}

const typeBg: Record<RouteUpdateType, string> = {
  ok: colors.successBg,
  info: colors.infoBg,
  warn: colors.warningBg,
}

const typeIcon: Record<RouteUpdateType, string> = {
  ok: '✅',
  info: 'ℹ️',
  warn: '⚠️',
}

const typeLabel: Record<RouteUpdateType, string> = {
  ok: 'All good',
  info: 'Info',
  warn: 'Warning',
}

export function ParentNotificationsScreen() {
  const { loading, error, child, announcements } = useParentContext()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        title="Notifications"
        subtitle={child ? `Updates about ${child.name.split(' ')[0]}` : 'Updates'}
      />

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

        {loading && (
          <View style={{ backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16 }}>
            <Text style={{ fontSize: 13, color: colors.subtle, fontFamily: 'Inter_500Medium' }}>Loading notifications...</Text>
          </View>
        )}

        {!loading && announcements.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 40, gap: 10 }}>
            <Text style={{ fontSize: 32 }}>🔔</Text>
            <Text style={{ fontSize: 14, color: colors.dark, fontFamily: 'Inter_700Bold' }}>No notifications yet</Text>
            <Text style={{ fontSize: 13, color: colors.subtle, fontFamily: 'Inter_400Regular', textAlign: 'center' }}>
              You'll see updates from the driver and school here.
            </Text>
          </View>
        )}

        {announcements.map(notification => (
          <Card key={notification.id} style={{ flexDirection: 'row', gap: 14, padding: 14, alignItems: 'flex-start' }}>
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 13,
                backgroundColor: typeBg[notification.type],
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: typeColor[notification.type] + '33',
              }}
            >
              <Text style={{ fontSize: 20 }}>{typeIcon[notification.type]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, gap: 10, alignItems: 'flex-start' }}>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: colors.dark, flex: 1, lineHeight: 18 }}>
                  {notification.from}
                </Text>
                <Text style={{ fontSize: 11, color: colors.subtle, fontFamily: 'Inter_400Regular', marginTop: 1 }}>
                  {notification.time}
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: colors.muted, fontFamily: 'Inter_400Regular', lineHeight: 18 }}>
                {notification.body}
              </Text>
              <View
                style={{
                  marginTop: 8,
                  alignSelf: 'flex-start',
                  backgroundColor: typeBg[notification.type],
                  borderRadius: 6,
                  paddingHorizontal: 7,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ fontSize: 10, fontFamily: 'Inter_600SemiBold', color: typeColor[notification.type] }}>
                  {typeLabel[notification.type]}
                </Text>
              </View>
            </View>
          </Card>
        ))}

        {!loading && announcements.length > 0 && (
          <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 16 }}>
            <Text style={{ fontSize: 12, color: colors.subtle, fontFamily: 'Inter_400Regular' }}>You're all caught up 🎉</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
