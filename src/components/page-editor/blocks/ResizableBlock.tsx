import { useState, useRef, useCallback, useEffect } from 'react';
import { Block, BlockPosition } from '../types';
import { BlockRenderer } from './BlockRenderer';
import { cn } from '@/lib/utils';
import { GripVertical, Trash2, Move, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResizableBlockProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdate: (props: Record<string, any>) => void;
  onPositionChange: (position: BlockPosition) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  pageId?: string;
}

export function ResizableBlock({
  block,
  isSelected,
  onSelect,
  onDelete,
  onUpdate,
  onPositionChange,
  containerRef,
  pageId,
}: ResizableBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const position = block.position || { x: 0, y: 0, width: 300, height: 100 };

  const handleMouseDown = useCallback((e: React.MouseEvent, action: 'drag' | 'resize') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (action === 'drag') {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    } else {
      setIsResizing(true);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: position.width,
        height: position.height,
      });
    }
    onSelect();
  }, [position, onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    if (isDragging) {
      const newX = Math.max(0, Math.min(e.clientX - dragStart.x, containerRect.width - position.width));
      const newY = Math.max(0, e.clientY - dragStart.y);
      
      onPositionChange({
        ...position,
        x: newX,
        y: newY,
      });
    }

    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(100, resizeStart.width + deltaX);
      const newHeight = Math.max(50, resizeStart.height + deltaY);
      
      onPositionChange({
        ...position,
        width: Math.min(newWidth, containerRect.width - position.x),
        height: newHeight,
      });
    }
  }, [isDragging, isResizing, dragStart, resizeStart, position, containerRef, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={blockRef}
      className={cn(
        'absolute group',
        isDragging && 'cursor-grabbing z-50',
        isResizing && 'z-50',
        isSelected && 'z-40'
      )}
      style={{
        left: position.x,
        top: position.y,
        width: position.width,
        height: 'auto',
        minHeight: position.height,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div
        className={cn(
          'relative h-full border-2 border-transparent rounded-lg transition-all',
          isSelected && 'border-primary shadow-lg',
          !isSelected && 'hover:border-border'
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
          {/* Move Handle */}
          <div
            onMouseDown={(e) => handleMouseDown(e, 'drag')}
            className={cn(
              'p-1 rounded cursor-grab active:cursor-grabbing',
              'hover:bg-muted transition-colors'
            )}
          >
            <Move className="h-4 w-4 text-muted-foreground" />
          </div>

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
        <div className="p-2 h-full overflow-hidden">
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
            onMouseDown={(e) => handleMouseDown(e, 'resize')}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-primary rounded-tl rounded-br flex items-center justify-center"
          >
            <Maximize2 className="h-2.5 w-2.5 text-primary-foreground rotate-90" />
          </div>
        )}
      </div>
    </div>
  );
}
