import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Download, Tag, Trash2, X, Plus } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onClear: () => void;
  onExportSelected: () => void;
  onAddTagToSelected: (tag: string) => void;
  onDeleteSelected: () => void;
}

const QUICK_TAGS = ['Customer', 'VIP', 'Event Lead', 'Waitlist'];

export function BulkActionsBar({
  selectedCount,
  onClear,
  onExportSelected,
  onAddTagToSelected,
  onDeleteSelected,
}: BulkActionsBarProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false);

  const handleAddCustomTag = () => {
    if (customTag.trim()) {
      onAddTagToSelected(customTag.trim());
      setCustomTag('');
      setTagPopoverOpen(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-3 bg-primary text-primary-foreground px-4 py-3 rounded-xl shadow-2xl">
          <span className="text-sm font-medium">
            {selectedCount} selected
          </span>
          
          <div className="w-px h-5 bg-primary-foreground/30" />

          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground hover:bg-primary-foreground/20"
            onClick={onExportSelected}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Tag className="h-4 w-4 mr-2" />
                Add Tag
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="center" side="top">
              <div className="space-y-3">
                <p className="text-sm font-medium">Quick Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_TAGS.map((tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        onAddTagToSelected(tag);
                        setTagPopoverOpen(false);
                      }}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Custom tag..."
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
                    className="h-8 text-sm"
                  />
                  <Button size="sm" className="h-8" onClick={handleAddCustomTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground hover:bg-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>

          <div className="w-px h-5 bg-primary-foreground/30" />

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedCount} subscribers?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. These subscribers will be permanently removed from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onDeleteSelected();
                setShowDeleteDialog(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
