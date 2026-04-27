'use client'

import { useState } from 'react'
import { FleetMapSvg } from '@/components/maps/FleetMapSvg'

type RouteStatus = 'active' | 'scheduled' | 'idle'

interface Route {
  id: number
  name: string
  bus: string
  stops: number
  students: number
  status: RouteStatus
  color: string
  pct: number
  startTime: string
  notes: string
}

const INITIAL_ROUTES: Route[] = [
  { id:1, name:'Route A', bus:'Bus #3',  stops:12, students:28, status:'active',    color:'#3B82F6', pct:70,  startTime:'7:00 AM', notes:'' },
  { id:2, name:'Route B', bus:'Bus #7',  stops:9,  students:35, status:'active',    color:'#10B981', pct:87,  startTime:'7:15 AM', notes:'' },
  { id:3, name:'Route C', bus:'Bus #12', stops:7,  students:18, status:'scheduled', color:'#F59E0B', pct:45,  startTime:'2:30 PM', notes:'' },
  { id:4, name:'Route D', bus:'Bus #5',  stops:14, students:40, status:'active',    color:'#8B5CF6', pct:100, startTime:'7:05 AM', notes:'' },
]

const STATUS_STYLE: Record<RouteStatus, { bg: string; text: string }> = {
  active:    { bg: '#D1FAE5', text: '#059669' },
  scheduled: { bg: '#FEF3C7', text: '#D97706' },
  idle:      { bg: '#F1F5F9', text: '#64748B' },
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

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>(INITIAL_ROUTES)
  const [selected, setSelected]             = useState<Route | null>(null)
  const [editRoute, setEditRoute]           = useState<Route | null>(null)
  const [recalcRoute, setRecalcRoute]       = useState<Route | null>(null)
  const [recalcLoading, setRecalcLoading]   = useState(false)
  const [recalcDone, setRecalcDone]         = useState(false)

  // Edit form state
  const [editName,      setEditName]      = useState('')
  const [editBus,       setEditBus]       = useState('')
  const [editStartTime, setEditStartTime] = useState('')
  const [editNotes,     setEditNotes]     = useState('')
  const [editStatus,    setEditStatus]    = useState<RouteStatus>('active')

  const openEdit = (r: Route) => {
    setEditRoute(r)
    setEditName(r.name)
    setEditBus(r.bus)
    setEditStartTime(r.startTime)
    setEditNotes(r.notes)
    setEditStatus(r.status)
  }

  const handleEdit = () => {
    if (!editRoute) return
    const updated: Route = {
      ...editRoute,
      name: editName || editRoute.name,
      bus: editBus || editRoute.bus,
      startTime: editStartTime || editRoute.startTime,
      notes: editNotes,
      status: editStatus,
    }
    setRoutes(prev => prev.map(r => r.id === editRoute.id ? updated : r))
    if (selected?.id === editRoute.id) setSelected(updated)
    setEditRoute(null)
  }

  const openRecalc = (r: Route) => {
    setRecalcRoute(r)
    setRecalcDone(false)
  }

  const handleRecalc = () => {
    setRecalcLoading(true)
    setTimeout(() => {
      setRecalcLoading(false)
      setRecalcDone(true)
      if (recalcRoute) {
        const newStops = recalcRoute.stops + Math.floor(Math.random() * 2) - 1
        const updated = { ...recalcRoute, stops: Math.max(3, newStops) }
        setRoutes(prev => prev.map(r => r.id === recalcRoute.id ? updated : r))
        setRecalcRoute(updated)
        if (selected?.id === recalcRoute.id) setSelected(updated)
      }
    }, 2200)
  }

  return (
    <div className="p-7 max-w-[1280px]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] leading-tight">Route Management</h1>
          <p className="text-sm text-[#64748B] mt-0.5">{routes.length} routes · AI-optimized</p>
        </div>
        <button
          onClick={() => routes.forEach(r => openRecalc(r)) || openRecalc(routes[0]!)}
          className="flex items-center gap-2 bg-[#1E3A8A] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#1e40af] transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
          Optimize All Routes
        </button>
      </div>

      <div className="grid grid-cols-[340px_1fr] gap-5">
        {/* Route list */}
        <div className="flex flex-col gap-3">
          {routes.map(r => {
            const ss = STATUS_STYLE[r.status]
            return (
              <div
                key={r.id}
                onClick={() => setSelected(r)}
                className="bg-white rounded-2xl border shadow-[0_1px_2px_0_rgb(0_0_0/0.04)] p-4 cursor-pointer transition-all hover:shadow-md"
                style={{ borderColor: selected?.id === r.id ? r.color : '#E2E8F0', borderWidth: 1.5 }}
              >
                <div className="flex justify-between items-start mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: r.color }} />
                    <span className="text-[15px] font-bold text-[#0F172A]">{r.name}</span>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: ss.bg, color: ss.text }}>
                    {r.status}
                  </span>
                </div>
                <div className="text-xs text-[#64748B] mb-1">{r.bus} · {r.stops} stops · {r.students} students</div>
                <div className="text-[11px] text-[#94A3B8] mb-2.5">Starts {r.startTime}</div>
                <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${r.pct}%`, background: r.color }} />
                </div>
                <div className="text-[11px] text-[#94A3B8] mt-1">{r.pct}% capacity</div>
              </div>
            )
          })}
        </div>

        {/* Detail panel */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgb(0_0_0/0.04)] p-5">
          {selected ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: selected.color }} />
                  <span className="text-sm font-bold text-[#0F172A]">{selected.name} — {selected.bus}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(selected)}
                    className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-3.5 py-1.5 text-xs font-medium hover:bg-[#F1F5F9] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openRecalc(selected)}
                    className="bg-[#FEF2F2] text-[#EF4444] border border-[#FEE2E2] rounded-lg px-3.5 py-1.5 text-xs font-medium hover:bg-[#FEE2E2] transition-colors"
                  >
                    Recalculate
                  </button>
                </div>
              </div>
              <div className="flex flex-col" style={{ minHeight: 320 }}>
                <FleetMapSvg />
              </div>
              <div className="grid grid-cols-4 gap-3 mt-4">
                {([['Stops', selected.stops], ['Students', selected.students], ['Capacity', `${selected.pct}%`], ['Start', selected.startTime]] as const).map(([l, v]) => (
                  <div key={l} className="bg-[#F8FAFC] rounded-xl p-3 text-center border border-[#E2E8F0]">
                    <div className="text-xl font-bold text-[#0F172A]">{v}</div>
                    <div className="text-[11px] text-[#64748B]">{l}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-72 text-[#94A3B8]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="mb-3 opacity-40">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
              </svg>
              <span className="text-sm">Select a route to view details</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Edit Route Modal ── */}
      {editRoute && (
        <div className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setEditRoute(null)}>
          <div className="bg-white rounded-2xl p-6 w-[460px] shadow-[0_20px_60px_-15px_rgb(0_0_0/0.3)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <span className="text-lg font-bold text-[#0F172A]">Edit {editRoute.name}</span>
              <CloseBtn onClick={() => setEditRoute(null)} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Route Name</label>
                  <input value={editName} onChange={e => setEditName(e.target.value)} type="text" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Assigned Bus</label>
                  <input value={editBus} onChange={e => setEditBus(e.target.value)} type="text" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Start Time</label>
                  <input value={editStartTime} onChange={e => setEditStartTime(e.target.value)} type="text" placeholder="e.g. 7:00 AM" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Status</label>
                  <select value={editStatus} onChange={e => setEditStatus(e.target.value as RouteStatus)} className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none">
                    <option value="active">Active</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="idle">Idle</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Notes</label>
                <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={2} placeholder="Any special instructions or notes…" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none resize-none" />
              </div>
              <div className="flex gap-2 justify-end mt-1">
                <button onClick={() => setEditRoute(null)} className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm font-medium">Cancel</button>
                <button onClick={handleEdit} className="bg-[#1E3A8A] text-white rounded-lg px-4 py-2 text-sm font-semibold">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Recalculate Modal ── */}
      {recalcRoute && (
        <div className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => !recalcLoading && setRecalcRoute(null)}>
          <div className="bg-white rounded-2xl p-6 w-[420px] shadow-[0_20px_60px_-15px_rgb(0_0_0/0.3)]" onClick={e => e.stopPropagation()}>
            {!recalcDone ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-[#0F172A]">Recalculate Route</span>
                  {!recalcLoading && <CloseBtn onClick={() => setRecalcRoute(null)} />}
                </div>
                <p className="text-sm text-[#64748B] mb-5">{recalcRoute.name} · {recalcRoute.bus} · {recalcRoute.students} students</p>

                {recalcLoading ? (
                  <div className="flex flex-col items-center py-6 gap-4">
                    <div className="relative w-14 h-14">
                      <div className="absolute inset-0 rounded-full border-4 border-[#E2E8F0]" />
                      <div className="absolute inset-0 rounded-full border-4 border-t-[#1E3A8A] animate-spin" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-[#0F172A]">Running AI optimization…</p>
                      <p className="text-xs text-[#94A3B8] mt-1">K-Means clustering · Nearest-Neighbor TSP</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 mb-5">
                      <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">This will:</p>
                      <ul className="flex flex-col gap-1.5 text-sm text-[#0F172A]">
                        <li className="flex items-center gap-2">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                          Re-cluster all {recalcRoute.students} student pickup points
                        </li>
                        <li className="flex items-center gap-2">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                          Re-order stops for shortest total distance
                        </li>
                        <li className="flex items-center gap-2">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                          Update ETAs for all parents on this route
                        </li>
                      </ul>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setRecalcRoute(null)} className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm font-medium">Cancel</button>
                      <button onClick={handleRecalc} className="bg-[#1E3A8A] text-white rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                          <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                        </svg>
                        Recalculate
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center py-4 text-center">
                <div className="w-14 h-14 rounded-full bg-[#D1FAE5] border border-[#6EE7B7] flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-1">Route Recalculated</h3>
                <p className="text-sm text-[#64748B] mb-2">{recalcRoute.name} has been optimized.</p>
                <p className="text-xs text-[#94A3B8] mb-6">Stop order and ETAs have been updated for all parents.</p>
                <button onClick={() => setRecalcRoute(null)} className="bg-[#1E3A8A] text-white rounded-lg px-6 py-2 text-sm font-semibold">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
