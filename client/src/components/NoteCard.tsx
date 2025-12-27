"use client";

import { useNoteStore } from "@/lib/noteStore";
import { Note } from "@/lib/noteService";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Pencil, Trash2, Archive, RotateCcw, Pin, 
  MoreHorizontal, Star, Copy, Share2, Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

// Note colors for dark mode
const noteColors: Record<string, { bg: string; border: string; hover: string }> = {
  '#ffffff': { bg: 'bg-card', border: 'border-border/50', hover: 'hover:border-primary/30' },
  '#fef3c7': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', hover: 'hover:border-yellow-500/40' },
  '#dbeafe': { bg: 'bg-blue-500/10', border: 'border-blue-500/20', hover: 'hover:border-blue-500/40' },
  '#dcfce7': { bg: 'bg-green-500/10', border: 'border-green-500/20', hover: 'hover:border-green-500/40' },
  '#fce7f3': { bg: 'bg-pink-500/10', border: 'border-pink-500/20', hover: 'hover:border-pink-500/40' },
  '#f3e8ff': { bg: 'bg-purple-500/10', border: 'border-purple-500/20', hover: 'hover:border-purple-500/40' },
  '#fed7aa': { bg: 'bg-orange-500/10', border: 'border-orange-500/20', hover: 'hover:border-orange-500/40' },
};

export function NoteCard({ note, onEdit }: NoteCardProps) {
  const { removeNote, editNote, restoreNoteFromTrash } = useNoteStore();

  const colorStyle = noteColors[note.color] || noteColors['#ffffff'];

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    editNote(note._id, { isArchived: !note.isArchived });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (note.isTrashed) {
      if (confirm("Delete permanently?")) {
        removeNote(note._id, true);
      }
    } else {
      removeNote(note._id);
    }
  };

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    restoreNoteFromTrash(note._id);
  };

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    editNote(note._id, { isPinned: !note.isPinned });
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(note.content);
  };

  return (
    <Card 
      className={cn(
        "group relative transition-all duration-300 cursor-pointer overflow-hidden",
        "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
        colorStyle.bg,
        colorStyle.border,
        colorStyle.hover,
        note.isTrashed && "opacity-60 grayscale",
        note.isPinned && "ring-2 ring-primary/30"
      )}
      onClick={() => !note.isTrashed && onEdit(note)}
    >
      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Pin className="w-3 h-3 text-primary" fill="currentColor" />
          </div>
        </div>
      )}

      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold line-clamp-1 flex-1 pr-8">
            {note.title || "Untitled"}
          </h3>
        </div>
        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {note.tags.slice(0, 3).map((tag, i) => (
              <span 
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/30 text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 whitespace-pre-wrap">
          {note.content || "No content"}
        </p>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-[10px] text-muted-foreground">
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>
        
        <div className="flex items-center gap-1">
          {note.isTrashed ? (
            <>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7 hover:bg-green-500/20 hover:text-green-500" 
                onClick={handleRestore}
                title="Restore"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7 hover:bg-destructive/20 hover:text-destructive" 
                onClick={handleDelete}
                title="Delete Permanently"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                size="icon" 
                variant="ghost" 
                className={cn(
                  "h-7 w-7",
                  note.isPinned 
                    ? "text-primary hover:bg-primary/20" 
                    : "hover:bg-accent"
                )}
                onClick={handlePin}
                title={note.isPinned ? "Unpin" : "Pin"}
              >
                <Pin className="h-3.5 w-3.5" />
              </Button>
              
              <Button 
                size="icon" 
                variant="ghost" 
                className={cn(
                  "h-7 w-7",
                  note.isArchived 
                    ? "text-secondary hover:bg-secondary/20" 
                    : "hover:bg-accent"
                )}
                onClick={handleArchive}
                title={note.isArchived ? "Unarchive" : "Archive"}
              >
                <Archive className="h-3.5 w-3.5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7 hover:bg-accent"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={handleCopy}>
                    <Copy className="mr-2 h-3.5 w-3.5" />
                    Copy text
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-3.5 w-3.5" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Tag className="mr-2 h-3.5 w-3.5" />
                    Add tag
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
