'use client'

import Link                              from 'next/link'
import { useState }                      from 'react'
import { deleteJob, updateJobStatus }    from '@/actions/jobs'
import type { IJob, JobStatus }          from '@/types'

const STATUSES: JobStatus[] = ['applied', 'interview', 'offer', 'rejected']

const BADGE_CLASS: Record<JobStatus, string> = {
  applied:   'bg-indigo-100 text-indigo-700',
  interview: 'bg-amber-100  text-amber-700',
  offer:     'bg-green-100  text-green-700',
  rejected:  'bg-red-100    text-red-600',
}

export default function JobCard({ job }: { job: IJob }) {
  const [status,   setStatus]   = useState<JobStatus>(job.status)
  const [deleting, setDeleting] = useState(false)

  async function handleStatus(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as JobStatus
    setStatus(next)
    await updateJobStatus(job._id, next)
  }

  async function handleDelete() {
    if (!confirm(`Delete application for "${job.company}"?`)) return
    setDeleting(true)
    await deleteJob(job._id)
  }

  return (
    <div className={`card p-4 flex items-center gap-4 transition-opacity ${deleting ? 'opacity-40 pointer-events-none' : ''}`}>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
        <span className="text-indigo-700 font-bold">{job.company.charAt(0).toUpperCase()}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold text-slate-900 truncate">{job.company}</p>
          {job.url && (
            <a href={job.url} target="_blank" rel="noopener noreferrer"
               className="text-indigo-400 hover:text-indigo-600 text-xs shrink-0" title="View Job">↗</a>
          )}
        </div>
        <p className="text-sm text-slate-500 truncate">{job.role}</p>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {job.location && <span className="text-xs text-slate-400">📍 {job.location}</span>}
          {job.salary   && <span className="text-xs text-slate-400">💰 {job.salary}</span>}
          <span className="text-xs text-slate-400">
            {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Status dropdown */}
      <select
        value={status}
        onChange={handleStatus}
        className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer
                    outline-none shrink-0 ${BADGE_CLASS[status]}`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="bg-white text-slate-800">
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Link href={`/jobs/${job._id}`} className="btn-secondary text-xs py-1.5 px-3">
          Edit
        </Link>
        <button onClick={handleDelete} className="btn-danger text-xs py-1.5 px-3">
          {deleting ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
