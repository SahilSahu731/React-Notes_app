'use client'

import { AdminGuard } from '@/components/admin-guard'
import { ThemeToggle } from '@/components/theme-toggle'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
            <ThemeToggle />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  )
}