'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  User, FileText, Settings, Users, BarChart, 
  Archive, Trash2, Star, Plus, Tag, FolderOpen,
  ChevronRight, Sparkles
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { Button } from './ui/button'

const mainNavItems = [
  { href: '/dashboard', label: 'All Notes', icon: FileText, count: null },
  { href: '/dashboard?filter=starred', label: 'Starred', icon: Star, count: 3 },
  { href: '/dashboard?filter=archived', label: 'Archive', icon: Archive, count: null },
  { href: '/dashboard?filter=trash', label: 'Trash', icon: Trash2, count: null },
]

const folders = [
  { id: 1, name: 'Work', color: 'bg-blue-500', count: 12 },
  { id: 2, name: 'Personal', color: 'bg-green-500', count: 8 },
  { id: 3, name: 'Ideas', color: 'bg-purple-500', count: 5 },
]

const tags = [
  { id: 1, name: 'Important', color: 'bg-red-500' },
  { id: 2, name: 'Review', color: 'bg-yellow-500' },
  { id: 3, name: 'Research', color: 'bg-secondary' },
]

const settingsItems = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const adminItems = [
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  
  const isAdmin = user?.role === 'admin'

  return (
    <aside className="w-72 min-h-[calc(100vh-4rem)] border-r border-border/30 bg-sidebar/50 backdrop-blur-xl flex flex-col">
      {/* Quick create */}
      <div className="p-4">
        <Button className="w-full justify-start gap-3 h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          <span className="font-medium">New Note</span>
        </Button>
      </div>

      {/* Main navigation */}
      <div className="flex-1 overflow-y-auto px-3 space-y-6">
        {/* Notes section */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href.includes('?') && pathname.includes(item.href.split('?')[0]))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive && "text-primary")} />
                <span className="flex-1">{item.label}</span>
                {item.count !== null && (
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {item.count}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Folders section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Folders
            </h3>
            <button className="p-1 rounded hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <nav className="space-y-1">
            {folders.map((folder) => (
              <Link
                key={folder.id}
                href={`/dashboard?folder=${folder.id}`}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all"
              >
                <FolderOpen className="w-4 h-4" />
                <div className={cn("w-2 h-2 rounded-full", folder.color)} />
                <span className="flex-1">{folder.name}</span>
                <span className="text-xs text-muted-foreground">{folder.count}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Tags section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tags
            </h3>
            <button className="p-1 rounded hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 px-3">
            {tags.map((tag) => (
              <button
                key={tag.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
              >
                <div className={cn("w-1.5 h-1.5 rounded-full", tag.color)} />
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Settings section */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
            Account
          </h3>
          <nav className="space-y-1">
            {settingsItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive && "text-primary")} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Admin section */}
        {isAdmin && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-destructive uppercase tracking-wider px-3 flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              Admin
            </h3>
            <nav className="space-y-1">
              {adminItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-destructive/10 text-destructive border border-destructive/20" 
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive && "text-destructive")} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Bottom section - Storage / Upgrade */}
      <div className="p-4 border-t border-border/30">
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Storage</span>
            <span className="text-xs text-muted-foreground">2.4 GB / 5 GB</span>
          </div>
          <div className="w-full h-2 bg-background/50 rounded-full overflow-hidden">
            <div className="h-full w-[48%] bg-gradient-to-r from-primary to-secondary rounded-full" />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-primary hover:text-primary hover:bg-primary/10"
          >
            Upgrade for more
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </aside>
  )
}