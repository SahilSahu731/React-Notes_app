"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuthStore } from '@/lib/store'
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const {user, accessToken, hasHydrated} = useAuthStore();
  const router = useRouter();

  useEffect(() => {
      if (!hasHydrated) return; // Wait for hydration
      
      if (user && accessToken) {
        router.push("/dashboard");
      }
    }, [user, accessToken, hasHydrated, router]);
  
    if (!hasHydrated) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

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