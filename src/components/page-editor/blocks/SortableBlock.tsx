import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from '../types';
import { BlockRenderer } from './BlockRenderer';
import { cn } from '@/lib/utils';
import { GripVertical, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SortableBlockProps {
  block: Block;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdate: (props: Record<string, any>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  pageId?: string;
}

export function SortableBlock({
  block,
  isSelected,
  isFirst,
  isLast,
  onSelect,
  onDelete,
  onUpdate,
  onMoveUp,
  onMoveDown,
  pageId,
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative',
        isDragging && 'opacity-50 z-50'
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div
        className={cn(
          'relative border-2 border-transparent rounded-lg transition-all',
          isSelected && 'border-primary shadow-lg bg-background/50',
          !isSelected && 'hover:border-border hover:bg-background/30'
        )}
      >
        {/* Block Controls */}
        <div
          className={cn(
            'absolute -top-3 left-1/2 -translate-x-1/2 z-10',
            'flex items-center gap-1 px-2 py-1 rounded-full',
            'bg-card border border-border shadow-lg',
            'opacity-0 group-hover:opacity-100 transition-all duration-200',
            'scale-90 group-hover:scale-100',
            isSelected && 'opacity-100 scale-100'
          )}
        >
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className={cn(
              'p-1 rounded cursor-grab active:cursor-grabbing',
              'hover:bg-muted transition-colors'
            )}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Move Up */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            disabled={isFirst}
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>

          {/* Move Down */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            disabled={isLast}
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>

          {/* Delete */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Block Content */}
        <div className="p-3">
          <BlockRenderer
            block={block}
            isSelected={isSelected}
            onUpdate={onUpdate}
            pageId={pageId}
          />
        </div>
      </div>
    </div>
  );
}
