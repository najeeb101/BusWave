'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { RouteyLogo } from '@/components/RouteyLogo'

const NAV_ITEMS = [
  {
    href: '/admin',
    label: 'Overview',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    href: '/admin/schools',
    label: 'Schools',
    icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  },
  {
    href: '/admin/analytics',
    label: 'Analytics',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-[220px] shrink-0 bg-[#0F172A] flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.07]">
        <RouteyLogo size={28} variant="gradient" />
        <span className="text-base font-extrabold tracking-tight">
          <span className="text-white">Routey</span>
          <span className="text-[#00D4FF]">AI</span>
        </span>
      </div>

      {/* Role badge */}
      <div className="mx-3 my-2 flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.07] rounded-lg px-2.5 py-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span className="text-[11px] text-white/50 font-medium">Platform Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150',
              isActive(item.href)
                ? 'bg-blue-500/15 text-white'
                : 'text-white/50 hover:text-white/80 hover:bg-white/[0.05]'
            )}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon} />
            </svg>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Sign out */}
      <div className="p-3 pb-5">
        <Link
          href="/login"
          className="flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg text-[13px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </Link>
      </div>
    </aside>
  )
}
