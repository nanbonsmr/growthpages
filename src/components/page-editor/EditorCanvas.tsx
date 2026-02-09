import { useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Block, PageSettings, BlockPosition } from './types';
import { ResizableBlock } from './blocks/ResizableBlock';
import { cn } from '@/lib/utils';

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
            {/* Flow Layout - now with free positioning */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
