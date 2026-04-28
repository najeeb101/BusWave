import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StatsCard } from '@/components/dashboard/StatsCard'

type SchoolRow = {
  id: string
  name: string
  address: string
  created_at: string
  bus_count: number
  student_count: number
  admin_name: string | null
  admin_email: string | null
}

type PlatformStats = {
  school_count: number
  bus_count: number
  student_count: number
  admin_count: number
}

export default async function AdminOverviewPage() {
  const supabase = createClient()

  const [statsResult, schoolsResult] = await Promise.all([
    supabase.rpc('get_platform_stats'),
    supabase.rpc('get_schools_with_admins'),
  ])

  const stats = statsResult.data as PlatformStats | null
  const schools = (schoolsResult.data ?? []) as SchoolRow[]

  return (
    <div className="p-7 max-w-[1280px]">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] leading-tight">Platform Overview</h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            RouteyAI · All schools ·{' '}
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
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
          value={String(stats?.school_count ?? '—')}
          sub={`${schools.length} registered`}
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
          value={String(stats?.bus_count ?? '—')}
          sub="Across all schools"
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
          value={String(stats?.student_count ?? '—')}
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
          value={String(stats?.admin_count ?? '—')}
          sub="All verified"
          color="#8B5CF6"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.75" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          }
        />
      </div>

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
            {schools.slice(0, 5).map((s, i) => (
              <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}>
                <td className="px-5 py-3.5">
                  <div className="font-semibold text-[#0F172A] text-[13px]">{s.name}</div>
                  <div className="text-[11px] text-[#94A3B8]">{s.address}</div>
                </td>
                <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{s.admin_name ?? '—'}</td>
                <td className="px-3 py-3.5 text-center text-[13px] font-semibold text-[#0F172A]">{s.bus_count}</td>
                <td className="px-3 py-3.5 text-center text-[13px] font-semibold text-[#0F172A]">{s.student_count}</td>
                <td className="px-5 py-3.5 text-[12px] text-[#94A3B8]">
                  {new Date(s.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
            {schools.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-[#94A3B8]">
                  No schools yet.{' '}
                  <Link href="/admin/schools" className="text-[#3B82F6] hover:underline">Add the first one →</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
