import { auth }     from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Job           from '@/models/Job'
import { redirect }  from 'next/navigation'
import Link          from 'next/link'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  await connectDB()
  const jobs = await Job.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean()

  const stats = {
    total:     jobs.length,
    applied:   jobs.filter((j) => j.status === 'applied').length,
    interview: jobs.filter((j) => j.status === 'interview').length,
    offer:     jobs.filter((j) => j.status === 'offer').length,
    rejected:  jobs.filter((j) => j.status === 'rejected').length,
  }

  const recent = jobs.slice(0, 5)

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Welcome, {session.user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="page-subtitle">Here&apos;s your job search overview</p>
        </div>
        <Link href="/jobs/new" className="btn-primary">+ Add Job</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Applied" value={stats.total}     color="indigo" emoji="📋" />
        <StatCard label="Interviews"    value={stats.interview} color="amber"  emoji="🗓️" />
        <StatCard label="Offers"        value={stats.offer}     color="green"  emoji="🎉" />
        <StatCard label="Rejected"      value={stats.rejected}  color="red"    emoji="❌" />
      </div>

      {/* Recent Applications */}
      <div className="card">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Applications</h2>
          <Link href="/jobs" className="text-sm text-indigo-600 hover:underline font-medium">
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-3">📭</span>
            <p className="text-slate-500 mb-4">No applications yet</p>
            <Link href="/jobs/new" className="btn-primary">Add your first job</Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {recent.map((job) => (
              <div key={String(job._id)} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                    <span className="text-indigo-700 font-bold text-sm">
                      {job.company.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">{job.company}</p>
                    <p className="text-sm text-slate-500 truncate">{job.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {job.location && (
                    <span className="text-xs text-slate-400 hidden sm:block">📍 {job.location}</span>
                  )}
                  <span className={`badge badge-${job.status}`}>{job.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label, value, color, emoji,
}: {
  label: string; value: number; color: string; emoji: string
}) {
  const bg: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    amber:  'bg-amber-50  text-amber-700  border-amber-100',
    green:  'bg-green-50  text-green-700  border-green-100',
    red:    'bg-red-50    text-red-600    border-red-100',
  }
  return (
    <div className={`card p-5 border ${bg[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium opacity-80">{label}</p>
        <span className="text-xl">{emoji}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}
