"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuthStore } from '@/lib/store'
import { redirect } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const {user} = useAuthStore();

  if (user) redirect('/dashboard');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h1 className="text-3xl font-bold text-primary">QuickNotes</h1>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  )
}