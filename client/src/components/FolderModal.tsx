"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFolderStore } from "@/lib/folderStore";
import { Folder } from "@/lib/folderService";
import { Loader2 } from "lucide-react";

interface FolderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderToEdit?: Folder | null;
}

const colors = [
  { name: "Blue", value: "#2383e2" },
  { name: "Green", value: "#36b37e" },
  { name: "Purple", value: "#9b59b6" },
  { name: "Orange", value: "#f39c12" },
  { name: "Red", value: "#eb5757" },
  { name: "Pink", value: "#e91e63" },
  { name: "Cyan", value: "#00bcd4" },
  { name: "Gray", value: "#6b6b6b" },
];

export function FolderModal({ open, onOpenChange, folderToEdit }: FolderModalProps) {
  const { addFolder, editFolder } = useFolderStore();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#2383e2");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (folderToEdit) {
      setName(folderToEdit.name);
      setColor(folderToEdit.color);
    } else {
      resetForm();
    }
  }, [folderToEdit, open]);

  const resetForm = () => {
    setName("");
    setColor("#2383e2");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    setIsSubmitting(true);

    try {
      if (folderToEdit) {
        await editFolder(folderToEdit._id, { name: name.trim(), color });
      } else {
        await addFolder({ name: name.trim(), color });
      }
      onOpenChange(false);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {folderToEdit ? "Edit Folder" : "Create Folder"}
          </DialogTitle>
          <DialogDescription>
            {folderToEdit ? "Update your folder details" : "Create a new folder to organize your notes"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Folder Name</Label>
            <Input
              id="name"
              placeholder="Enter folder name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={cn(
                    "w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110",
                    color === c.value && "ring-2 ring-offset-2 ring-offset-background ring-foreground"
                  )}
                  style={{ backgroundColor: c.value }}
                  onClick={() => setColor(c.value)}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-md flex items-center justify-center"
              style={{ backgroundColor: `${color}20` }}
            >
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: color }}
              />
            </div>
            <span className="text-sm font-medium">
              {name || "Folder name"}
            </span>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {folderToEdit ? "Save Changes" : "Create Folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
