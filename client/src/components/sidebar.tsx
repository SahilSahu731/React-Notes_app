'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  User, FileText, Settings, Users, BarChart, 
  Archive, Trash2, Star, Plus, Tag, FolderOpen,
  ChevronRight, ChevronDown, Search, Home
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { Button } from './ui/button'
import { useState } from 'react'

const mainNavItems = [
  { href: '/dashboard', label: 'All Notes', icon: FileText },
  { href: '/dashboard?filter=starred', label: 'Starred', icon: Star },
  { href: '/dashboard?filter=archived', label: 'Archive', icon: Archive },
  { href: '/dashboard?filter=trash', label: 'Trash', icon: Trash2 },
]

const folders = [
  { id: 1, name: 'Work', color: 'bg-blue-500', count: 12 },
  { id: 2, name: 'Personal', color: 'bg-green-500', count: 8 },
  { id: 3, name: 'Ideas', color: 'bg-purple-500', count: 5 },
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
  const [foldersOpen, setFoldersOpen] = useState(true)
  
  const isAdmin = user?.role === 'admin'

  return (
    <aside className="w-60 min-h-[calc(100vh-4rem)] border-r border-border bg-sidebar flex flex-col">
      {/* Search */}
      <div className="p-3">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-accent rounded-md transition-colors">
          <Search className="w-4 h-4" />
          <span>Search</span>
          <kbd className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>
      </div>

      {/* Quick create */}
      <div className="px-3 mb-2">
        <Button className="w-full justify-start gap-2 h-9 bg-primary/10 hover:bg-primary/20 text-primary border-0 shadow-none">
          <Plus className="w-4 h-4" />
          <span className="font-medium">New Note</span>
        </Button>
      </div>

      {/* Main navigation */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {/* Notes section */}
        <nav className="space-y-0.5">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href.includes('?') && pathname.includes(item.href.split('?')[0]))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                  isActive 
                    ? "bg-accent text-foreground font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="my-3 border-t border-border" />

        {/* Folders section */}
        <div>
          <button 
            onClick={() => setFoldersOpen(!foldersOpen)}
            className="w-full flex items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ChevronDown className={cn(
              "w-3 h-3 transition-transform",
              !foldersOpen && "-rotate-90"
            )} />
            <span>Folders</span>
          </button>
          {foldersOpen && (
            <nav className="mt-1 space-y-0.5">
              {folders.map((folder) => (
                <Link
                  key={folder.id}
                  href={`/dashboard?folder=${folder.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <div className={cn("w-2.5 h-2.5 rounded-sm", folder.color)} />
                  <span className="flex-1">{folder.name}</span>
                  <span className="text-xs text-muted-foreground">{folder.count}</span>
                </Link>
              ))}
              <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                <Plus className="w-3 h-3" />
                <span>Add folder</span>
              </button>
            </nav>
          )}
        </div>

        {/* Divider */}
        <div className="my-3 border-t border-border" />

        {/* Settings section */}
        <nav className="space-y-0.5">
          {settingsItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                  isActive 
                    ? "bg-accent text-foreground font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Admin section */}
        {isAdmin && (
          <>
            <div className="my-3 border-t border-border" />
            <div className="px-2 py-1 text-xs font-medium text-destructive">
              Admin
            </div>
            <nav className="space-y-0.5">
              {adminItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                      isActive 
                        ? "bg-destructive/10 text-destructive font-medium" 
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </>
        )}
      </div>

      {/* Bottom section - User info */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.name}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}