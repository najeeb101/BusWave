'use client'

import { useState } from 'react'

interface School {
  id: number
  name: string
  address: string
  city: string
  admin: string
  adminEmail: string
  buses: number
  students: number
  joined: string
  status: 'active' | 'pending'
}

const INITIAL_SCHOOLS: School[] = [
  { id: 1, name: 'Doha International Academy',   address: 'Al Waab St, West Bay',   city: 'Doha',           admin: 'Sara Al-Mannai',    adminEmail: 'school@doha-academy.qa',  buses: 3,  students: 40,  joined: 'Jan 2024', status: 'active'  },
  { id: 2, name: 'Al Nour International School',  address: 'Al Sadd Street',         city: 'Doha',           admin: 'Khalid Al-Rashidi', adminEmail: 'admin@alnour.edu.qa',     buses: 4,  students: 62,  joined: 'Mar 2024', status: 'active'  },
  { id: 3, name: 'Lusail STEM Academy',           address: 'Marina District',        city: 'Lusail',         admin: 'Mariam Al-Jaber',   adminEmail: 'admin@lusail-stem.qa',    buses: 2,  students: 28,  joined: 'Apr 2024', status: 'active'  },
  { id: 4, name: 'Education City Primary',        address: 'Education City Road',    city: 'Al Rayyan',      admin: 'Ahmed Al-Kaabi',    adminEmail: 'admin@edcity.qa',         buses: 5,  students: 87,  joined: 'Apr 2024', status: 'active'  },
  { id: 5, name: 'New Horizons Academy',          address: 'Al Khor Corniche',       city: 'Al Khor',        admin: '—',                 adminEmail: '',                        buses: 0,  students: 0,   joined: 'Apr 2024', status: 'pending' },
]

