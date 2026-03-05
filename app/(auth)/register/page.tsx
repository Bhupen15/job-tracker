'use client'

import { useState }      from 'react'
import Link              from 'next/link'
import { registerUser }  from '@/actions/auth'

export default function RegisterPage() {
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirm  = formData.get('confirm')  as string

    if (password !== confirm) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const result = await registerUser(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-4 shadow">
            <span className="text-2xl">💼</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 mt-1 text-sm">Start tracking your job applications for free</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="label">Full Name</label>
              <input name="name" type="text" required autoComplete="name"
                className="input" placeholder="Bhupendra Choudhary" />
            </div>

            <div>
              <label className="label">Email address</label>
              <input name="email" type="email" required autoComplete="email"
                className="input" placeholder="you@example.com" />
            </div>

            <div>
              <label className="label">Password</label>
              <input name="password" type="password" required minLength={6}
                className="input" placeholder="Min. 6 characters" />
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <input name="confirm" type="password" required
                className="input" placeholder="Re-enter your password" />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
