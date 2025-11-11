'use client'

import { useAuthStore } from '@/lib/store'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'
import { User, LogOut } from 'lucide-react'

export function Navbar() {
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <nav className="border-b border-border/20 bg-card/30 backdrop-blur-xl supports-[backdrop-filter]:bg-card/20">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          QuickNotes
        </h1>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-accent/50">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{user?.name}</span>
          </div>
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-destructive/20">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  )
}