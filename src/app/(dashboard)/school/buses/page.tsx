'use client'

import { useState } from 'react'

type BusStatus = 'active' | 'full' | 'idle'

interface Bus {
  id: number
  num: number
  driver: string
  driverEmail: string
  capacity: number
  students: number
  status: BusStatus
  route: string
}

const INITIAL_BUSES: Bus[] = [
  { id: 1, num: 3,  driver: 'Mohammed Al-Rashid', driverEmail: 'mohammed@alnour.edu.qa', capacity: 40, students: 28, status: 'active', route: 'Route A — Morning'   },
  { id: 2, num: 7,  driver: 'Fatima Al-Zahra',    driverEmail: 'fatima@alnour.edu.qa',   capacity: 40, students: 35, status: 'active', route: 'Route B — Morning'   },
  { id: 3, num: 12, driver: 'Ahmed Khalil',        driverEmail: 'ahmed@alnour.edu.qa',    capacity: 40, students: 18, status: 'idle',   route: 'Route C — Afternoon' },
  { id: 4, num: 5,  driver: 'Nora Hassan',         driverEmail: 'nora@alnour.edu.qa',     capacity: 40, students: 40, status: 'full',   route: 'Route D — Morning'  },
]

const STATUS_STYLE: Record<BusStatus, { bg: string; text: string; label: string }> = {
  active: { bg: '#D1FAE5', text: '#059669', label: 'Active' },
  full:   { bg: '#FEF3C7', text: '#D97706', label: 'At capacity' },
  idle:   { bg: '#F1F5F9', text: '#64748B', label: 'Idle' },
}

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

