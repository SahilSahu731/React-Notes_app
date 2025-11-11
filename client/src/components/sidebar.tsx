'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { User, FileText, Settings, Users, BarChart } from 'lucide-react'
import { useAuthStore } from '@/lib/store'

const sidebarItems = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/notes', label: 'Notes', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const adminItems = [
  { href: '/users', label: 'Users', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: BarChart },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  
  const isAdmin = user?.role === 'admin'

  return (
    <aside className="w-72 border-r border-border/20 bg-card/20 backdrop-blur-xl">
      <div className="p-6 space-y-3">
        <div className="mb-6">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3">
            Navigation
          </h2>
        </div>
        
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30 shadow-lg" 
                  : "hover:bg-accent/50 hover:translate-x-1"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
              {item.label}
            </Link>
          )
        })}

        {isAdmin && (
          <>
            <div className="mt-8 mb-6">
              <h2 className="text-xs font-bold text-destructive uppercase tracking-wider px-3">
                Admin Panel
              </h2>
            </div>
            
            {adminItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-gradient-to-r from-destructive/20 to-orange-500/20 text-destructive border border-destructive/30 shadow-lg" 
                      : "hover:bg-accent/50 hover:translate-x-1 text-muted-foreground"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-destructive" : "text-muted-foreground")} />
                  {item.label}
                </Link>
              )
            })}
          </>
        )}
      </div>
    </aside>
  )
}