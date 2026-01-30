import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block, PageSettings } from './types';
import { BlockRenderer } from './blocks/BlockRenderer';
import { cn } from '@/lib/utils';
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SortableBlockProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdate: (props: Record<string, any>) => void;
  pageId?: string;
}

function SortableBlock({ block, isSelected, onSelect, onDelete, onUpdate, pageId }: SortableBlockProps) {
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
        isDragging && 'z-50 opacity-70'
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
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={cn(
            'absolute -left-10 top-1/2 -translate-y-1/2 p-1.5 rounded cursor-grab',
            'bg-muted opacity-0 group-hover:opacity-100 transition-opacity',
            'hover:bg-accent'
          )}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Delete Button */}
        <Button
          variant="destructive"
          size="icon"
          className={cn(
            'absolute -right-10 top-1/2 -translate-y-1/2 h-8 w-8',
            'opacity-0 group-hover:opacity-100 transition-opacity'
          )}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

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
  onSelectBlock: (id: string | null) => void;
  onDeleteBlock: (id: string) => void;
  onUpdateBlock: (id: string, props: Record<string, any>) => void;
  pageId?: string;
}

export function EditorCanvas({
  blocks,
  settings,
  selectedBlockId,
  viewMode,
  onSelectBlock,
  onDeleteBlock,
  onUpdateBlock,
  pageId,
}: EditorCanvasProps) {
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
            ref={setNodeRef}
            className={cn(
              'min-h-[600px] rounded-xl shadow-2xl overflow-hidden transition-all',
              isOver && 'ring-2 ring-primary ring-offset-2'
            )}
            style={{
              ...getBackgroundStyle(),
              fontFamily: settings.fontFamily,
            }}
            onClick={() => onSelectBlock(null)}
          >
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
                  <div className="py-4 space-y-2 pl-10 pr-10">
                    {blocks.map((block) => (
                      <SortableBlock
                        key={block.id}
                        block={block}
                        isSelected={selectedBlockId === block.id}
                        onSelect={() => onSelectBlock(block.id)}
                        onDelete={() => onDeleteBlock(block.id)}
                        onUpdate={(props) => onUpdateBlock(block.id, props)}
                        pageId={pageId}
                      />
                    ))}
                  </div>
                )}
              </SortableContext>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