export default function BusesPage() {
  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES)
  const [addOpen, setAddOpen]     = useState(false)
  const [editBus, setEditBus]     = useState<Bus | null>(null)
  const [deleteBus, setDeleteBus] = useState<Bus | null>(null)
  const [assignBus, setAssignBus] = useState<Bus | null>(null)

  // Add form state
  const [addNum,         setAddNum]         = useState('')
  const [addCapacity,    setAddCapacity]     = useState('40')
  const [addDriverName,  setAddDriverName]   = useState('')
  const [addDriverEmail, setAddDriverEmail]  = useState('')
  const [addRoute,       setAddRoute]        = useState('')

  // Edit form state (mirrors add)
  const [editNum,         setEditNum]         = useState('')
  const [editCapacity,    setEditCapacity]    = useState('')
  const [editDriverName,  setEditDriverName]  = useState('')
  const [editDriverEmail, setEditDriverEmail] = useState('')
  const [editRoute,       setEditRoute]       = useState('')

  // Assign driver state
  const [assignName,  setAssignName]  = useState('')
  const [assignEmail, setAssignEmail] = useState('')

  const openEdit = (b: Bus) => {
    setEditBus(b)
    setEditNum(String(b.num))
    setEditCapacity(String(b.capacity))
    setEditDriverName(b.driver)
    setEditDriverEmail(b.driverEmail)
    setEditRoute(b.route)
  }

  const openAssign = (b: Bus) => {
    setAssignBus(b)
    setAssignName(b.driver)
    setAssignEmail(b.driverEmail)
  }

  const handleAdd = () => {
    if (!addNum) return
    const newBus: Bus = {
      id: Date.now(),
      num: Number(addNum),
      driver: addDriverName || 'Unassigned',
      driverEmail: addDriverEmail,
      capacity: Number(addCapacity) || 40,
      students: 0,
      status: 'idle',
      route: addRoute || 'Unassigned',
    }
    setBuses(prev => [...prev, newBus])
    setAddOpen(false)
    setAddNum(''); setAddCapacity('40'); setAddDriverName(''); setAddDriverEmail(''); setAddRoute('')
  }

  const handleEdit = () => {
    if (!editBus) return
    setBuses(prev => prev.map(b => b.id === editBus.id ? {
      ...b,
      num: Number(editNum) || b.num,
      capacity: Number(editCapacity) || b.capacity,
      driver: editDriverName || b.driver,
      driverEmail: editDriverEmail || b.driverEmail,
      route: editRoute || b.route,
    } : b))
    setEditBus(null)
  }

  const handleDelete = () => {
    if (!deleteBus) return
    setBuses(prev => prev.filter(b => b.id !== deleteBus.id))
    setDeleteBus(null)
  }

  const handleAssign = () => {
    if (!assignBus) return
    setBuses(prev => prev.map(b => b.id === assignBus.id ? {
      ...b,
      driver: assignName || b.driver,
      driverEmail: assignEmail || b.driverEmail,
      status: assignName ? 'active' : 'idle',
    } : b))
    setAssignBus(null)
  }

  return (
    <div className="p-7 max-w-[1280px]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] leading-tight">Fleet Management</h1>
          <p className="text-sm text-[#64748B] mt-0.5">{buses.length} buses registered</p>
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

      <div className="grid grid-cols-2 gap-5">
        {buses.map(b => {
          const ss  = STATUS_STYLE[b.status]
          const pct = Math.round((b.students / b.capacity) * 100)
          const barColor = pct > 90 ? '#EF4444' : pct > 70 ? '#F59E0B' : '#10B981'

          return (
            <div key={b.id} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgb(0_0_0/0.04)] p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
                    <BusIcon color="#1E3A8A" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[#0F172A]">Bus #{b.num}</div>
                    <div className="text-xs text-[#64748B]">{b.route}</div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: ss.bg, color: ss.text }}>
                  {ss.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {([['Driver', b.driver], ['Capacity', `${b.students} / ${b.capacity}`]] as const).map(([l, v]) => (
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
                  onClick={() => openAssign(b)}
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
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Bus Number / Plate</label>
                  <input value={addNum} onChange={e => setAddNum(e.target.value)} type="text" placeholder="e.g. 14" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Capacity</label>
                  <input value={addCapacity} onChange={e => setAddCapacity(e.target.value)} type="number" placeholder="40" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Route Name</label>
                <input value={addRoute} onChange={e => setAddRoute(e.target.value)} type="text" placeholder="e.g. Route E — Morning" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
              </div>
              <div className="pt-1 border-t border-[#F1F5F9]">
                <p className="text-[11px] text-[#94A3B8] mb-3">Driver (optional — assign later)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Driver Name</label>
                    <input value={addDriverName} onChange={e => setAddDriverName(e.target.value)} type="text" placeholder="Full name" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Driver Email</label>
                    <input value={addDriverEmail} onChange={e => setAddDriverEmail(e.target.value)} type="email" placeholder="driver@school.edu" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-1">
                <button onClick={() => setAddOpen(false)} className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm font-medium">Cancel</button>
                <button onClick={handleAdd} className="bg-[#1E3A8A] text-white rounded-lg px-4 py-2 text-sm font-semibold">Add Bus</button>
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
              <span className="text-lg font-bold text-[#0F172A]">Edit Bus #{editBus.num}</span>
              <CloseBtn onClick={() => setEditBus(null)} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Bus Number</label>
                  <input value={editNum} onChange={e => setEditNum(e.target.value)} type="text" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Capacity</label>
                  <input value={editCapacity} onChange={e => setEditCapacity(e.target.value)} type="number" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Route Name</label>
                <input value={editRoute} onChange={e => setEditRoute(e.target.value)} type="text" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
              </div>
              <div className="pt-1 border-t border-[#F1F5F9]">
                <p className="text-[11px] text-[#94A3B8] mb-3">Driver details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Driver Name</label>
                    <input value={editDriverName} onChange={e => setEditDriverName(e.target.value)} type="text" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Driver Email</label>
                    <input value={editDriverEmail} onChange={e => setEditDriverEmail(e.target.value)} type="email" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-1">
                <button onClick={() => setEditBus(null)} className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm font-medium">Cancel</button>
                <button onClick={handleEdit} className="bg-[#1E3A8A] text-white rounded-lg px-4 py-2 text-sm font-semibold">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Assign Driver Modal ── */}
      {assignBus && (
        <div className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setAssignBus(null)}>
          <div className="bg-white rounded-2xl p-6 w-[420px] shadow-[0_20px_60px_-15px_rgb(0_0_0/0.3)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-[#0F172A]">Assign Driver</span>
              <CloseBtn onClick={() => setAssignBus(null)} />
            </div>
            <p className="text-sm text-[#64748B] mb-5">Bus #{assignBus.num} · {assignBus.route}</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Driver Full Name</label>
                <input value={assignName} onChange={e => setAssignName(e.target.value)} type="text" placeholder="e.g. Khalid Al-Rashid" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Driver Email</label>
                <input value={assignEmail} onChange={e => setAssignEmail(e.target.value)} type="email" placeholder="driver@school.edu" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
              </div>
              <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl px-3 py-2.5 text-xs text-[#1E3A8A]">
                An invite will be sent to the driver to download the RouteyAI driver app.
              </div>
              <div className="flex gap-2 justify-end mt-1">
                <button onClick={() => setAssignBus(null)} className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm font-medium">Cancel</button>
                <button onClick={handleAssign} className="bg-[#1E3A8A] text-white rounded-lg px-4 py-2 text-sm font-semibold">Assign Driver</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteBus && (
        <div className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDeleteBus(null)}>
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-[0_20px_60px_-15px_rgb(0_0_0/0.3)]" onClick={e => e.stopPropagation()}>
            <div className="w-11 h-11 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#0F172A] mb-1">Remove Bus #{deleteBus.num}?</h2>
            <p className="text-sm text-[#64748B] mb-1">This will remove the bus from your fleet.</p>
            {deleteBus.students > 0 && (
              <p className="text-sm text-[#F59E0B] font-medium mb-5">{deleteBus.students} student{deleteBus.students !== 1 ? 's' : ''} will be unassigned and need reassignment.</p>
            )}
            {deleteBus.students === 0 && <div className="mb-5" />}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteBus(null)} className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm font-medium">Cancel</button>
              <button onClick={handleDelete} className="bg-[#EF4444] text-white rounded-lg px-4 py-2 text-sm font-semibold">Remove Bus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
