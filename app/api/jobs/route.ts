// Tell Next.js this route is always dynamic (never statically generated)
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth }        from '@/lib/auth'
import { connectDB }   from '@/lib/mongodb'
import Job             from '@/models/Job'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const jobs = await Job.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean()
    return NextResponse.json(jobs)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const body = await req.json()
    if (!body.company || !body.role) {
      return NextResponse.json({ error: 'Company and role required' }, { status: 400 })
    }

    const job = await Job.create({ ...body, userId: session.user.id })
    return NextResponse.json(job, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}