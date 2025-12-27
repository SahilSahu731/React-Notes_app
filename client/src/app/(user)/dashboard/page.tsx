"use client";

import { useEffect, useState } from "react";
import { useNoteStore } from "@/lib/noteStore";
import { Note } from "@/lib/noteService";
import { CreateNoteModal } from "@/components/CreateNoteModal";
import { NoteCard } from "@/components/NoteCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, Plus, Archive, Trash2, FileText, Loader2, 
  LayoutGrid, List, SlidersHorizontal, Sparkles,
  Filter, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

export default function Dashboard() {
  const { notes, isLoading, fetchNotes, filter, setFilter } = useNoteStore();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchNotes(search);
  }, [fetchNotes, search, filter]);

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingNote(undefined);
    setIsModalOpen(true);
  };

  const pinnedNotes = notes.filter((n) => n.isPinned && !n.isTrashed && !n.isArchived);
  const otherNotes = notes.filter((n) => !n.isPinned && !n.isTrashed && !n.isArchived);
  const displayNotes = filter === 'active' ? otherNotes : notes;

  const filterLabels: Record<string, string> = {
    active: 'All Notes',
    archived: 'Archived',
    trash: 'Trash',
  };

  const totalNotes = filter === 'active' ? pinnedNotes.length + otherNotes.length : notes.length;

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{filterLabels[filter]}</h1>
            <p className="text-sm text-muted-foreground">
              {totalNotes} {totalNotes === 1 ? 'note' : 'notes'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* AI Assist */}
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2 border-secondary/50 text-secondary hover:bg-secondary/10">
              <Sparkles className="w-4 h-4" />
              AI Assist
            </Button>
            
            {/* Create button */}
            <Button 
              onClick={handleCreate}
              className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Note</span>
            </Button>
          </div>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-muted/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div className="flex items-center rounded-lg border border-border/50 p-1 bg-muted/30">
              <Button
                variant={filter === 'active' ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter('active')}
                className="h-8 px-3"
              >
                <FileText className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Notes</span>
              </Button>
              <Button
                variant={filter === 'archived' ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter('archived')}
                className="h-8 px-3"
              >
                <Archive className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Archive</span>
              </Button>
              <Button
                variant={filter === 'trash' ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter('trash')}
                className="h-8 px-3"
              >
                <Trash2 className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Trash</span>
              </Button>
            </div>

            {/* View toggle */}
            <div className="hidden sm:flex items-center rounded-lg border border-border/50 p-1 bg-muted/30">
              <Button
                variant={viewMode === 'grid' ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode('list')}
                className="h-8 w-8"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Sort/Filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 border-border/50">
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuItem>Last modified</DropdownMenuItem>
                <DropdownMenuItem>Date created</DropdownMenuItem>
                <DropdownMenuItem>Alphabetical</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Filter</DropdownMenuLabel>
                <DropdownMenuItem>All colors</DropdownMenuItem>
                <DropdownMenuItem>Has tags</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Quick create card */}
      <div 
        onClick={handleCreate}
        className="group cursor-pointer border-2 border-dashed border-border/50 hover:border-primary/50 rounded-xl p-5 bg-card/30 hover:bg-primary/5 flex items-center gap-4 transition-all duration-300"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Plus className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-foreground/80 group-hover:text-foreground transition-colors">Take a note...</p>
          <p className="text-xs text-muted-foreground">Click to start writing</p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <p className="text-muted-foreground">Loading your notes...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8 pb-10">
          {/* Pinned notes */}
          {filter === 'active' && pinnedNotes.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{pinnedNotes.length}</span>
                </div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Pinned
                </h3>
              </div>
              <div className={cn(
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "flex flex-col gap-3"
              )}>
                {pinnedNotes.map((note) => (
                  <NoteCard key={note._id} note={note} onEdit={handleEdit} />
                ))}
              </div>
            </section>
          )}

          {/* Other notes */}
          <section className="space-y-4">
            {filter === 'active' && pinnedNotes.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground">{otherNotes.length}</span>
                </div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Others
                </h3>
              </div>
            )}
            
            {displayNotes.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  {filter === 'trash' ? (
                    <Trash2 className="w-10 h-10 text-muted-foreground" />
                  ) : filter === 'archived' ? (
                    <Archive className="w-10 h-10 text-muted-foreground" />
                  ) : (
                    <FileText className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  {search 
                    ? "No notes found" 
                    : filter === 'trash' 
                    ? "Trash is empty" 
                    : filter === 'archived' 
                    ? "No archived notes" 
                    : "No notes yet"}
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  {search 
                    ? "Try a different search term" 
                    : filter === 'active' 
                    ? "Create your first note to get started!" 
                    : "Notes you delete or archive will appear here."}
                </p>
                {filter === 'active' && !search && (
                  <Button onClick={handleCreate} className="mt-4 gap-2">
                    <Plus className="w-4 h-4" />
                    Create Note
                  </Button>
                )}
              </div>
            ) : (
              <div className={cn(
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "flex flex-col gap-3"
              )}>
                {displayNotes.map((note) => (
                  <NoteCard key={note._id} note={note} onEdit={handleEdit} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      <CreateNoteModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        noteToEdit={editingNote} 
      />
    </div>
  );
}
