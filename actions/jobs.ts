'use server'

import { revalidatePath } from 'next/cache'
import { redirect }       from 'next/navigation'
import { auth }           from '@/lib/auth'
import { connectDB }      from '@/lib/mongodb'
import Job                from '@/models/Job'

async function requireAuth() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  return session as { user: { id: string; name?: string | null; email?: string | null } }
}

// ── CREATE ───────────────────────────────────────────────────
export async function createJob(formData: FormData) {
  const session = await requireAuth()

  const company  = (formData.get('company')  as string)?.trim()
  const role     = (formData.get('role')     as string)?.trim()
  const location = (formData.get('location') as string)?.trim()
  const salary   = (formData.get('salary')   as string)?.trim()
  const url      = (formData.get('url')      as string)?.trim()
  const notes    = (formData.get('notes')    as string)?.trim()
  const status   = (formData.get('status')   as string) || 'applied'

  if (!company || !role) return { error: 'Company and Role are required' }

  await connectDB()
  await Job.create({ userId: session.user.id, company, role, location, salary, url, notes, status })

  revalidatePath('/dashboard')
  revalidatePath('/jobs')
  redirect('/jobs')
}

// ── UPDATE ───────────────────────────────────────────────────
export async function updateJob(id: string, formData: FormData) {
  const session = await requireAuth()

  await connectDB()
  await Job.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    {
      company:  (formData.get('company')  as string)?.trim(),
      role:     (formData.get('role')     as string)?.trim(),
      location: (formData.get('location') as string)?.trim(),
      salary:   (formData.get('salary')   as string)?.trim(),
      url:      (formData.get('url')      as string)?.trim(),
      notes:    (formData.get('notes')    as string)?.trim(),
      status:    formData.get('status') as string,
    }
  )

  revalidatePath('/dashboard')
  revalidatePath('/jobs')
  redirect('/jobs')
}

// ── UPDATE STATUS ONLY ───────────────────────────────────────
export async function updateJobStatus(id: string, status: string) {
  const session = await requireAuth()

  await connectDB()
  await Job.findOneAndUpdate({ _id: id, userId: session.user.id }, { status })

  revalidatePath('/dashboard')
  revalidatePath('/jobs')
}

// ── DELETE ───────────────────────────────────────────────────
export async function deleteJob(id: string) {
  const session = await requireAuth()

  await connectDB()
  await Job.findOneAndDelete({ _id: id, userId: session.user.id })

  revalidatePath('/dashboard')
  revalidatePath('/jobs')
}
