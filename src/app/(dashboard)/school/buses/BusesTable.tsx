'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export type BusRow = {
  id: string
  school_id: string
  name: string
  capacity: number
  driver_id: string | null
  driver_name: string | null
  driver_email: string | null
  color: string
  is_active: boolean
  student_count: number
  created_at: string
}

const BUS_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#F97316',
]

function busStatus(b: BusRow): 'active' | 'full' | 'idle' {
  if (!b.driver_id || !b.is_active) return 'idle'
  if (b.student_count >= b.capacity) return 'full'
  return 'active'
}

const STATUS_STYLE = {
  active: { bg: '#D1FAE5', text: '#059669', label: 'Active'       },
  full:   { bg: '#FEF3C7', text: '#D97706', label: 'At capacity'  },
  idle:   { bg: '#F1F5F9', text: '#64748B', label: 'Idle'         },
}

const STATUS_DOT = { active: '#10B981', full: '#F59E0B', idle: '#94A3B8' }

function BusIcon({ color = '#1E3A8A' }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/>
      <path d="M18 18h3s.5-1.7.8-4.3c.3-2.7.2-7.7.2-7.7H2S1.7 7 2 9.7c.3 2.6.8 4.3.8 4.3H5"/>
      <circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
    </svg>
  )
}

function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-7 h-7 bg-[#F1F5F9] rounded-lg flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] transition-colors">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  )
}

