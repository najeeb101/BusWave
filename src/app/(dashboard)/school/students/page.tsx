'use client'

import { useState, useRef, useEffect } from 'react'

type StudentStatus = 'boarded' | 'absent' | 'waiting'

interface Student {
  id: number
  name: string
  grade: string
  bus: string
  stop: string
  status: StudentStatus
  time: string
  parentEmail: string
}

const BUSES_LIST = [
  { id: 1, num: 3,  route: 'Route A — Morning',   students: 28, capacity: 40 },
  { id: 2, num: 7,  route: 'Route B — Morning',   students: 35, capacity: 40 },
  { id: 3, num: 12, route: 'Route C — Afternoon', students: 18, capacity: 40 },
  { id: 4, num: 5,  route: 'Route D — Morning',   students: 40, capacity: 40 },
]

const INITIAL_STUDENTS: Student[] = [
  { id:1, name:'Aisha Rahman',   grade:'Grade 4', bus:'Bus #3', stop:'Lusail Blvd',    status:'boarded', time:'7:42 AM', parentEmail:'aisha.parent@email.com'   },
  { id:2, name:'Tariq Hassan',   grade:'Grade 6', bus:'Bus #3', stop:'C-Ring Rd',      status:'boarded', time:'7:31 AM', parentEmail:'tariq.parent@email.com'   },
  { id:3, name:'Sara Al-Farsi',  grade:'Grade 2', bus:'Bus #7', stop:'Pearl Drive',    status:'absent',  time:'—',       parentEmail:'sara.parent@email.com'    },
  { id:4, name:'Omar Khalil',    grade:'Grade 5', bus:'Bus #7', stop:'Al Waab St',     status:'boarded', time:'7:55 AM', parentEmail:'omar.parent@email.com'    },
  { id:5, name:'Noor Jaber',     grade:'Grade 3', bus:'Bus #12',stop:'Salwa Rd',       status:'waiting', time:'—',       parentEmail:'noor.parent@email.com'    },
  { id:6, name:'Khalid Mansour', grade:'Grade 7', bus:'Bus #5', stop:'Doha Expwy',     status:'boarded', time:'7:48 AM', parentEmail:'khalid.parent@email.com'  },
  { id:7, name:'Lina Qasem',     grade:'Grade 1', bus:'Bus #5', stop:'Education City', status:'boarded', time:'7:52 AM', parentEmail:'lina.parent@email.com'    },
  { id:8, name:'Yusuf Al-Ali',   grade:'Grade 8', bus:'Bus #3', stop:'West Bay',       status:'boarded', time:'7:38 AM', parentEmail:'yusuf.parent@email.com'   },
]

