import { auth }     from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar      from '@/components/layout/Sidebar'

// This layout protects ALL pages inside (main) group
// Both /dashboard and /jobs share this layout
export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar name={session.user?.name ?? 'User'} />
      <main className="flex-1 p-8 overflow-auto min-w-0">
        {children}
      </main>
    </div>
  )
}
