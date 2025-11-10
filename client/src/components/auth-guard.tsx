'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

type AuthGuardProps = {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, accessToken, hasHydrated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!hasHydrated) return // Wait for hydration
    
    if (requireAuth && !user && !accessToken) {
      router.push('/login')
    } else if (!requireAuth && user && accessToken) {
      router.push('/dashboard')
    }
  }, [user, accessToken, hasHydrated, requireAuth, router])

  if (!hasHydrated) {
    return <div>Loading...</div>
  }

  if (requireAuth && (!user || !accessToken)) {
    return <div>Loading...</div>
  }

  if (!requireAuth && user && accessToken) {
    return <div>Redirecting...</div>
  }

  return <>{children}</>
}