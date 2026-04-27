'use client'

function DriverPhone() {
  return (
    <svg width="230" height="480" viewBox="0 0 230 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
      <defs>
        <linearGradient id="d_chassis" x1="0" y1="0" x2="0" y2="478" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1c2035"/>
          <stop offset="1" stopColor="#0f1117"/>
        </linearGradient>
        <linearGradient id="d_header" x1="0" y1="50" x2="221" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#065f46"/>
          <stop offset="1" stopColor="#047857"/>
        </linearGradient>
        <linearGradient id="d_btn" x1="0" y1="0" x2="0" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.16"/>
          <stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <clipPath id="d_screen">
          <rect x="9" y="9" width="212" height="462" rx="27"/>
        </clipPath>
      </defs>

      {/* Chassis */}
      <rect x="1" y="1" width="228" height="478" rx="34" fill="url(#d_chassis)" stroke="#2a2f45" strokeWidth="1.5"/>
      {/* Screen */}
      <rect x="9" y="9" width="212" height="462" rx="27" fill="#090d18"/>
      {/* Dynamic island */}
      <rect x="79" y="16" width="72" height="22" rx="11" fill="#0f1117"/>
      <circle cx="146" cy="27" r="4.5" fill="#1a1f30"/>
      <circle cx="146" cy="27" r="2.5" fill="#252a3a"/>

      {/* Clipped app content */}
      <g clipPath="url(#d_screen)">

        {/* Status bar */}
        <text x="22" y="44" fill="rgba(255,255,255,0.5)" fontSize="9" fontWeight="600">9:41</text>
        <text x="192" y="44" fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="end">78%</text>

        {/* Header */}
        <rect x="9" y="50" width="212" height="56" fill="url(#d_header)"/>
        <text x="22" y="73" fill="white" fontSize="15" fontWeight="800">Route A</text>
        <text x="22" y="89" fill="rgba(255,255,255,0.6)" fontSize="9">Stop 3 of 8  ·  18 students boarding</text>
        <rect x="156" y="60" width="55" height="19" rx="9.5" fill="rgba(52,211,153,0.18)" stroke="#34d399" strokeWidth="0.75"/>
        <text x="183" y="73.5" textAnchor="middle" fill="#34d399" fontSize="7.5" fontWeight="700">● ON ROUTE</text>

        {/* Map */}
        <rect x="9" y="106" width="212" height="100" fill="#0b1823"/>
        <line x1="9" y1="156" x2="221" y2="156" stroke="#1e3a5f" strokeWidth="4.5"/>
        <line x1="115" y1="106" x2="115" y2="206" stroke="#1e3a5f" strokeWidth="3"/>
        <line x1="9" y1="131" x2="221" y2="131" stroke="#142030" strokeWidth="1.5"/>
        <line x1="9" y1="181" x2="221" y2="181" stroke="#142030" strokeWidth="1.5"/>
        <line x1="62" y1="106" x2="62" y2="206" stroke="#142030" strokeWidth="1.5"/>
        <line x1="168" y1="106" x2="168" y2="206" stroke="#142030" strokeWidth="1.5"/>
        {[[14,109,40,32],[68,109,40,32],[130,109,32,32],[174,109,40,32],[14,163,40,28],[68,163,40,15],[130,163,32,28],[174,163,40,15]].map(([x,y,w,h],i)=>(
          <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill="#112030" opacity="0.9"/>
        ))}
        {/* Completed route */}
        <path d="M20,156 Q40,156 55,131 Q70,106 115,106" stroke="#10B981" strokeWidth="2" fill="none" opacity="0.22"/>
        {/* Active route — animated dash */}
        <path d="M115,106 Q148,106 168,131 Q187,147 221,156" stroke="#10B981" strokeWidth="2.5" fill="none" strokeDasharray="6 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1s" repeatCount="indefinite"/>
        </path>
        {/* Bus marker */}
        <circle cx="115" cy="106" r="13" fill="#10B981" stroke="white" strokeWidth="2.5"/>
        <text x="115" y="111" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="800">BUS</text>
        {/* Next stop pin */}
        <circle cx="168" cy="131" r="7" fill="#F59E0B" stroke="white" strokeWidth="1.5"/>
        <text x="187" y="127" fill="#fbbf24" fontSize="8.5">Next</text>

        {/* Next stop card */}
        <rect x="9" y="206" width="212" height="60" fill="#111827"/>
        <rect x="18" y="215" width="3" height="42" rx="1.5" fill="#10B981"/>
        <text x="30" y="228" fill="rgba(255,255,255,0.35)" fontSize="7.5" fontWeight="700" letterSpacing="0.8">NEXT STOP</text>
        <text x="30" y="244" fill="white" fontSize="14" fontWeight="800">Al Waab Street</text>
        <text x="30" y="258" fill="rgba(255,255,255,0.45)" fontSize="9">3 students to pick up  ·  ~2 min away</text>

        {/* Student check-in */}
        <rect x="9" y="266" width="212" height="114" fill="#090d18"/>
        <text x="18" y="283" fill="rgba(255,255,255,0.28)" fontSize="7.5" fontWeight="700" letterSpacing="1.2">STUDENT CHECK-IN</text>
        {[
          { name: 'Ahmed Al-Rashid', sub: 'Picked up',   done: true,  ry: 290 },
          { name: 'Fatima Nasser',   sub: 'Picked up',   done: true,  ry: 318 },
          { name: 'Omar Khalid',     sub: 'Next stop →', done: false, ry: 346 },
        ].map(s => (
          <g key={s.name}>
            <rect x="13" y={s.ry} width="204" height="24" rx="6" fill={s.done ? 'rgba(16,185,129,0.07)' : 'rgba(255,255,255,0.025)'}/>
            {s.done
              ? <><circle cx="30" cy={s.ry+12} r="9" fill="#10B981"/><text x="30" y={s.ry+16.5} textAnchor="middle" fill="white" fontSize="9.5">✓</text></>
              : <circle cx="30" cy={s.ry+12} r="9" stroke="#2d3748" strokeWidth="1.5" fill="transparent"/>
            }
            <text x="48" y={s.ry+11} fill={s.done ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.32)'} fontSize="10.5">{s.name}</text>
            <text x="48" y={s.ry+22} fill={s.done ? '#34d399' : 'rgba(255,255,255,0.18)'} fontSize="8">{s.sub}</text>
          </g>
        ))}

        {/* Action button */}
        <rect x="14" y="388" width="202" height="44" rx="14" fill="#059669"/>
        <rect x="14" y="388" width="202" height="44" rx="14" fill="url(#d_btn)"/>
        <text x="115" y="414" textAnchor="middle" fill="white" fontSize="13" fontWeight="800">Arrive at Next Stop  →</text>

        {/* Bottom nav */}
        <rect x="9" y="436" width="212" height="35" fill="#090d18"/>
        <line x1="9" y1="436" x2="221" y2="436" stroke="#15202e" strokeWidth="1"/>
        <rect x="27" y="440" width="48" height="24" rx="8" fill="rgba(16,185,129,0.12)"/>
        <text x="51" y="455" textAnchor="middle" fill="#10B981" fontSize="8.5" fontWeight="600">Route</text>
        <text x="115" y="455" textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="8.5">Students</text>
        <text x="179" y="455" textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="8.5">Messages</text>

      </g>

      {/* Home indicator (outside clip so it sits in bezel) */}
      <rect x="83" y="470" width="64" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>
    </svg>
  )
}

