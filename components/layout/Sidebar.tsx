'use client'

import Link            from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutUser }  from '@/actions/auth'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/jobs',      label: 'All Jobs',  icon: '📋' },
  { href: '/jobs/new',  label: 'Add Job',   icon: '➕' },
]

export default function Sidebar({ name }: { name: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-slate-200 flex flex-col shrink-0">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-base">💼</span>
          </div>
          <span className="font-bold text-slate-900 text-base">JobTracker</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} className={active ? 'nav-link-active' : 'nav-link'}>
              <span className="text-base w-5 text-center">{icon}</span>
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <span className="text-indigo-700 text-sm font-bold">{name?.charAt(0).toUpperCase()}</span>
          </div>
          <span className="text-sm font-medium text-slate-700 truncate">{name}</span>
        </div>
        <form action={logoutUser}>
          <button type="submit"
            className="w-full nav-link text-red-500 hover:bg-red-50 hover:text-red-600">
            <span className="text-base w-5 text-center">🚪</span>
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
