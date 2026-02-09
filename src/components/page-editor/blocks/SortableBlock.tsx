import { useState, useCallback, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block, BlockPosition } from '../types';
import { BlockRenderer } from './BlockRenderer';
import { cn } from '@/lib/utils';
import { GripVertical, Trash2, ChevronUp, ChevronDown, Move, Maximize2 } from 'lucide-react';
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
  onPositionChange?: (position: BlockPosition) => void;
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
  onPositionChange,
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

  const [isMoving, setIsMoving] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [moveStart, setMoveStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, width: 0 });

  // Default position values
  const position = block.position || { x: 0, y: 0, width: 100, height: 0 };
  const offsetX = position.x || 0;
  const offsetY = position.y || 0;
  const customWidth = position.width || 100; // percentage

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${offsetX}px`,
    marginTop: `${offsetY}px`,
    width: `${customWidth}%`,
  };

  const handleMoveStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMoving(true);
    setMoveStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
    onSelect();
  }, [offsetX, offsetY, onSelect]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({ x: e.clientX, width: customWidth });
    onSelect();
  }, [customWidth, onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isMoving && onPositionChange) {
      const newX = e.clientX - moveStart.x;
      const newY = e.clientY - moveStart.y;
      onPositionChange({
        ...position,
        x: newX,
        y: newY,
      });
    }

    if (isResizing && onPositionChange) {
      const deltaX = e.clientX - resizeStart.x;
      const containerWidth = (e.target as HTMLElement)?.closest('.min-h-\\[600px\\]')?.clientWidth || 800;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = Math.max(20, Math.min(100, resizeStart.width + deltaPercent));
      onPositionChange({
        ...position,
        width: newWidth,
      });
    }
  }, [isMoving, isResizing, moveStart, resizeStart, position, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsMoving(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isMoving || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isMoving, isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative',
        isDragging && 'opacity-50 z-50',
        (isMoving || isResizing) && 'z-50'
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
          {/* Reorder Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className={cn(
              'p-1 rounded cursor-grab active:cursor-grabbing',
              'hover:bg-muted transition-colors'
            )}
            title="Drag to reorder"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Free Move Handle */}
          <div
            onMouseDown={handleMoveStart}
            className={cn(
              'p-1 rounded cursor-move',
              'hover:bg-muted transition-colors',
              isMoving && 'bg-primary/20'
            )}
            title="Move freely"
          >
            <Move className="h-4 w-4 text-muted-foreground" />
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
            title="Move up"
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
            title="Move down"
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
            title="Delete"
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

        {/* Resize Handle */}
        {isSelected && (
          <div
            onMouseDown={handleResizeStart}
            className={cn(
              'absolute bottom-1 right-1 w-5 h-5 cursor-ew-resize',
              'bg-primary/80 hover:bg-primary rounded-bl rounded-tr',
              'flex items-center justify-center transition-colors'
            )}
            title="Resize width"
          >
            <Maximize2 className="h-3 w-3 text-primary-foreground rotate-90" />
          </div>
        )}
      </div>
    </div>
  );
}
