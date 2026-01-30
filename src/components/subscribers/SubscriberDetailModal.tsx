import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Subscriber } from '@/hooks/useSubscribers';
import { format } from 'date-fns';
import { User, Mail, Calendar, FileText, Tag, X, Plus, Loader2 } from 'lucide-react';

interface SubscriberDetailModalProps {
  subscriber: Subscriber | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, data: { name?: string; email?: string; tags?: string[]; notes?: string; status?: string }) => Promise<void>;
}

const SUGGESTED_TAGS = ['Customer', 'VIP', 'Event Lead', 'Waitlist', 'Newsletter', 'Trial'];

export function SubscriberDetailModal({
  subscriber,
  open,
  onOpenChange,
  onUpdate,
}: SubscriberDetailModalProps) {
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (subscriber) {
      setNotes(subscriber.notes || '');
      setTags(subscriber.tags || []);
    }
  }, [subscriber]);

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = async () => {
    if (!subscriber) return;
    setIsSaving(true);
    try {
      await onUpdate(subscriber.id, { tags, notes });
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (!subscriber) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{subscriber.name}</p>
              <p className="text-sm font-normal text-muted-foreground">{subscriber.email}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <p className="text-sm font-medium">{subscriber.email}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Signed Up
              </div>
              <p className="text-sm font-medium">
                {format(new Date(subscriber.created_at), 'MMMM dd, yyyy')}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                Source Page
              </div>
              <p className="text-sm font-medium">{subscriber.page?.title || 'Unknown'}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Status
              </div>
              <Badge 
                variant={subscriber.status === 'active' ? 'default' : 'secondary'}
                className={subscriber.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : ''
                }
              >
                {subscriber.status === 'active' ? 'Active' : 'Unsubscribed'}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Tags Section */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag(newTag)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleAddTag(newTag)}
                disabled={!newTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.filter(t => !tags.includes(t)).slice(0, 4).map((tag) => (
                <Button
                  key={tag}
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleAddTag(tag)}
                >
                  + {tag}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Notes Section */}
          <div className="space-y-3">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add notes about this subscriber..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {/* Metadata (if any) */}
          {subscriber.metadata && Object.keys(subscriber.metadata).length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label>Additional Form Data</Label>
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  {Object.entries(subscriber.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