function ParentPhone() {
  return (
    <svg width="230" height="480" viewBox="0 0 230 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
      <defs>
        <linearGradient id="p_chassis" x1="0" y1="0" x2="0" y2="478" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1c2035"/>
          <stop offset="1" stopColor="#0f1117"/>
        </linearGradient>
        <linearGradient id="p_header" x1="9" y1="50" x2="221" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2e1065"/>
          <stop offset="1" stopColor="#4c1d95"/>
        </linearGradient>
        <clipPath id="p_screen">
          <rect x="9" y="9" width="212" height="462" rx="27"/>
        </clipPath>
      </defs>

      {/* Chassis */}
      <rect x="1" y="1" width="228" height="478" rx="34" fill="url(#p_chassis)" stroke="#2a2f45" strokeWidth="1.5"/>
      <rect x="9" y="9" width="212" height="462" rx="27" fill="#090d18"/>
      <rect x="79" y="16" width="72" height="22" rx="11" fill="#0f1117"/>
      <circle cx="146" cy="27" r="4.5" fill="#1a1f30"/>
      <circle cx="146" cy="27" r="2.5" fill="#252a3a"/>

      <g clipPath="url(#p_screen)">

        {/* Status bar */}
        <text x="22" y="44" fill="rgba(255,255,255,0.5)" fontSize="9" fontWeight="600">9:41</text>
        <text x="192" y="44" fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="end">82%</text>

        {/* Header */}
        <rect x="9" y="50" width="212" height="56" fill="url(#p_header)"/>
        <text x="22" y="73" fill="white" fontSize="15" fontWeight="800">{"Ahmed's Bus"}</text>
        <text x="22" y="89" fill="rgba(255,255,255,0.6)" fontSize="9">Bus #3  ·  Route A  ·  Morning</text>
        <rect x="158" y="60" width="50" height="19" rx="9.5" fill="rgba(167,139,250,0.18)" stroke="#a78bfa" strokeWidth="0.75"/>
        <text x="183" y="73.5" textAnchor="middle" fill="#a78bfa" fontSize="7.5" fontWeight="700">● LIVE</text>

        {/* Map */}
        <rect x="9" y="106" width="212" height="104" fill="#0b1823"/>
        <line x1="9" y1="158" x2="221" y2="158" stroke="#1e3a5f" strokeWidth="4.5"/>
        <line x1="115" y1="106" x2="115" y2="210" stroke="#1e3a5f" strokeWidth="3"/>
        <line x1="9" y1="132" x2="221" y2="132" stroke="#142030" strokeWidth="1.5"/>
        <line x1="9" y1="184" x2="221" y2="184" stroke="#142030" strokeWidth="1.5"/>
        <line x1="62" y1="106" x2="62" y2="210" stroke="#142030" strokeWidth="1.5"/>
        <line x1="168" y1="106" x2="168" y2="210" stroke="#142030" strokeWidth="1.5"/>
        {[[14,109,40,32],[68,109,40,32],[130,109,32,32],[174,109,40,32],[14,165,40,28],[68,165,40,14],[130,165,32,28],[174,165,40,14]].map(([x,y,w,h],i)=>(
          <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill="#112030" opacity="0.9"/>
        ))}
        {/* Route trail */}
        <path d="M22,158 Q42,158 55,132 Q70,106 115,106" stroke="#7c3aed" strokeWidth="2" fill="none" opacity="0.38"/>
        {/* Ahead route - animated */}
        <path d="M115,106 Q148,106 168,132 Q188,150 221,158" stroke="#7c3aed" strokeWidth="2.5" fill="none" strokeDasharray="6 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.1s" repeatCount="indefinite"/>
        </path>
        {/* Bus pulse rings */}
        <circle cx="115" cy="106" r="22" fill="#7c3aed" opacity="0.1">
          <animate attributeName="r" values="13;24;13" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.15;0.03;0.15" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="115" cy="106" r="13" fill="#7c3aed" stroke="white" strokeWidth="2.5"/>
        <text x="115" y="111" textAnchor="middle" fill="white" fontSize="8" fontWeight="800">#3</text>
        {/* School */}
        <circle cx="168" cy="158" r="10" fill="#1E3A8A" stroke="white" strokeWidth="1.5"/>
        <text x="168" y="162" textAnchor="middle" fill="white" fontSize="6.5" fontWeight="700">SCH</text>

        {/* ETA hero */}
        <rect x="9" y="210" width="212" height="78" fill="#1a0838"/>
        <text x="115" y="252" textAnchor="middle" fill="#c4b5fd" fontSize="42" fontWeight="900">7 min</text>
        <text x="115" y="270" textAnchor="middle" fill="rgba(167,139,250,0.5)" fontSize="9.5">Bus arriving at your stop</text>
        <rect x="20" y="277" width="104" height="5" rx="2.5" fill="rgba(124,58,237,0.2)"/>
        <rect x="20" y="277" width="70" height="5" rx="2.5" fill="#7c3aed"/>
        <text x="130" y="282" fill="rgba(167,139,250,0.4)" fontSize="8.5">School: 8:18 AM</text>

        {/* Boarding status */}
        <rect x="9" y="288" width="212" height="52" fill="#111827"/>
        <rect x="18" y="297" width="3" height="34" rx="1.5" fill="#10B981"/>
        <text x="30" y="309" fill="rgba(255,255,255,0.3)" fontSize="7.5" fontWeight="700" letterSpacing="0.8">CHILD STATUS</text>
        <text x="30" y="326" fill="white" fontSize="13" fontWeight="800">Ahmed boarded ✓</text>
        <rect x="162" y="307" width="46" height="18" rx="9" fill="rgba(52,211,153,0.12)"/>
        <text x="185" y="320" textAnchor="middle" fill="#34d399" fontSize="8.5" fontWeight="700">7:23 AM</text>

        {/* Alert feed */}
        <rect x="9" y="340" width="212" height="92" fill="#090d18"/>
        <text x="18" y="358" fill="rgba(255,255,255,0.28)" fontSize="7.5" fontWeight="700" letterSpacing="1.2">RECENT ALERTS</text>
        {[
          { text: 'Bus departed Al Sadd stop',  time: '7:31', dot: '#a78bfa' },
          { text: 'Minor delay on C-Ring Road', time: '7:26', dot: '#fbbf24' },
          { text: 'Ahmed boarded Bus #3',         time: '7:23', dot: '#34d399' },
        ].map((n, i) => (
          <g key={i}>
            <rect x="13" y={364 + i * 23} width="204" height="19" rx="5" fill="rgba(255,255,255,0.02)"/>
            <circle cx="25" cy={374 + i * 23} r="3.5" fill={n.dot}/>
            <text x="36" y={377 + i * 23} fill="rgba(255,255,255,0.58)" fontSize="9">{n.text}</text>
            <text x="208" y={377 + i * 23} textAnchor="end" fill="rgba(255,255,255,0.22)" fontSize="8">{n.time}</text>
          </g>
        ))}

        {/* Bottom nav */}
        <rect x="9" y="436" width="212" height="35" fill="#090d18"/>
        <line x1="9" y1="436" x2="221" y2="436" stroke="#15202e" strokeWidth="1"/>
        <rect x="27" y="440" width="48" height="24" rx="8" fill="rgba(124,58,237,0.15)"/>
        <text x="51" y="455" textAnchor="middle" fill="#a78bfa" fontSize="8.5" fontWeight="600">Track</text>
        <text x="115" y="455" textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="8.5">Alerts</text>
        <text x="179" y="455" textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="8.5">History</text>

      </g>

      <rect x="83" y="470" width="64" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>
    </svg>
  )
}

