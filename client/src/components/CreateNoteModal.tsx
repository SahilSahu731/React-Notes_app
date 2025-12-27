"use client";

import { useState, useEffect } from "react";
import { useNoteStore } from "@/lib/noteStore";
import { useFolderStore } from "@/lib/folderStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pin, Sparkles, X, Plus, Loader2, FolderOpen, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CreateNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteToEdit?: any;
}

const colors = [
  { name: "Default", value: "#ffffff", dark: "bg-card" },
  { name: "Yellow", value: "#fef3c7", dot: "bg-yellow-400" },
  { name: "Blue", value: "#dbeafe", dot: "bg-blue-400" },
  { name: "Green", value: "#dcfce7", dot: "bg-green-400" },
  { name: "Pink", value: "#fce7f3", dot: "bg-pink-400" },
  { name: "Purple", value: "#f3e8ff", dot: "bg-purple-400" },
  { name: "Orange", value: "#fed7aa", dot: "bg-orange-400" },
  { name: "Cyan", value: "#cffafe", dot: "bg-cyan-400" },
];

export function CreateNoteModal({ open, onOpenChange, noteToEdit }: CreateNoteModalProps) {
  const { addNote, editNote, selectedFolderId } = useNoteStore();
  const { folders } = useFolderStore();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [isPinned, setIsPinned] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [folderId, setFolderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setColor(noteToEdit.color || "#ffffff");
      setIsPinned(noteToEdit.isPinned || false);
      setTags(noteToEdit.tags || []);
      // Get folder ID from note
      const noteFolderId = typeof noteToEdit.folder === 'object' 
        ? noteToEdit.folder?._id 
        : noteToEdit.folder;
      setFolderId(noteFolderId || null);
    } else {
      resetForm();
      // Set default folder to currently selected folder
      setFolderId(selectedFolderId);
    }
  }, [noteToEdit, open, selectedFolderId]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setColor("#ffffff");
    setIsPinned(false);
    setTags([]);
    setNewTag("");
    setFolderId(null);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (noteToEdit) {
        await editNote(noteToEdit._id, { title, content, color, isPinned, tags, folder: folderId });
      } else {
        await addNote({ title, content, color, isPinned, tags, folder: folderId });
      }
      
      onOpenChange(false);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedFolder = folders.find(f => f._id === folderId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <div 
          className="transition-colors duration-200"
          style={{ backgroundColor: color !== '#ffffff' ? color : undefined }}
        >
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">
                {noteToEdit ? "Edit Note" : "Create New Note"}
              </DialogTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsPinned(!isPinned)}
                className={cn(
                  "h-8 gap-1.5 transition-colors",
                  isPinned 
                    ? "bg-primary/20 text-primary hover:bg-primary/30" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Pin className="w-3.5 h-3.5" fill={isPinned ? "currentColor" : "none"} />
                {isPinned ? "Pinned" : "Pin"}
              </Button>
            </div>
            <DialogDescription className="sr-only">
              {noteToEdit ? "Edit your note" : "Create a new note"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
            {/* Title */}
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold border-none shadow-none px-0 h-auto py-2 focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/50"
              required
            />
            
            {/* Content */}
            <textarea
              placeholder="Start writing your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[180px] resize-none border-none bg-transparent focus:outline-none focus:ring-0 text-sm leading-relaxed placeholder:text-muted-foreground/50"
              required
            />

            {/* Folder selector */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 text-xs"
                  >
                    {selectedFolder ? (
                      <>
                        <div 
                          className="w-2.5 h-2.5 rounded-sm"
                          style={{ backgroundColor: selectedFolder.color }}
                        />
                        {selectedFolder.name}
                      </>
                    ) : (
                      <>
                        <FolderOpen className="w-3.5 h-3.5" />
                        No folder
                      </>
                    )}
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={() => setFolderId(null)}>
                    <FolderOpen className="w-3.5 h-3.5 mr-2" />
                    No folder
                  </DropdownMenuItem>
                  {folders.map((folder) => (
                    <DropdownMenuItem 
                      key={folder._id}
                      onClick={() => setFolderId(folder._id)}
                    >
                      <div 
                        className="w-2.5 h-2.5 rounded-sm mr-2"
                        style={{ backgroundColor: folder.color }}
                      />
                      {folder.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/30 text-secondary-foreground"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <div className="inline-flex items-center gap-1">
                  <Input
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="h-7 w-24 text-xs bg-transparent border-dashed focus-visible:ring-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleAddTag}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Color selector */}
            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground mr-2">Color:</span>
                {colors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    className={cn(
                      "w-6 h-6 rounded-full transition-all duration-200 hover:scale-110",
                      c.dot || "bg-card border border-border",
                      color === c.value && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    )}
                    style={c.dot ? undefined : { backgroundColor: c.value }}
                    onClick={() => setColor(c.value)}
                    title={c.name}
                  />
                ))}
              </div>
              
              {/* AI button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-secondary border-secondary/30 hover:bg-secondary/10"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Enhance
              </Button>
            </div>
          </form>
        </div>

        <DialogFooter className="p-4 bg-muted/30 border-t border-border/30">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {noteToEdit ? "Save Changes" : "Create Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
