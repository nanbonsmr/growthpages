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
  viewMode?: 'desktop' | 'tablet' | 'mobile';
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
  viewMode,
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
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Default position values
  const position = block.position || { x: 0, y: 0, width: 100, height: 0 };
  const offsetX = position.x || 0;
  const offsetY = position.y || 0;
  const customWidth = position.width || 100; // percentage
  const customHeight = position.height || 0; // pixels, 0 = auto

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${offsetX}px`,
    marginTop: `${offsetY}px`,
    width: `${customWidth}%`,
    ...(customHeight > 0 ? { height: `${customHeight}px`, overflow: 'hidden' } : {}),
  };

  const getClientPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if ('touches' in e) {
      const touch = e.touches[0] || (e as TouchEvent).changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
  };

  const handleMoveStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const pos = getClientPos(e);
    setIsMoving(true);
    setMoveStart({ x: pos.x - offsetX, y: pos.y - offsetY });
    onSelect();
  }, [offsetX, offsetY, onSelect]);

  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const pos = getClientPos(e);
    setIsResizing(true);
    const blockEl = (e.target as HTMLElement).closest('.group') as HTMLElement;
    const currentHeightPx = blockEl?.getBoundingClientRect().height || 100;
    setResizeStart({ x: pos.x, y: pos.y, width: customWidth, height: customHeight || currentHeightPx });
    onSelect();
  }, [customWidth, customHeight, onSelect]);

  const handlePointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    const pos = getClientPos(e);

    if (isMoving && onPositionChange) {
      onPositionChange({
        ...position,
        x: pos.x - moveStart.x,
        y: pos.y - moveStart.y,
      });
    }

    if (isResizing && onPositionChange) {
      const deltaX = pos.x - resizeStart.x;
      const deltaY = pos.y - resizeStart.y;
      const containerWidth = (e.target as HTMLElement)?.closest('.min-h-\\[600px\\]')?.clientWidth || 800;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = Math.max(20, Math.min(100, resizeStart.width + deltaPercent));
      const newHeight = Math.max(40, resizeStart.height + deltaY);
      onPositionChange({
        ...position,
        width: newWidth,
        height: newHeight,
      });
    }
  }, [isMoving, isResizing, moveStart, resizeStart, position, onPositionChange]);

  const handlePointerUp = useCallback(() => {
    setIsMoving(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isMoving || isResizing) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove, { passive: false });
      window.addEventListener('touchend', handlePointerUp);
      return () => {
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('mouseup', handlePointerUp);
        window.removeEventListener('touchmove', handlePointerMove);
        window.removeEventListener('touchend', handlePointerUp);
      };
    }
  }, [isMoving, isResizing, handlePointerMove, handlePointerUp]);

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
            onTouchStart={handleMoveStart}
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
        <div
          className={cn("p-3", customHeight > 0 && "h-full overflow-auto")}
          style={{
            ...(block.props._bgColor ? { backgroundColor: block.props._bgColor } : {}),
            ...(block.props._padding !== undefined ? { padding: `${block.props._padding}px` } : {}),
            ...(block.props._borderRadius ? { borderRadius: `${block.props._borderRadius}px` } : {}),
            ...(block.props._opacity !== undefined && block.props._opacity !== 1 ? { opacity: block.props._opacity } : {}),
            ...(block.props._borderStyle && block.props._borderStyle !== 'none' ? {
              border: `1px ${block.props._borderStyle} ${block.props._borderColor || '#e5e7eb'}`,
            } : {}),
          }}
        >
          <BlockRenderer
            block={block}
            isSelected={isSelected}
            onUpdate={onUpdate}
            pageId={pageId}
            viewMode={viewMode}
          />
        </div>

        {/* Resize Handle - SE corner */}
        {isSelected && (
          <div
            onMouseDown={handleResizeStart}
            className={cn(
              'absolute bottom-1 right-1 w-5 h-5 cursor-nwse-resize',
              'bg-primary/80 hover:bg-primary rounded-bl rounded-tr',
              'flex items-center justify-center transition-colors'
            )}
            title="Resize"
          >
            <Maximize2 className="h-3 w-3 text-primary-foreground rotate-90" />
          </div>
        )}
      </div>
    </div>
  );
}
