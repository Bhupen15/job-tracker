import { auth }     from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Job           from '@/models/Job'
import { updateJob } from '@/actions/jobs'
import { redirect, notFound } from 'next/navigation'
import Link          from 'next/link'

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params
  await connectDB()

  const job = await Job.findOne({ _id: id, userId: session.user.id }).lean()
  if (!job) notFound()

  // Bind id so the action knows which job to update
  const updateThisJob = updateJob.bind(null, id)

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/jobs" className="text-sm text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 mb-4">
          ← Back to Jobs
        </Link>
        <h1 className="page-title">Edit Application</h1>
        <p className="page-subtitle">{job.company} — {job.role}</p>
      </div>

      <div className="card p-8">
        <form action={updateThisJob} className="space-y-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Company Name <span className="text-red-500">*</span></label>
              <input name="company" required defaultValue={job.company} className="input" />
            </div>
            <div>
              <label className="label">Job Title <span className="text-red-500">*</span></label>
              <input name="role" required defaultValue={job.role} className="input" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Location</label>
              <input name="location" defaultValue={job.location ?? ''} className="input" />
            </div>
            <div>
              <label className="label">Salary</label>
              <input name="salary" defaultValue={job.salary ?? ''} className="input" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Status</label>
              <select name="status" defaultValue={job.status} className="input">
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="label">Job URL</label>
              <input name="url" type="url" defaultValue={job.url ?? ''} className="input" />
            </div>
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea name="notes" rows={3} defaultValue={job.notes ?? ''} className="input resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary px-8 py-2.5">Update Application</button>
            <Link href="/jobs" className="btn-secondary px-6 py-2.5">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