export function MobileAppsSection({ onDownloadClick }: { onDownloadClick: () => void }) {
  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 mb-16 scroll-mt-24">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-[#BFDBFE] dark:border-slate-700 rounded-full px-4 py-1.5 text-[11px] font-bold text-[#1E3A8A] dark:text-blue-400 mb-5 uppercase tracking-wide shadow-sm">
          Free Mobile Apps
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight mb-4">
          Built for every role.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-purple-500">In every pocket.</span>
        </h2>
        <p className="text-[#64748B] dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Free apps for drivers and parents — real-time navigation, live tracking, and instant updates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

        {/* Driver card */}
        <div className="bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/50 dark:via-slate-900 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800/30 rounded-3xl p-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide mb-4">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/>
              <path d="M18 18h3s.5-1.7.8-4.3c.3-2.7.2-7.7.2-7.7H2S1.7 7 2 9.7c.3 2.6.8 4.3.8 4.3H5"/>
              <circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
            </svg>
            For Drivers
          </div>

          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white text-center mb-2">Navigate. Check in. Repeat.</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-6 max-w-xs leading-relaxed">
            Turn-by-turn routing, per-stop student check-ins, and instant messages from school — all hands-free.
          </p>

          <div className="mb-8">
            <DriverPhone />
          </div>

          <ul className="w-full space-y-2.5 mb-8">
            {[
              'Turn-by-turn route navigation',
              'Digital student check-in at every stop',
              'Instant broadcast alerts from school',
              'Live route progress & ETA updates',
            ].map(f => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 dark:bg-emerald-500/15 dark:border-emerald-500/30 flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                {f}
              </li>
            ))}
          </ul>

          <div className="flex gap-3 w-full">
            <button
              onClick={onDownloadClick}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 rounded-xl transition-all hover:shadow-[0_6px_20px_-4px_rgba(16,185,129,0.45)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              App Store
            </button>
            <button
              onClick={onDownloadClick}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 rounded-xl transition-all hover:shadow-[0_6px_20px_-4px_rgba(16,185,129,0.45)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M3.18 23.76c.3.17.65.19.97.08l11.46-6.62-2.36-2.36-10.07 8.9zM20.73 9.11L17.5 7.23 14.86 9.87l2.77 2.77 3.12-1.8c.89-.51.89-1.74-.02-2.73zM2.13.29C1.86.56 1.7.97 1.7 1.5v21c0 .53.16.94.43 1.21l.07.06 11.76-11.76v-.28L2.2.23l-.07.06zM14.57 10.53l-2.77-2.77L2.2.23l12.37 10.3z"/></svg>
              Google Play
            </button>
          </div>
        </div>

        {/* Parent card */}
        <div className="bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/50 dark:via-slate-900 dark:to-slate-900 border border-purple-200 dark:border-purple-800/30 rounded-3xl p-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 text-purple-700 dark:bg-purple-500/10 dark:border-purple-500/25 dark:text-purple-400 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide mb-4">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            For Parents
          </div>

          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white text-center mb-2">Know where your child is. Always.</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-6 max-w-xs leading-relaxed">
            Live bus location, boarding confirmation, and real-time ETA — before your child even gets on the bus.
          </p>

          <div className="mb-8">
            <ParentPhone />
          </div>

          <ul className="w-full space-y-2.5 mb-8">
            {[
              'Live bus location on an interactive map',
              'Boarding & drop-off confirmations',
              'Real-time ETA to stop and school',
              'Instant delay and absence alerts',
            ].map(f => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-purple-100 border border-purple-300 dark:bg-purple-500/15 dark:border-purple-500/30 flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                {f}
              </li>
            ))}
          </ul>

          <div className="flex gap-3 w-full">
            <button
              onClick={onDownloadClick}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm py-3 rounded-xl transition-all hover:shadow-[0_6px_20px_-4px_rgba(124,58,237,0.45)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              App Store
            </button>
            <button
              onClick={onDownloadClick}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm py-3 rounded-xl transition-all hover:shadow-[0_6px_20px_-4px_rgba(124,58,237,0.45)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M3.18 23.76c.3.17.65.19.97.08l11.46-6.62-2.36-2.36-10.07 8.9zM20.73 9.11L17.5 7.23 14.86 9.87l2.77 2.77 3.12-1.8c.89-.51.89-1.74-.02-2.73zM2.13.29C1.86.56 1.7.97 1.7 1.5v21c0 .53.16.94.43 1.21l.07.06 11.76-11.76v-.28L2.2.23l-.07.06zM14.57 10.53l-2.77-2.77L2.2.23l12.37 10.3z"/></svg>
              Google Play
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
