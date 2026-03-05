// Tell Next.js this route is always dynamic (never statically generated)
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth }      from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Job           from '@/models/Job'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body   = await req.json()

    await connectDB()
    const job = await Job.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      body,
      { new: true }
    )
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    return NextResponse.json(job)
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await connectDB()
    const job = await Job.findOneAndDelete({ _id: id, userId: session.user.id })
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}