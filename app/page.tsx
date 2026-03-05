import { auth }     from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link         from 'next/link'

export default async function HomePage() {
  const session = await auth()
  if (session) redirect('/dashboard')

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">

        {/* Icon */}
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-3xl">💼</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-bold text-slate-900 mb-3">
          Job<span className="text-indigo-600">Tracker</span>
        </h1>
        <p className="text-lg text-slate-500 mb-10">
          Track all your job applications in one place. Never lose track again.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {['📋 Track Applications', '📊 Stats Dashboard', '🔒 Secure & Private', '🚀 Free Forever'].map((f) => (
            <span key={f} className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-sm text-slate-600 shadow-sm">
              {f}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex gap-3 justify-center">
          <Link href="/register" className="btn-primary px-8 py-3 text-base">
            Get Started Free
          </Link>
          <Link href="/login" className="btn-secondary px-8 py-3 text-base">
            Sign In
          </Link>
        </div>
      </div>
    </main>
  )
}