const STATUS_STYLE: Record<StudentStatus, { bg: string; text: string; label: string }> = {
  boarded: { bg: '#D1FAE5', text: '#059669', label: 'Boarded' },
  absent:  { bg: '#FEE2E2', text: '#DC2626', label: 'Absent'  },
  waiting: { bg: '#FEF3C7', text: '#D97706', label: 'Waiting' },
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

function RowMenu({ onEdit, onChangeBus, onRemove }: { onEdit: () => void; onChangeBus: () => void; onRemove: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-8 h-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center justify-center hover:bg-[#F1F5F9] transition-colors"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-9 w-40 bg-white rounded-xl border border-[#E2E8F0] shadow-[0_8px_24px_-4px_rgb(0_0_0/0.12)] z-20 overflow-hidden">
          <button
            onClick={() => { setOpen(false); onEdit() }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-[#0F172A] hover:bg-[#F8FAFC] transition-colors text-left"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Student
          </button>
          <button
            onClick={() => { setOpen(false); onChangeBus() }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-[#0F172A] hover:bg-[#F8FAFC] transition-colors text-left"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/>
              <path d="M18 18h3s.5-1.7.8-4.3c.3-2.7.2-7.7.2-7.7H2S1.7 7 2 9.7c.3 2.6.8 4.3.8 4.3H5"/>
              <circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
            </svg>
            Change Bus
          </button>
          <div className="h-px bg-[#F1F5F9] mx-2" />
          <button
            onClick={() => { setOpen(false); onRemove() }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-[#EF4444] hover:bg-[#FEF2F2] transition-colors text-left"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
            Remove
          </button>
        </div>
      )}
    </div>
  )
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS)
  const [search,   setSearch]   = useState('')
  const [addOpen,  setAddOpen]  = useState(false)
  const [editStudent,    setEditStudent]    = useState<Student | null>(null)
  const [changeBusStudent, setChangeBusStudent] = useState<Student | null>(null)
  const [deleteStudent,  setDeleteStudent]  = useState<Student | null>(null)

  // Add form
  const [addName,        setAddName]        = useState('')
  const [addGrade,       setAddGrade]       = useState('')
  const [addAddress,     setAddAddress]     = useState('')
  const [addParentEmail, setAddParentEmail] = useState('')
  const [addBusId,       setAddBusId]       = useState(String(BUSES_LIST[0]?.id ?? 1))

  // Edit form
  const [editName,        setEditName]        = useState('')
  const [editGrade,       setEditGrade]       = useState('')
  const [editStop,        setEditStop]        = useState('')
  const [editParentEmail, setEditParentEmail] = useState('')

  // Change bus
  const [newBusId, setNewBusId] = useState('')

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.bus.toLowerCase().includes(search.toLowerCase()) ||
    s.grade.toLowerCase().includes(search.toLowerCase())
  )

  const openEdit = (s: Student) => {
    setEditStudent(s)
    setEditName(s.name)
    setEditGrade(s.grade)
    setEditStop(s.stop)
    setEditParentEmail(s.parentEmail)
  }

  const openChangeBus = (s: Student) => {
    setChangeBusStudent(s)
    const match = BUSES_LIST.find(b => `Bus #${b.num}` === s.bus)
    setNewBusId(String(match?.id ?? BUSES_LIST[0]?.id ?? 1))
  }

  const handleAdd = () => {
    if (!addName) return
    const bus = BUSES_LIST.find(b => b.id === Number(addBusId))
    const newStudent: Student = {
      id: Date.now(),
      name: addName,
      grade: addGrade || 'Grade 1',
      bus: bus ? `Bus #${bus.num}` : 'Unassigned',
      stop: addAddress,
      status: 'waiting',
      time: '—',
      parentEmail: addParentEmail,
    }
    setStudents(prev => [...prev, newStudent])
    setAddOpen(false)
    setAddName(''); setAddGrade(''); setAddAddress(''); setAddParentEmail(''); setAddBusId(String(BUSES_LIST[0]?.id ?? 1))
  }

  const handleEdit = () => {
    if (!editStudent) return
    setStudents(prev => prev.map(s => s.id === editStudent.id ? {
      ...s,
      name: editName || s.name,
      grade: editGrade || s.grade,
      stop: editStop || s.stop,
      parentEmail: editParentEmail || s.parentEmail,
    } : s))
    setEditStudent(null)
  }

  const handleChangeBus = () => {
    if (!changeBusStudent) return
    const bus = BUSES_LIST.find(b => b.id === Number(newBusId))
    if (!bus) return
    setStudents(prev => prev.map(s => s.id === changeBusStudent.id ? { ...s, bus: `Bus #${bus.num}` } : s))
    setChangeBusStudent(null)
  }

  const handleDelete = () => {
    if (!deleteStudent) return
    setStudents(prev => prev.filter(s => s.id !== deleteStudent.id))
    setDeleteStudent(null)
  }

  return (
    <div className="p-7 max-w-[1280px]">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] leading-tight">Student Roster</h1>
          <p className="text-sm text-[#64748B] mt-0.5">{students.length} students registered</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-[#1E3A8A] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#1e40af] transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Student
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgb(0_0_0/0.04)] p-5">
        {/* Search */}
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, bus or grade…"
            className="w-full border border-[#E2E8F0] rounded-xl py-2.5 pl-9 pr-3 text-[13px] text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
          />
        </div>

        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC]">
              {['Student','Grade','Bus','Stop','Status','Time',''].map(h => (
                <th key={h} className="px-3.5 py-2.5 text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wide border-b border-[#E2E8F0]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const ss       = STATUS_STYLE[s.status]
              const initials = s.name.split(' ').map(n => n[0] ?? '').join('')
              return (
                <tr key={s.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-3.5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[13px] font-bold text-[#1E3A8A] shrink-0">
                        {initials}
                      </div>
                      <span className="text-sm font-semibold text-[#0F172A]">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-3.5 py-3 text-[13px] text-[#64748B]">{s.grade}</td>
                  <td className="px-3.5 py-3 text-[13px] font-medium text-[#0F172A]">{s.bus}</td>
                  <td className="px-3.5 py-3 text-[13px] text-[#64748B]">{s.stop}</td>
                  <td className="px-3.5 py-3">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: ss.bg, color: ss.text }}>
                      {ss.label}
                    </span>
                  </td>
                  <td className="px-3.5 py-3 text-[13px] text-[#64748B] font-mono">{s.time}</td>
                  <td className="px-3.5 py-3">
                    <RowMenu
                      onEdit={() => openEdit(s)}
                      onChangeBus={() => openChangeBus(s)}
                      onRemove={() => setDeleteStudent(s)}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── Add Student Modal ── */}
      {addOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setAddOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-[480px] shadow-[0_20px_60px_-15px_rgb(0_0_0/0.3)] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <span className="text-lg font-bold text-[#0F172A]">Add New Student</span>
              <CloseBtn onClick={() => setAddOpen(false)} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Full Name</label>
                  <input value={addName} onChange={e => setAddName(e.target.value)} type="text" placeholder="e.g. Sarah Abdullah" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Grade</label>
                  <input value={addGrade} onChange={e => setAddGrade(e.target.value)} type="text" placeholder="e.g. Grade 3" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Home Address</label>
                <input value={addAddress} onChange={e => setAddAddress(e.target.value)} type="text" placeholder="Start typing to search address…" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Parent Email</label>
                <input value={addParentEmail} onChange={e => setAddParentEmail(e.target.value)} type="email" placeholder="parent@email.com" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Assign to Bus</label>
                <select value={addBusId} onChange={e => setAddBusId(e.target.value)} className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none">
                  {BUSES_LIST.map(b => (
                    <option key={b.id} value={b.id}>Bus #{b.num} — {b.route} ({b.students}/{b.capacity})</option>
                  ))}
                </select>
              </div>
              <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl px-3 py-2.5 flex items-start gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="text-xs text-[#1E3A8A]">Smart Placement will auto-assign this student to the nearest existing stop cluster on the selected bus route.</p>
              </div>
              <div className="flex gap-2 justify-end mt-1">
                <button onClick={() => setAddOpen(false)} className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm font-medium">Cancel</button>
                <button onClick={handleAdd} className="bg-[#1E3A8A] text-white rounded-lg px-4 py-2 text-sm font-semibold">Add Student</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Student Modal ── */}
      {editStudent && (
        <div className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setEditStudent(null)}>
          <div className="bg-white rounded-2xl p-6 w-[480px] shadow-[0_20px_60px_-15px_rgb(0_0_0/0.3)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <span className="text-lg font-bold text-[#0F172A]">Edit Student</span>
              <CloseBtn onClick={() => setEditStudent(null)} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Full Name</label>
                  <input value={editName} onChange={e => setEditName(e.target.value)} type="text" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Grade</label>
                  <input value={editGrade} onChange={e => setEditGrade(e.target.value)} type="text" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Bus Stop / Address</label>
                <input value={editStop} onChange={e => setEditStop(e.target.value)} type="text" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Parent Email</label>
                <input value={editParentEmail} onChange={e => setEditParentEmail(e.target.value)} type="email" className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors" />
              </div>
              <div className="flex gap-2 justify-end mt-1">
                <button onClick={() => setEditStudent(null)} className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm font-medium">Cancel</button>
                <button onClick={handleEdit} className="bg-[#1E3A8A] text-white rounded-lg px-4 py-2 text-sm font-semibold">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Change Bus Modal ── */}
      {changeBusStudent && (
        <div className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setChangeBusStudent(null)}>
          <div className="bg-white rounded-2xl p-6 w-[420px] shadow-[0_20px_60px_-15px_rgb(0_0_0/0.3)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-[#0F172A]">Change Bus</span>
              <CloseBtn onClick={() => setChangeBusStudent(null)} />
            </div>
            <p className="text-sm text-[#64748B] mb-5">{changeBusStudent.name} · currently on {changeBusStudent.bus}</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">New Bus Assignment</label>
                <select value={newBusId} onChange={e => setNewBusId(e.target.value)} className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none">
                  {BUSES_LIST.map(b => {
                    const isFull = b.students >= b.capacity
                    return (
                      <option key={b.id} value={b.id} disabled={isFull}>
                        Bus #{b.num} — {b.route} ({b.students}/{b.capacity}){isFull ? ' · FULL' : ''}
                      </option>
                    )
                  })}
                </select>
              </div>
              <div className="flex gap-2 justify-end mt-1">
                <button onClick={() => setChangeBusStudent(null)} className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm font-medium">Cancel</button>
                <button onClick={handleChangeBus} className="bg-[#1E3A8A] text-white rounded-lg px-4 py-2 text-sm font-semibold">Reassign</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ── */}
      {deleteStudent && (
        <div className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDeleteStudent(null)}>
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-[0_20px_60px_-15px_rgb(0_0_0/0.3)]" onClick={e => e.stopPropagation()}>
            <div className="w-11 h-11 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#0F172A] mb-1">Remove {deleteStudent.name}?</h2>
            <p className="text-sm text-[#64748B] mb-5">This will remove the student from the roster and unassign them from {deleteStudent.bus}.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteStudent(null)} className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm font-medium">Cancel</button>
              <button onClick={handleDelete} className="bg-[#EF4444] text-white rounded-lg px-4 py-2 text-sm font-semibold">Remove Student</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
