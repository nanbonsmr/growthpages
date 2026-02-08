import { useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block, PageSettings, BlockPosition } from './types';
import { BlockRenderer } from './blocks/BlockRenderer';
import { ResizableBlock } from './blocks/ResizableBlock';
import { cn } from '@/lib/utils';
import { GripVertical, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SortableBlockProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdate: (props: Record<string, any>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  pageId?: string;
}

function SortableBlock({ 
  block, 
  isSelected, 
  onSelect, 
  onDelete, 
  onUpdate, 
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  pageId 
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
        'relative group',
        isDragging && 'z-50 opacity-50'
      )}
    >
      <div
        className={cn(
          'relative border-2 border-transparent rounded-lg transition-all',
          isSelected && 'border-primary shadow-lg',
          !isSelected && 'hover:border-border'
        )}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {/* Block Controls - Always visible on hover, positioned at top */}
        <div
          className={cn(
            'absolute -top-3 left-1/2 -translate-x-1/2 z-10',
            'flex items-center gap-1 px-2 py-1 rounded-full',
            'bg-card border border-border shadow-lg',
            'opacity-0 group-hover:opacity-100 transition-all duration-200',
            'scale-90 group-hover:scale-100'
          )}
        >
          {/* Move Up */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            disabled={!canMoveUp}
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>

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

          {/* Move Down */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            disabled={!canMoveDown}
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
        <div className="p-2">
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

interface EditorCanvasProps {
  blocks: Block[];
  settings: PageSettings;
  selectedBlockId: string | null;
  viewMode: 'desktop' | 'mobile';
  layoutMode: 'flow' | 'free';
  onSelectBlock: (id: string | null) => void;
  onDeleteBlock: (id: string) => void;
  onUpdateBlock: (id: string, props: Record<string, any>) => void;
  onMoveBlock: (id: string, direction: 'up' | 'down') => void;
  onUpdateBlockPosition: (id: string, position: BlockPosition) => void;
  pageId?: string;
}

export function EditorCanvas({
  blocks,
  settings,
  selectedBlockId,
  viewMode,
  layoutMode,
  onSelectBlock,
  onDeleteBlock,
  onUpdateBlock,
  onMoveBlock,
  onUpdateBlockPosition,
  pageId,
}: EditorCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  const getBackgroundStyle = () => {
    switch (settings.backgroundType) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${settings.gradientFrom}, ${settings.gradientTo})`,
        };
      case 'image':
        return settings.backgroundImage
          ? {
              backgroundImage: `url(${settings.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : { backgroundColor: settings.backgroundColor };
      default:
        return { backgroundColor: settings.backgroundColor };
    }
  };

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const combineRefs = (el: HTMLDivElement | null) => {
    setNodeRef(el);
    if (containerRef.current !== el) {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    }
  };

  return (
    <div className="flex-1 bg-muted/50 overflow-auto">
      <div className="p-8 min-h-full flex justify-center">
        <div
          className={cn(
            'transition-all duration-300',
            viewMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-4xl'
          )}
        >
          {/* Canvas Container */}
          <div
            ref={combineRefs}
            className={cn(
              'min-h-[600px] rounded-xl shadow-2xl overflow-hidden transition-all',
              isOver && 'ring-2 ring-primary ring-offset-2',
              layoutMode === 'free' && 'relative'
            )}
            style={{
              ...getBackgroundStyle(),
              fontFamily: settings.fontFamily,
            }}
            onClick={() => onSelectBlock(null)}
          >
            {layoutMode === 'flow' ? (
              // Flow Layout (original vertical stacking)
              <div className={cn('mx-auto px-6', maxWidthClasses[settings.maxWidth])}>
                <SortableContext
                  items={blocks.map((b) => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {blocks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center">
                      <div className="p-4 rounded-xl bg-background/80 backdrop-blur">
                        <p className="text-muted-foreground font-medium">
                          Drag elements here to start building
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Or choose a template from the toolbar
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 space-y-4 px-4">
                      {blocks.map((block, index) => (
                        <SortableBlock
                          key={block.id}
                          block={block}
                          isSelected={selectedBlockId === block.id}
                          onSelect={() => onSelectBlock(block.id)}
                          onDelete={() => onDeleteBlock(block.id)}
                          onUpdate={(props) => onUpdateBlock(block.id, props)}
                          onMoveUp={() => onMoveBlock(block.id, 'up')}
                          onMoveDown={() => onMoveBlock(block.id, 'down')}
                          canMoveUp={index > 0}
                          canMoveDown={index < blocks.length - 1}
                          pageId={pageId}
                        />
                      ))}
                    </div>
                  )}
                </SortableContext>
              </div>
            ) : (
              // Free Position Layout
              <div className="relative w-full min-h-[600px]">
                {blocks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <div className="p-4 rounded-xl bg-background/80 backdrop-blur">
                      <p className="text-muted-foreground font-medium">
                        Drag elements here to start building
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Or choose a template from the toolbar
                      </p>
                    </div>
                  </div>
                ) : (
                  blocks.map((block, index) => (
                    <ResizableBlock
                      key={block.id}
                      block={{
                        ...block,
                        position: block.position || {
                          x: 20,
                          y: 20 + index * 120,
                          width: viewMode === 'mobile' ? 335 : 600,
                          height: 100,
                        },
                      }}
                      isSelected={selectedBlockId === block.id}
                      onSelect={() => onSelectBlock(block.id)}
                      onDelete={() => onDeleteBlock(block.id)}
                      onUpdate={(props) => onUpdateBlock(block.id, props)}
                      onPositionChange={(position) => onUpdateBlockPosition(block.id, position)}
                      containerRef={containerRef}
                      pageId={pageId}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
