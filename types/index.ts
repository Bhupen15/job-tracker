export type JobStatus = 'applied' | 'interview' | 'offer' | 'rejected'

export interface IJob {
  _id: string
  userId: string
  company: string
  role: string
  location?: string
  salary?: string
  status: JobStatus
  url?: string
  notes?: string
  createdAt: string
  updatedAt: string
}
