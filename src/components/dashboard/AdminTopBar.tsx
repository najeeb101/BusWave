'use client'

import { usePathname } from 'next/navigation'

const LABELS: Record<string, string> = {
  '/admin': 'Platform Overview',
  '/admin/schools': 'Schools',
  '/admin/analytics': 'Analytics',
}

export function AdminTopBar() {
  const pathname = usePathname()
  const label = LABELS[pathname] ?? 'Admin'

  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 shrink-0">
      <span className="text-[15px] font-semibold text-[#0F172A]">{label}</span>

      <div className="flex items-center gap-3">
        <button className="relative w-8 h-8 flex items-center justify-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>

        <div className="flex items-center gap-2 px-2.5 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
          <div className="w-7 h-7 rounded-full bg-[#0F172A] flex items-center justify-center text-xs font-bold text-white">
            PA
          </div>
          <div>
            <div className="text-xs font-semibold text-[#0F172A] leading-none">Platform Admin</div>
            <div className="text-[10px] text-[#94A3B8] leading-none mt-0.5">admin@routeyai.qa</div>
          </div>
        </div>
      </div>
    </header>
  )
}
