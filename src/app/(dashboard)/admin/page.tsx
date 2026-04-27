'use client'

import Link from 'next/link'
import { StatsCard } from '@/components/dashboard/StatsCard'

const SCHOOLS = [
  { id: 1, name: 'Doha International Academy',  city: 'West Bay, Doha',    buses: 3, students: 40, admin: 'Sara Al-Mannai',    joined: 'Jan 2024' },
  { id: 2, name: 'Al Nour International School', city: 'Al Sadd, Doha',    buses: 4, students: 62, admin: 'Khalid Al-Rashidi', joined: 'Mar 2024' },
  { id: 3, name: 'Lusail STEM Academy',          city: 'Lusail City',      buses: 2, students: 28, admin: 'Mariam Al-Jaber',   joined: 'Apr 2024' },
  { id: 4, name: 'Education City Primary',       city: 'Education City',   buses: 5, students: 87, admin: 'Ahmed Al-Kaabi',   joined: 'Apr 2024' },
]

const ACTIVITY = [
  { time: '9:14 AM', msg: 'Lusail STEM Academy signed up — awaiting school setup',        type: 'info'  },
  { time: '8:57 AM', msg: 'Education City Primary: Bus #5 added by Ahmed Al-Kaabi',       type: 'ok'    },
  { time: '8:31 AM', msg: 'Al Nour Intl School: 3 new students added to Route B',         type: 'ok'    },
  { time: '7:50 AM', msg: 'Doha International Academy: capacity warning on Bus #3',        type: 'warn'  },
  { time: '7:22 AM', msg: 'Platform: 4 schools active, morning routes underway',           type: 'info'  },
]

const DOT: Record<string, string> = { ok: '#10B981', warn: '#F59E0B', info: '#3B82F6' }

export default function AdminOverviewPage() {
  return (
    <div className="p-7 max-w-[1280px]">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] leading-tight">Platform Overview</h1>
          <p className="text-sm text-[#64748B] mt-0.5">RouteyAI · All schools · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <Link
          href="/admin/schools"
          className="flex items-center gap-2 bg-[#1E3A8A] text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#1e40af]"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add School
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatsCard
          label="Total Schools"
          value="4"
          sub="1 added this month"
          color="#1E3A8A"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" strokeWidth="1.75" strokeLinecap="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          }
        />
        <StatsCard
          label="Total Buses"
          value="14"
          sub="11 active today"
          color="#3B82F6"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/>
              <path d="M18 18h3s.5-1.7.8-4.3c.3-2.7.2-7.7.2-7.7H2S1.7 7 2 9.7c.3 2.6.8 4.3.8 4.3H5"/>
              <circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
            </svg>
          }
        />
        <StatsCard
          label="Total Students"
          value="217"
          sub="Across all schools"
          color="#10B981"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
          }
        />
        <StatsCard
          label="School Admins"
          value="4"
          sub="All verified"
          color="#8B5CF6"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.75" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          }
        />
      </div>

      {/* Schools table + activity */}
      <div className="grid grid-cols-[1fr_320px] gap-5">
        {/* Schools table */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgb(0_0_0/0.04)]">
          <div className="flex justify-between items-center px-5 py-4 border-b border-[#F1F5F9]">
            <span className="text-sm font-bold text-[#0F172A]">Schools</span>
            <Link href="/admin/schools" className="text-xs text-[#64748B] hover:text-[#0F172A]">Manage all →</Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F1F5F9]">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">School</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">Admin</th>
                <th className="text-center px-3 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">Buses</th>
                <th className="text-center px-3 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">Students</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">Joined</th>
              </tr>
            </thead>
            <tbody>
              {SCHOOLS.map((s, i) => (
                <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-[#0F172A] text-[13px]">{s.name}</div>
                    <div className="text-[11px] text-[#94A3B8]">{s.city}</div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{s.admin}</td>
                  <td className="px-3 py-3.5 text-center text-[13px] font-semibold text-[#0F172A]">{s.buses}</td>
                  <td className="px-3 py-3.5 text-center text-[13px] font-semibold text-[#0F172A]">{s.students}</td>
                  <td className="px-5 py-3.5 text-[12px] text-[#94A3B8]">{s.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgb(0_0_0/0.04)] p-5">
          <div className="text-sm font-bold text-[#0F172A] mb-4">Recent Activity</div>
          <div className="flex flex-col">
            {ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-[#F8FAFC] last:border-0">
                <div className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ background: DOT[item.type] }} />
                <div>
                  <div className="text-[11px] text-[#94A3B8] mb-0.5">{item.time}</div>
                  <div className="text-[12px] text-[#0F172A] leading-snug">{item.msg}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
