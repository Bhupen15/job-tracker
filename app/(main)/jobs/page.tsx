import { auth }     from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Job           from '@/models/Job'
import { redirect }  from 'next/navigation'
import Link          from 'next/link'
import JobCard       from '@/components/ui/JobCard'

export default async function JobsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  await connectDB()
  const jobs = await Job.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean()

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Applications</h1>
          <p className="page-subtitle">{jobs.length} job{jobs.length !== 1 ? 's' : ''} tracked</p>
        </div>
        <Link href="/jobs/new" className="btn-primary">+ Add Job</Link>
      </div>

      {jobs.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-24 text-center">
          <span className="text-6xl mb-4">📭</span>
          <p className="text-slate-600 text-lg font-medium mb-1">No applications yet</p>
          <p className="text-slate-400 text-sm mb-6">Start by adding your first job application</p>
          <Link href="/jobs/new" className="btn-primary px-6">Add your first job</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <JobCard key={String(job._id)} job={JSON.parse(JSON.stringify(job))} />
          ))}
        </div>
      )}
    </div>
  )
}
