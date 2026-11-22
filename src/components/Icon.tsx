const paths: Record<string, React.ReactNode> = {
  map: <><path d="m3 6 5-3 8 3 5-3v15l-5 3-8-3-5 3Z"/><path d="M8 3v15M16 6v15"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  tune: <><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></>,
  flame: <path d="M12 22c4.4 0 8-3.6 8-8 0-3.2-1.5-5.8-4.6-8.5.1 2-1 3.8-2.4 4.5.2-3.3-1.7-6.5-4.4-8C9 5.3 7 7.4 5.8 9.3 2.8 14 6.3 22 12 22Z"/>,
  layers: <><path d="m12 2 9 5-9 5-9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 22c.5-5 3-7 8-7s7.5 2 8 7"/></>,
  flag: <><path d="M5 21V4"/><path d="M5 5c5-3 7 3 14 0v9c-7 3-9-3-14 0"/></>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  comment: <path d="M21 14a5 5 0 0 1-5 5H8l-5 3V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5Z"/>,
  share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></>,
  sparkle: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5Z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7Z"/></>,
  upload: <><path d="M12 16V3M7 8l5-5 5 5"/><path d="M4 15v5h16v-5"/></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  bookmark: <path d="M6 3h12v19l-6-4-6 4Z"/>,
  back: <path d="m15 18-6-6 6-6"/>,
  more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  play: <path d="m8 5 11 7-11 7Z"/>,
  grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
  pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
}

export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

export function Brand({ onClick }: { onClick?: () => void }) {
  return <button className="brand" onClick={onClick}><span className="brand-mark"><Icon name="pin" size={18}/></span><span>Echo<span>—</span>Map</span></button>
}
