"use client"

import { ThemeToggle } from '@/components/theme-toggle'
import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FileText, Sparkles, Shield, Zap, Cloud } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const {user, accessToken, hasHydrated} = useAuthStore();
  const router = useRouter();

  useEffect(() => {
      if (!hasHydrated) return;
      
      if (user && accessToken) {
        router.push("/dashboard");
      }
    }, [user, accessToken, hasHydrated, router]);
  
    if (!hasHydrated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <span className="text-muted-foreground">Loading...</span>
          </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left side - Visual Branding */}
      <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary" />
        
        {/* Animated orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-secondary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1.5s' }} />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">NoteFlow</span>
          </div>
          
          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-tight">
                Capture ideas,{' '}
                <span className="text-secondary">organize life.</span>
              </h1>
              <p className="text-xl text-white/70 leading-relaxed">
                A beautiful, distraction-free notes app that helps you think clearly and work efficiently.
              </p>
            </div>

            {/* Feature pills */}
            <div className="mt-12 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Shield className="w-4 h-4 text-green-300" />
                <span className="text-sm font-medium">Secure</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium">Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Cloud className="w-4 h-4 text-white" />
                <span className="text-sm font-medium">Cloud Sync</span>
              </div>
            </div>

            {/* Mock cards */}
            <div className="mt-16 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 transform -rotate-2 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-xs text-white/60">Work</span>
                </div>
                <div className="h-2 w-3/4 bg-white/30 rounded-full mb-2" />
                <div className="h-2 w-full bg-white/20 rounded-full mb-2" />
                <div className="h-2 w-2/3 bg-white/20 rounded-full" />
              </div>
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 transform rotate-2 hover:rotate-0 transition-transform translate-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-xs text-white/60">Ideas</span>
                </div>
                <div className="h-2 w-1/2 bg-white/30 rounded-full mb-2" />
                <div className="h-2 w-full bg-white/20 rounded-full mb-2" />
                <div className="h-2 w-4/5 bg-white/20 rounded-full" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-white/40 text-sm">
            <span>© 2024 NoteFlow. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col relative">
        {/* Theme toggle */}
        <div className="absolute top-6 right-6 z-10">
          <ThemeToggle />
        </div>
        
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8 relative z-10">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <span className="text-2xl font-bold">NoteFlow</span>
              </div>
            </div>

            {/* Form card with glassmorphism */}
            <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-xl">
              {children}
            </div>
            
            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 text-muted-foreground text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>256-bit encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                <span>Auto-sync</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}