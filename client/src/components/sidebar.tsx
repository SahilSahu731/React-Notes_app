'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  User, FileText, Settings, Users, BarChart, 
  Archive, Trash2, Star, Plus, ChevronDown, Search,
  MoreHorizontal, Pencil, Trash, PanelLeftClose, PanelLeft
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { useFolderStore } from '@/lib/folderStore'
import { useNoteStore } from '@/lib/noteStore'
import { Button } from './ui/button'
import { useState, useEffect } from 'react'
import { FolderModal } from './FolderModal'
import { CreateNoteModal } from './CreateNoteModal'
import { Folder } from '@/lib/folderService'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const mainNavItems = [
  { id: 'all', label: 'All Notes', icon: FileText },
  { id: 'starred', label: 'Starred', icon: Star },
  { id: 'archived', label: 'Archive', icon: Archive },
  { id: 'trash', label: 'Trash', icon: Trash2 },
]

const settingsItems = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const adminItems = [
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart },
]

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuthStore()
  const { folders, fetchFolders, removeFolder } = useFolderStore()
  const { filter, setFilter, selectedFolderId, setSelectedFolder } = useNoteStore()
  
  const [foldersOpen, setFoldersOpen] = useState(true)
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
  const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null)
  const [deletingFolder, setDeletingFolder] = useState<Folder | null>(null)
  
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    fetchFolders()
  }, [fetchFolders])

  // Sync URL with selected folder
  useEffect(() => {
    const folderId = searchParams.get('folder');
    if (folderId && folderId !== selectedFolderId) {
      setSelectedFolder(folderId);
    }
  }, [searchParams, setSelectedFolder]); // Removed selectedFolderId from dependency to avoid loop

  const handleNavClick = (id: string) => {
    setSelectedFolder(null)
    router.push('/dashboard')
    
    if (id === 'all') {
      setFilter('active')
    } else if (id === 'starred') {
      setFilter('active')
      // TODO: Add search param for starred if needed, or filter in store
    } else if (id === 'archived') {
      setFilter('archived')
    } else if (id === 'trash') {
      setFilter('trash')
    }
  }

  const handleFolderClick = (folderId: string) => {
    setSelectedFolder(folderId)
    // Update URL to reflect selected folder
    router.push(`/dashboard?folder=${folderId}`)
  }

  const handleCreateNote = () => {
    setIsCreateNoteModalOpen(true)
  }

  const handleEditFolder = (folder: Folder) => {
    setEditingFolder(folder)
    setIsFolderModalOpen(true)
  }

  const handleDeleteFolder = async () => {
    if (deletingFolder) {
      await removeFolder(deletingFolder._id)
      setDeletingFolder(null)
      if (selectedFolderId === deletingFolder._id) {
        setSelectedFolder(null)
        router.push('/dashboard')
      }
    }
  }

  const getActiveNavId = () => {
    if (selectedFolderId) return null
    if (filter === 'trash') return 'trash'
    if (filter === 'archived') return 'archived'
    return 'all'
  }

  const activeNavId = getActiveNavId()

  // Collapsed sidebar view
  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <aside className="w-14 min-h-[calc(100vh-3rem)] border-r border-border bg-sidebar flex flex-col">
          {/* Expand button */}
          <div className="p-2 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={onToggleCollapse}
                >
                  <PanelLeft className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>
          </div>

          {/* New Note */}
          <div className="px-2 mb-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  className="w-full h-9 bg-primary/10 hover:bg-primary/20 text-primary border-0 shadow-none"
                  onClick={handleCreateNote}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">New Note</TooltipContent>
            </Tooltip>
          </div>

          {/* Main nav */}
          <div className="flex-1 px-2 space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon
              const isActive = activeNavId === item.id
              
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={cn(
                        "w-full flex items-center justify-center p-2 rounded-md transition-colors",
                        isActive 
                          ? "bg-accent text-foreground" 
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              )
            })}

            <div className="my-2 border-t border-border" />

            {/* Folders (collapsed) */}
            {folders.map((folder) => (
              <Tooltip key={folder._id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleFolderClick(folder._id)}
                    className={cn(
                      "w-full flex items-center justify-center p-2 rounded-md transition-colors",
                      selectedFolderId === folder._id
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <div 
                      className="w-3 h-3 rounded-sm" 
                      style={{ backgroundColor: folder.color }}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {folder.name} ({folder.noteCount || 0})
                </TooltipContent>
              </Tooltip>
            ))}

            <div className="my-2 border-t border-border" />

            {/* Settings */}
            {settingsItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-center p-2 rounded-md transition-colors",
                        isActive 
                          ? "bg-accent text-foreground" 
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              )
            })}
          </div>

          {/* User avatar */}
          <div className="p-2 border-t border-border">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-8 h-8 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary cursor-pointer">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">{user?.name}</TooltipContent>
            </Tooltip>
          </div>

          {/* Modals for collapsed view */}
          <CreateNoteModal 
            open={isCreateNoteModalOpen} 
            onOpenChange={setIsCreateNoteModalOpen} 
          />
        </aside>
      </TooltipProvider>
    )
  }

  // Expanded sidebar view
  return (
    <aside className="w-60 min-h-[calc(100vh-3rem)] border-r border-border bg-sidebar flex flex-col">
      {/* Header with collapse button */}
      <div className="p-3 flex items-center justify-between">
        <button className="flex-1 flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent rounded-md transition-colors">
          <Search className="w-4 h-4" />
          <span>Search</span>
          <kbd className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 ml-1"
          onClick={onToggleCollapse}
        >
          <PanelLeftClose className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick create */}
      <div className="px-3 mb-2">
        <Button 
          className="w-full justify-start gap-2 h-9 bg-primary/10 hover:bg-primary/20 text-primary border-0 shadow-none"
          onClick={handleCreateNote}
        >
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
            const isActive = activeNavId === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors text-left",
                  isActive 
                    ? "bg-accent text-foreground font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="my-3 border-t border-border" />

        {/* Folders section */}
        <div>
          <div 
            className="w-full flex items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <div 
              onClick={() => setFoldersOpen(!foldersOpen)}
              className="flex items-center gap-1 flex-1"
            >
              <ChevronDown className={cn(
                "w-3 h-3 transition-transform",
                !foldersOpen && "-rotate-90"
              )} />
              <span>Folders</span>
            </div>
            <button 
              onClick={() => {
                setEditingFolder(null)
                setIsFolderModalOpen(true)
              }}
              className="p-0.5 rounded hover:bg-accent"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          
          {foldersOpen && (
            <nav className="mt-1 space-y-0.5">
              {folders.map((folder) => (
                <div 
                  key={folder._id}
                  className={cn(
                    "group flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer",
                    selectedFolderId === folder._id
                      ? "bg-accent text-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                  onClick={() => handleFolderClick(folder._id)}
                >
                  <div 
                    className="w-2.5 h-2.5 rounded-sm shrink-0" 
                    style={{ backgroundColor: folder.color }}
                  />
                  <span className="flex-1 truncate">{folder.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {folder.noteCount || 0}
                  </span>
                  
                  {/* Folder actions dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <button className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-accent transition-opacity">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem onClick={() => handleEditFolder(folder)}>
                        <Pencil className="w-3.5 h-3.5 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeletingFolder(folder)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="w-3.5 h-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
              
              {folders.length === 0 && (
                <p className="px-3 py-2 text-xs text-muted-foreground">
                  No folders yet
                </p>
              )}
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

      {/* Folder Modal */}
      <FolderModal 
        open={isFolderModalOpen}
        onOpenChange={(open) => {
          setIsFolderModalOpen(open)
          if (!open) setEditingFolder(null)
        }}
        folderToEdit={editingFolder}
      />

      {/* Create Note Modal (Also available from Sidebar "New Note" button) */}
      <CreateNoteModal 
        open={isCreateNoteModalOpen} 
        onOpenChange={setIsCreateNoteModalOpen} 
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingFolder} onOpenChange={() => setDeletingFolder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete folder?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the folder "{deletingFolder?.name}". Notes in this folder will be moved to the root level.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteFolder}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  )
}