'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

type AdminGuardProps = {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, hasHydrated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!hasHydrated) return
    
    if (!user || user.role !== 'admin') {
      router.push('/login')
    }
  }, [user, hasHydrated, router])

  if (!hasHydrated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return <>{children}</>
}