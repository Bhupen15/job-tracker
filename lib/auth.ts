import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from './mongodb'
import User from '@/models/User'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        await connectDB()

        const user = await User.findOne({ email: credentials.email })
        if (!user) throw new Error('No account found with this email')

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )
        if (!isValid) throw new Error('Incorrect password')

        return {
          id:    user._id.toString(),
          email: user.email,
          name:  user.name,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string
      return session
    },
  },

  pages: {
    signIn: '/login',
  },

  session: { strategy: 'jwt' },
})

// Helper type — use this instead of raw session
export type AuthSession = {
  user: {
    id: string
    name?: string | null
    email?: string | null
  }
}