"use client";

import { useNoteStore } from "@/lib/noteStore";
import { Note } from "@/lib/noteService";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Trash2, Archive, RotateCcw, Pin, 
  MoreHorizontal, Copy, Share2, Tag
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

// Notion-like note colors
const noteColors: Record<string, { bg: string; border: string }> = {
  '#ffffff': { bg: 'bg-card', border: 'border-border' },
  '#fef3c7': { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800/30' },
  '#dbeafe': { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800/30' },
  '#dcfce7': { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800/30' },
  '#fce7f3': { bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-200 dark:border-pink-800/30' },
  '#f3e8ff': { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800/30' },
  '#fed7aa': { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800/30' },
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
        "group relative cursor-pointer transition-all duration-200",
        "hover:shadow-md border",
        colorStyle.bg,
        colorStyle.border,
        note.isTrashed && "opacity-60",
      )}
      onClick={() => !note.isTrashed && onEdit(note)}
    >
      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute top-2 right-2 z-10">
          <Pin className="w-3.5 h-3.5 text-primary" fill="currentColor" />
        </div>
      )}

      <CardHeader className="p-4 pb-2">
        <h3 className="text-sm font-semibold line-clamp-1 pr-6">
          {note.title || "Untitled"}
        </h3>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 whitespace-pre-wrap">
          {note.content || "No content"}
        </p>
        
        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {note.tags.slice(0, 3).map((tag, i) => (
              <span 
                key={i}
                className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-2 px-3 flex justify-between items-center border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] text-muted-foreground">
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>
        
        <div className="flex items-center gap-0.5">
          {note.isTrashed ? (
            <>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600" 
                onClick={handleRestore}
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600" 
                onClick={handleDelete}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                size="icon" 
                variant="ghost" 
                className={cn("h-6 w-6", note.isPinned && "text-primary")}
                onClick={handlePin}
              >
                <Pin className="h-3 w-3" />
              </Button>
              
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6"
                onClick={handleArchive}
              >
                <Archive className="h-3 w-3" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem onClick={handleCopy} className="text-xs">
                    <Copy className="mr-2 h-3 w-3" />
                    Copy text
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs">
                    <Share2 className="mr-2 h-3 w-3" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs">
                    <Tag className="mr-2 h-3 w-3" />
                    Add tag
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-xs text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-3 w-3" />
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
