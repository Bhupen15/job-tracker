'use server'

import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { signIn, signOut } from '@/lib/auth'

export async function registerUser(formData: FormData) {
  const name     = (formData.get('name')     as string)?.trim()
  const email    = (formData.get('email')    as string)?.trim()
  const password = (formData.get('password') as string)?.trim()

  if (!name || !email || !password) return { error: 'All fields are required' }
  if (password.length < 6)          return { error: 'Password must be at least 6 characters' }

  try {
    await connectDB()

    const existing = await User.findOne({ email })
    if (existing) return { error: 'Email already registered. Please login.' }

    const hashed = await bcrypt.hash(password, 12)
    await User.create({ name, email, password: hashed })

    await signIn('credentials', { email, password, redirectTo: '/dashboard' })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('NEXT_REDIRECT')) throw err
    return { error: 'Registration failed. Please try again.' }
  }
}

export async function loginUser(formData: FormData) {
  const email    = (formData.get('email')    as string)?.trim()
  const password = (formData.get('password') as string)?.trim()

  if (!email || !password) return { error: 'Email and password are required' }

  try {
    await signIn('credentials', { email, password, redirectTo: '/dashboard' })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('NEXT_REDIRECT')) throw err
    return { error: 'Invalid email or password' }
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: '/login' })
}
