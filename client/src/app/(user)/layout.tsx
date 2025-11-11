"use client"

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { accessToken, user, hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return; // Wait for hydration
    
    if (!user || !accessToken) {
      router.push("/login");
    }
  }, [user, accessToken, hasHydrated, router]);

  if (!hasHydrated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || !accessToken) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}