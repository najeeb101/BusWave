'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { FleetMapSvg } from '@/components/maps/FleetMapSvg'
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

const BUS_DOT: Record<string, string> = {
  active: '#10B981',
  full:   '#F59E0B',
  idle:   '#94A3B8',
}

function busDotStatus(b: BusRow) {
  if (!b.driver_id || !b.is_active) return 'idle'
  if (b.student_count >= b.capacity) return 'full'
  return 'active'
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function SchoolOverviewClient({
  schoolName,
  stats,
  initialBuses,
  initialAnnouncements,
}: {
  schoolName: string
  stats: SchoolStats | null
  initialBuses: BusRow[]
  initialAnnouncements: AnnouncementRow[]
}) {
  const supabase = createClient()

  const [buses,         setBuses]         = useState<BusRow[]>(initialBuses)
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>(initialAnnouncements)

  const [modalOpen,    setModalOpen]    = useState(false)
  const [announceTo,   setAnnounceTo]   = useState<string>('')
  const [message,      setMessage]      = useState('')
  const [sending,      setSending]      = useState(false)
  const [sent,         setSent]         = useState(false)
  const [sendError,    setSendError]    = useState<string | null>(null)

  const refetchAnnouncements = useCallback(async () => {
    const { data } = await supabase.rpc('get_recent_announcements', { p_limit: 5 })
    if (data) setAnnouncements(data as AnnouncementRow[])
  }, [supabase])

  const openModal = () => {
    setModalOpen(true)
    setAnnounceTo('')
    setMessage('')
    setSent(false)
    setSendError(null)
  }

  const handleSend = async () => {
    if (!message.trim()) return
    setSending(true); setSendError(null)
    const { error } = await supabase.rpc('send_announcement', {
      p_message: message.trim(),
      p_bus_id:  announceTo || null,
    })
    setSending(false)
    if (error) { setSendError(error.message); return }
    setSent(true)
    await refetchAnnouncements()
  }

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <div className="p-7 max-w-[1280px]">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] leading-tight">Good morning, Admin</h1>
          <p className="text-sm text-[#64748B] mt-0.5">{schoolName} · {today}</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-[#1E3A8A] text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#1e40af]"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          Send Announcement
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatsCard
          label="Total Buses"
          value={String(stats?.bus_count ?? '—')}
          sub={`${stats?.active_buses ?? 0} with drivers`}
          color="#1E3A8A"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/>
              <path d="M18 18h3s.5-1.7.8-4.3c.3-2.7.2-7.7.2-7.7H2S1.7 7 2 9.7c.3 2.6.8 4.3.8 4.3H5"/>
              <circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
            </svg>
          }
        />
        <StatsCard
          label="Total Students"
          value={String(stats?.student_count ?? '—')}
          sub="Registered"
          color="#10B981"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
          }
        />
        <StatsCard
          label="Routes"
          value={String(stats?.route_count ?? '—')}
          sub="AI-optimized"
          color="#3B82F6"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.75" strokeLinecap="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
              <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
            </svg>
          }
        />
        <StatsCard
          label="Active Buses"
          value={String(stats?.active_buses ?? '—')}
          sub={`${(stats?.bus_count ?? 0) - (stats?.active_buses ?? 0)} idle`}
          color="#8B5CF6"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.75" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          }
        />
      </div>

      {/* Map + Fleet side by side */}
      <div className="grid grid-cols-[1fr_300px] gap-5 mb-6">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgb(0_0_0/0.04)] p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-[#0F172A]">Live Fleet Map</span>
            <a href="/school/buses" className="text-xs text-[#64748B] hover:text-[#0F172A]">View All →</a>
          </div>
          <FleetMapSvg />
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgb(0_0_0/0.04)] p-5">
          <div className="text-sm font-bold text-[#0F172A] mb-4">Fleet Status</div>
          {buses.length === 0 ? (
            <p className="text-xs text-[#94A3B8]">No buses registered yet.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {buses.map(b => {
                const dotStatus = busDotStatus(b)
                return (
                  <div key={b.id} className="flex items-center gap-2.5 py-2.5 border-b border-[#F8FAFC] last:border-0">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: BUS_DOT[dotStatus] }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-[#0F172A]">{b.name}</div>
                      <div className="text-[11px] text-[#64748B] truncate">{b.driver_name ?? 'No driver'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] font-semibold text-[#0F172A]">
                        {b.student_count}<span className="text-[#94A3B8] font-normal">/{b.capacity}</span>
                      </div>
                      <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: BUS_DOT[dotStatus] }}>
                        {dotStatus}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgb(0_0_0/0.04)] p-5">
        <div className="text-sm font-bold text-[#0F172A] mb-4">Recent Announcements</div>
        {announcements.length === 0 ? (
          <p className="text-xs text-[#94A3B8] py-4 text-center">No announcements yet. Send one to your fleet above.</p>
        ) : (
          announcements.map(a => (
            <div key={a.id} className="flex items-start gap-2.5 py-2 border-b border-[#F8FAFC] last:border-0">
              <div className="w-2 h-2 rounded-full shrink-0 mt-1 bg-[#3B82F6]" />
              <span className="text-[12px] text-[#64748B] shrink-0 w-16">{timeAgo(a.created_at)}</span>
              <div className="flex-1 min-w-0">
                <span className="text-[13px] text-[#0F172A]">{a.message}</span>
                {a.bus_name && (
                  <span className="ml-1.5 text-[11px] text-[#64748B]">→ {a.bus_name}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Announcement Modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => { if (!sending) { setModalOpen(false) } }}
        >
          <div className="bg-white rounded-2xl p-6 w-[480px] shadow-[0_20px_60px_-15px_rgb(0_0_0/0.3)]" onClick={e => e.stopPropagation()}>
            {sent ? (
              <div className="flex flex-col items-center py-4 text-center">
                <div className="w-14 h-14 rounded-full bg-[#D1FAE5] border border-[#6EE7B7] flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-1">Announcement Sent</h3>
                <p className="text-sm text-[#64748B] mb-1">
                  Delivered to <span className="font-semibold text-[#0F172A]">
                    {announceTo ? buses.find(b => b.id === announceTo)?.name ?? 'selected bus' : 'all buses & parents'}
                  </span>
                </p>
                <p className="text-xs text-[#94A3B8] mb-6">All drivers and parents have been notified.</p>
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-[#1E3A8A] text-white rounded-lg px-6 py-2 text-sm font-semibold"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-5">
                  <span className="text-lg font-bold text-[#0F172A]">Send Announcement</span>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="w-7 h-7 bg-[#F1F5F9] rounded-lg flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                {sendError && (
                  <p className="mb-4 text-sm text-[#DC2626]">{sendError}</p>
                )}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Send to</label>
                    <select
                      value={announceTo}
                      onChange={e => setAnnounceTo(e.target.value)}
                      className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none"
                    >
                      <option value="">All buses &amp; parents</option>
                      {buses.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Message</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Type your announcement…"
                      className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none resize-none focus:border-[#3B82F6] transition-colors"
                    />
                  </div>
                  <div className="flex gap-2 justify-end mt-1">
                    <button onClick={() => setModalOpen(false)} className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm font-medium">Cancel</button>
                    <button
                      disabled={!message.trim() || sending}
                      onClick={handleSend}
                      className="bg-[#1E3A8A] text-white rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2 disabled:opacity-60 transition-opacity"
                    >
                      {sending ? (
                        <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</>
                      ) : (
                        <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Send</>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