type ModalMode = 'add' | 'edit' | 'assign' | null

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<School[]>(INITIAL_SCHOOLS)
  const [modal, setModal] = useState<ModalMode>(null)
  const [selected, setSelected] = useState<School | null>(null)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<School | null>(null)

  // form state
  const [form, setForm] = useState({ name: '', address: '', city: '', admin: '', adminEmail: '' })

  const filtered = schools.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setForm({ name: '', address: '', city: '', admin: '', adminEmail: '' })
    setSelected(null)
    setModal('add')
  }

  const openEdit = (s: School) => {
    setForm({ name: s.name, address: s.address, city: s.city, admin: s.admin, adminEmail: s.adminEmail })
    setSelected(s)
    setModal('edit')
  }

  const openAssign = (s: School) => {
    setForm({ name: s.name, address: s.address, city: s.city, admin: '', adminEmail: '' })
    setSelected(s)
    setModal('assign')
  }

  const handleSave = () => {
    if (modal === 'add') {
      setSchools(prev => [...prev, {
        id: Date.now(),
        name: form.name,
        address: form.address,
        city: form.city,
        admin: form.admin || '—',
        adminEmail: form.adminEmail,
        buses: 0,
        students: 0,
        joined: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
        status: form.admin ? 'active' : 'pending',
      }])
    } else if (modal === 'edit' && selected) {
      setSchools(prev => prev.map(s => s.id === selected.id
        ? { ...s, name: form.name, address: form.address, city: form.city }
        : s
      ))
    } else if (modal === 'assign' && selected) {
      setSchools(prev => prev.map(s => s.id === selected.id
        ? { ...s, admin: form.admin, adminEmail: form.adminEmail, status: 'active' }
        : s
      ))
    }
    setModal(null)
  }

  const handleDelete = () => {
    if (deleteTarget) {
      setSchools(prev => prev.filter(s => s.id !== deleteTarget.id))
      setDeleteTarget(null)
    }
  }

  return (
    <div className="p-7 max-w-[1280px]">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Schools</h1>
          <p className="text-sm text-[#64748B] mt-0.5">{schools.length} schools on the platform</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#1E3A8A] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#1e40af] transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add School
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search schools…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-[#E2E8F0] rounded-xl py-2.5 pl-9 pr-3 text-sm text-[#0F172A] bg-white outline-none focus:border-[#3B82F6] transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgb(0_0_0/0.04)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC]">
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">School</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">School Admin</th>
              <th className="text-center px-4 py-3.5 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">Buses</th>
              <th className="text-center px-4 py-3.5 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">Students</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">Status</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">Joined</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} className={`border-b border-[#F8FAFC] last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'} hover:bg-blue-50/40 transition-colors`}>
                <td className="px-5 py-4">
                  <div className="font-semibold text-[#0F172A] text-[13px]">{s.name}</div>
                  <div className="text-[11px] text-[#94A3B8]">{s.address}, {s.city}</div>
                </td>
                <td className="px-5 py-4">
                  {s.admin === '—' ? (
                    <button
                      onClick={() => openAssign(s)}
                      className="text-[12px] text-[#3B82F6] font-semibold hover:underline"
                    >
                      + Assign admin
                    </button>
                  ) : (
                    <div>
                      <div className="text-[13px] text-[#0F172A] font-medium">{s.admin}</div>
                      <div className="text-[11px] text-[#94A3B8]">{s.adminEmail}</div>
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 text-center text-[13px] font-semibold text-[#0F172A]">{s.buses}</td>
                <td className="px-4 py-4 text-center text-[13px] font-semibold text-[#0F172A]">{s.students}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full ${
                    s.status === 'active'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {s.status === 'active' ? 'Active' : 'Pending'}
                  </span>
                </td>
                <td className="px-5 py-4 text-[12px] text-[#94A3B8]">{s.joined}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => openEdit(s)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#1E3A8A] hover:bg-[#EFF6FF] transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(s)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#94A3B8]">
                  No schools match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-[480px] shadow-[0_20px_60px_-15px_rgb(0_0_0/0.3)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <span className="text-lg font-bold text-[#0F172A]">{modal === 'add' ? 'Add School' : 'Edit School'}</span>
              <button onClick={() => setModal(null)} className="w-7 h-7 bg-[#F1F5F9] rounded-lg flex items-center justify-center text-[#64748B]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">School name</label>
                <input
                  type="text"
                  placeholder="e.g. Al Nour International School"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Address</label>
                <input
                  type="text"
                  placeholder="Street address"
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">City</label>
                <input
                  type="text"
                  placeholder="e.g. Doha"
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>
              {modal === 'add' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">School admin name <span className="text-[#94A3B8] font-normal">(optional)</span></label>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={form.admin}
                      onChange={e => setForm(f => ({ ...f, admin: e.target.value }))}
                      className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">School admin email <span className="text-[#94A3B8] font-normal">(optional)</span></label>
                    <input
                      type="email"
                      placeholder="admin@school.edu.qa"
                      value={form.adminEmail}
                      onChange={e => setForm(f => ({ ...f, adminEmail: e.target.value }))}
                      className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                    />
                  </div>
                </>
              )}
              <div className="flex gap-2 justify-end mt-1">
                <button onClick={() => setModal(null)} className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm font-medium">Cancel</button>
                <button
                  onClick={handleSave}
                  disabled={!form.name || !form.address || !form.city}
                  className="bg-[#1E3A8A] text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50"
                >
                  {modal === 'add' ? 'Add School' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign admin modal */}
      {modal === 'assign' && selected && (
        <div className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-[440px] shadow-[0_20px_60px_-15px_rgb(0_0_0/0.3)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <span className="text-lg font-bold text-[#0F172A]">Assign School Admin</span>
              <button onClick={() => setModal(null)} className="w-7 h-7 bg-[#F1F5F9] rounded-lg flex items-center justify-center text-[#64748B]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="mb-4 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <div className="text-xs text-[#94A3B8] mb-0.5">Assigning admin to</div>
              <div className="text-sm font-semibold text-[#0F172A]">{selected.name}</div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Admin full name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.admin}
                  onChange={e => setForm(f => ({ ...f, admin: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Admin email</label>
                <input
                  type="email"
                  placeholder="admin@school.edu.qa"
                  value={form.adminEmail}
                  onChange={e => setForm(f => ({ ...f, adminEmail: e.target.value }))}
                  className="w-full border border-[#E2E8F0] rounded-xl py-2.5 px-3 text-sm text-[#0F172A] bg-[#FAFAFA] outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>
              <div className="flex gap-2 justify-end mt-1">
                <button onClick={() => setModal(null)} className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm font-medium">Cancel</button>
                <button
                  onClick={handleSave}
                  disabled={!form.admin || !form.adminEmail}
                  className="bg-[#1E3A8A] text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50"
                >
                  Assign Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-[0_20px_60px_-15px_rgb(0_0_0/0.3)]" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-1">Delete school?</h3>
            <p className="text-sm text-[#64748B] mb-5">
              <span className="font-semibold text-[#0F172A]">{deleteTarget.name}</span> and all its buses, students, and routes will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm font-medium">Cancel</button>
              <button onClick={handleDelete} className="bg-red-500 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-red-600 transition-colors">Delete School</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
