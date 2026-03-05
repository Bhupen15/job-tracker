import { createJob } from '@/actions/jobs'
import Link          from 'next/link'

// Wrapper to match the form action type signature
async function handleCreateJob(formData: FormData): Promise<void> {
  'use server'
  await createJob(formData)
}

export default function NewJobPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/jobs" className="text-sm text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 mb-4">
          ← Back to Jobs
        </Link>
        <h1 className="page-title">Add New Application</h1>
        <p className="page-subtitle">Track a job you&apos;ve applied to</p>
      </div>

      <div className="card p-8">
        <form action={handleCreateJob} className="space-y-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Company Name <span className="text-red-500">*</span></label>
              <input name="company" required className="input" placeholder="Google, Infosys, TCS..." />
            </div>
            <div>
              <label className="label">Job Title <span className="text-red-500">*</span></label>
              <input name="role" required className="input" placeholder="Frontend Developer..." />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Location</label>
              <input name="location" className="input" placeholder="Bangalore / Remote" />
            </div>
            <div>
              <label className="label">Salary</label>
              <input name="salary" className="input" placeholder="12-18 LPA" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Application Status</label>
              <select name="status" className="input">
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="label">Job Posting URL</label>
              <input name="url" type="url" className="input" placeholder="https://..." />
            </div>
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea name="notes" rows={3} className="input resize-none"
              placeholder="Recruiter name, interview rounds, follow-up dates..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary px-8 py-2.5">
              Save Application
            </button>
            <Link href="/jobs" className="btn-secondary px-6 py-2.5">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}