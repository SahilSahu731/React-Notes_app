"use client"

import { ThemeToggle } from '@/components/theme-toggle'
import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FileText, Sparkles, Shield, Zap, Cloud, Check } from 'lucide-react';

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
      <div className="hidden lg:flex flex-col w-[45%] relative overflow-hidden bg-primary">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[#1a6bc4]" />
        
        {/* Pattern overlay for texture */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border border-white/30 rounded-full" />
          <div className="absolute top-40 right-20 w-48 h-48 border border-white/20 rounded-full" />
          <div className="absolute bottom-40 left-1/4 w-64 h-64 border border-white/20 rounded-full" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold">NoteFlow</span>
          </div>
          
          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center max-w-md">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight">
                Write, plan, and get organized in one place.
              </h1>
              <p className="text-lg text-white/80 leading-relaxed">
                NoteFlow is the connected workspace where better, faster work happens.
              </p>
            </div>

            {/* Features list */}
            <div className="mt-10 space-y-4">
              {[
                { icon: Sparkles, text: "AI-powered writing assistance" },
                { icon: Cloud, text: "Sync across all your devices" },
                { icon: Shield, text: "Enterprise-grade security" },
                { icon: Zap, text: "Lightning fast performance" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <feature.icon className="w-4 h-4" />
                  </div>
                  <span className="text-white/90">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="mt-12 p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <p className="text-white/90 italic">
                "NoteFlow has completely transformed how I organize my thoughts and work. It's the best notes app I've ever used."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">
                  JD
                </div>
                <div>
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-white/60">Product Designer</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-white/50 text-sm">
            © 2024 NoteFlow. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-6">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold">NoteFlow</span>
          </div>
          <div className="hidden lg:block" />
          
          <ThemeToggle />
        </div>
        
        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-[400px]">
            {children}
          </div>
        </div>

        {/* Bottom text */}
        <div className="text-center pb-6 text-sm text-muted-foreground">
          By continuing, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  )
}