export default function BusesTable({ initialBuses }: { initialBuses: BusRow[] }) {
  const supabase = createClient()

  const [buses, setBuses] = useState<BusRow[]>(initialBuses)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  // Modal state
  const [addOpen, setAddOpen]     = useState(false)
  const [editBus, setEditBus]     = useState<BusRow | null>(null)
  const [deleteBus, setDeleteBus] = useState<BusRow | null>(null)
  const [assignBus, setAssignBus] = useState<BusRow | null>(null)
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [copied, setCopied]       = useState(false)

  // Add form state
  const [addName,     setAddName]     = useState('')
  const [addCapacity, setAddCapacity] = useState('40')
  const [addColor,    setAddColor]    = useState(BUS_COLORS[0]!)

  // Edit form state
  const [editName,     setEditName]     = useState('')
  const [editCapacity, setEditCapacity] = useState('')
  const [editColor,    setEditColor]    = useState('')
  const [editActive,   setEditActive]   = useState(true)

  const refetch = useCallback(async () => {
    const { data } = await supabase.rpc('get_buses_with_drivers')
    if (data) setBuses(data as BusRow[])
  }, [supabase])

  const openEdit = (b: BusRow) => {
    setEditBus(b)
    setEditName(b.name)
    setEditCapacity(String(b.capacity))
    setEditColor(b.color)
    setEditActive(b.is_active)
  }

  const handleAdd = async () => {
    if (!addName.trim()) return
    setLoading(true); setError(null)
    const { error: err } = await supabase.rpc('create_bus', {
      p_name:     addName.trim(),
      p_capacity: Number(addCapacity) || 40,
      p_color:    addColor,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setAddOpen(false)
    setAddName(''); setAddCapacity('40'); setAddColor(BUS_COLORS[0]!)
    await refetch()
  }

  const handleEdit = async () => {
    if (!editBus) return
    setLoading(true); setError(null)
    const { error: err } = await supabase
      .from('buses')
      .update({
        name:      editName.trim() || editBus.name,
        capacity:  Number(editCapacity) || editBus.capacity,
        color:     editColor,
        is_active: editActive,
      })
      .eq('id', editBus.id)
    setLoading(false)
    if (err) { setError(err.message); return }
    setEditBus(null)
    await refetch()
  }

  const handleDelete = async () => {
    if (!deleteBus) return
    setLoading(true); setError(null)
    const { error: err } = await supabase.from('buses').delete().eq('id', deleteBus.id)
    setLoading(false)
    if (err) { setError(err.message); return }
    setDeleteBus(null)
    await refetch()
  }

  const handleGenerateInvite = async () => {
    if (!assignBus) return
    setLoading(true); setError(null)
    const { data: code, error: err } = await supabase.rpc('generate_driver_invite', {
      p_bus_id: assignBus.id,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    const url = `${window.location.origin}/invite/${code}`
    setInviteLink(url)
  }

  const handleCopy = () => {
    if (!inviteLink) return
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const closeAssign = () => {
    setAssignBus(null)
    setInviteLink(null)
    setCopied(false)
  }

  return (
    <div className="p-7 max-w-[1280px]">
      {error && (
        <div className="mb-4 px-4 py-3 bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] text-sm rounded-xl">
          {error}
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] leading-tight">Fleet Management</h1>
          <p className="text-sm text-[#64748B] mt-0.5">{buses.length} bus{buses.length !== 1 ? 'es' : ''} registered</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-[#1E3A8A] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#1e40af] transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Bus
        </button>
      </div>

      {buses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgb(0_0_0/0.04)] p-16 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center mb-4">
            <BusIcon color="#1E3A8A" />
          </div>
          <p className="text-sm font-semibold text-[#0F172A] mb-1">No buses yet</p>
          <p className="text-xs text-[#94A3B8]">Add your first bus to start building your fleet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {buses.map(b => {
            const status = busStatus(b)
            const ss     = STATUS_STYLE[status]
            const pct    = Math.round((b.student_count / b.capacity) * 100)
            const barColor = pct > 90 ? '#EF4444' : pct > 70 ? '#F59E0B' : '#10B981'

            return (
              <div key={b.id} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgb(0_0_0/0.04)] p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
                      <BusIcon color={b.color} />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-[#0F172A]">{b.name}</div>
                      <div className="text-xs text-[#64748B]">
                        {b.driver_name ?? 'No driver assigned'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: ss.bg, color: ss.text }}>
                    {ss.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {([
                    ['Driver', b.driver_name ?? 'Unassigned'],
                    ['Capacity', `${b.student_count} / ${b.capacity}`],
                  ] as const).map(([l, v]) => (
                    <div key={l} className="bg-[#F8FAFC] rounded-lg px-3 py-2.5 border border-[#E2E8F0]">
                      <div className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wide mb-1">{l}</div>
                      <div className="text-[13px] font-semibold text-[#0F172A] truncate">{v}</div>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] text-[#64748B]">Capacity</span>
                    <span className="text-[11px] font-semibold" style={{ color: barColor }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(b)}
                    className="flex-1 bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg py-2 text-[12px] font-medium hover:bg-[#F1F5F9] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setAssignBus(b)}
                    className="flex-1 bg-[#EFF6FF] text-[#1E3A8A] border border-[#BFDBFE] rounded-lg py-2 text-[12px] font-medium hover:bg-[#DBEAFE] transition-colors"
                  >
                    Assign Driver
                  </button>
                  <button
                    onClick={() => setDeleteBus(b)}
                    className="w-9 h-9 bg-[#FEF2F2] text-[#EF4444] border border-[#FEE2E2] rounded-lg flex items-center justify-center hover:bg-[#FEE2E2] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Fleet mini-list for overview (used in page.tsx overview section) ── */}
      {/* This data structure is also exported for the overview panel */}

      {/* ── Add Bus Modal ── */}
      {addOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setAddOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-[480px] shadow-[0_20px_60px_-15px_rgb(0_0_0/0.3)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <span className="text-lg font-bold text-[#0F172A]">Add New Bus</span>
              <CloseBtn onClick={() => setAddOpen(false)} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Bus Name / Number</label>
                  <input
                    value={addName}
                    onChange={e => setAddName(e.target.value)}
                    type="text"
                    placeholder="e.g. Bus #14"
                    className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Capacity</label>
                  <input
                    value={addCapacity}
                    onChange={e => setAddCapacity(e.target.value)}
                    type="number"
                    placeholder="40"
                    className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-2">Route Color</label>
                <div className="flex gap-2">
                  {BUS_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setAddColor(c)}
                      className="w-7 h-7 rounded-full border-2 transition-all"
                      style={{
                        background: c,
                        borderColor: addColor === c ? '#0F172A' : 'transparent',
                        transform: addColor === c ? 'scale(1.15)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-1">
                <button onClick={() => setAddOpen(false)} className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm font-medium">Cancel</button>
                <button
                  onClick={handleAdd}
                  disabled={!addName.trim() || loading}
                  className="bg-[#1E3A8A] text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60 flex items-center gap-2"
                >
                  {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Add Bus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Bus Modal ── */}
      {editBus && (
        <div className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setEditBus(null)}>
          <div className="bg-white rounded-2xl p-6 w-[480px] shadow-[0_20px_60px_-15px_rgb(0_0_0/0.3)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <span className="text-lg font-bold text-[#0F172A]">Edit {editBus.name}</span>
              <CloseBtn onClick={() => setEditBus(null)} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Bus Name</label>
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    type="text"
                    className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Capacity</label>
                  <input
                    value={editCapacity}
                    onChange={e => setEditCapacity(e.target.value)}
                    type="number"
                    className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-2">Route Color</label>
                <div className="flex gap-2">
                  {BUS_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setEditColor(c)}
                      className="w-7 h-7 rounded-full border-2 transition-all"
                      style={{
                        background: c,
                        borderColor: editColor === c ? '#0F172A' : 'transparent',
                        transform: editColor === c ? 'scale(1.15)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editActive}
                    onChange={e => setEditActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#E2E8F0] peer-checked:bg-[#1E3A8A] rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
                <span className="text-sm text-[#0F172A]">Bus is active</span>
              </div>
              <div className="flex gap-2 justify-end mt-1">
                <button onClick={() => setEditBus(null)} className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm font-medium">Cancel</button>
                <button
                  onClick={handleEdit}
                  disabled={loading}
                  className="bg-[#1E3A8A] text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60 flex items-center gap-2"
                >
                  {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Assign Driver Modal (invite-based) ── */}
      {assignBus && (
        <div className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-sm flex items-center justify-center z-50" onClick={closeAssign}>
          <div className="bg-white rounded-2xl p-6 w-[460px] shadow-[0_20px_60px_-15px_rgb(0_0_0/0.3)]" onClick={e => e.stopPropagation()}>
            {inviteLink ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-[#0F172A]">Driver Invite Link</span>
                  <CloseBtn onClick={closeAssign} />
                </div>
                <p className="text-sm text-[#64748B] mb-4">
                  Share this link with the driver. When they sign up, they will be automatically assigned to <span className="font-semibold text-[#0F172A]">{assignBus.name}</span>.
                </p>
                <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2.5 mb-4">
                  <span className="flex-1 text-[12px] text-[#0F172A] truncate font-mono">{inviteLink}</span>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 flex items-center gap-1.5 bg-[#1E3A8A] text-white rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[#1e40af]"
                  >
                    {copied ? (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-[#94A3B8]">Link expires in 7 days · Single use</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-[#0F172A]">Assign Driver</span>
                  <CloseBtn onClick={closeAssign} />
                </div>
                <p className="text-sm text-[#64748B] mb-5">{assignBus.name} · {assignBus.student_count} students assigned</p>
                <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl px-4 py-3 mb-5 text-sm text-[#1E3A8A]">
                  Generate a one-time invite link. The driver clicks it, creates an account, and is automatically assigned to this bus and sent the RouteyAI driver app.
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={closeAssign} className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm font-medium">Cancel</button>
                  <button
                    onClick={handleGenerateInvite}
                    disabled={loading}
                    className="bg-[#1E3A8A] text-white rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2 disabled:opacity-60"
                  >
                    {loading
                      ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                    }
                    Generate Invite Link
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ── */}
      {deleteBus && (
        <div className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDeleteBus(null)}>
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-[0_20px_60px_-15px_rgb(0_0_0/0.3)]" onClick={e => e.stopPropagation()}>
            <div className="w-11 h-11 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#0F172A] mb-1">Remove {deleteBus.name}?</h2>
            <p className="text-sm text-[#64748B] mb-1">This will remove the bus from your fleet.</p>
            {deleteBus.student_count > 0 && (
              <p className="text-sm text-[#F59E0B] font-medium mb-5">
                {deleteBus.student_count} student{deleteBus.student_count !== 1 ? 's' : ''} will be unassigned.
              </p>
            )}
            {deleteBus.student_count === 0 && <div className="mb-5" />}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteBus(null)} className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm font-medium">Cancel</button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="bg-[#EF4444] text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-60 flex items-center gap-2"
              >
                {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Remove Bus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
