import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Block, PageSettings, BlockPosition } from './types';
import { SortableBlock } from './blocks/SortableBlock';
import { cn } from '@/lib/utils';

interface EditorCanvasProps {
  blocks: Block[];
  settings: PageSettings;
  selectedBlockId: string | null;
  viewMode: 'desktop' | 'tablet' | 'mobile';
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
  onSelectBlock,
  onDeleteBlock,
  onUpdateBlock,
  onMoveBlock,
  onUpdateBlockPosition,
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

  return (
    <div className="flex-1 bg-muted/50 overflow-auto">
      <div className="p-8 min-h-full flex justify-center">
        <div
          className={cn(
            'transition-all duration-300',
            viewMode === 'mobile' ? 'w-[375px]' : viewMode === 'tablet' ? 'w-[768px]' : 'w-full max-w-full'
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
            {/* Scrollable Flow Layout */}
            <div className="p-6 space-y-4">
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
                  blocks.map((block, index) => (
                    <SortableBlock
                      key={block.id}
                      block={block}
                      isSelected={selectedBlockId === block.id}
                      isFirst={index === 0}
                      isLast={index === blocks.length - 1}
                      viewMode={viewMode}
                      onSelect={() => onSelectBlock(block.id)}
                      onDelete={() => onDeleteBlock(block.id)}
                      onUpdate={(props) => onUpdateBlock(block.id, props)}
                      onMoveUp={() => onMoveBlock(block.id, 'up')}
                      onMoveDown={() => onMoveBlock(block.id, 'down')}
                      onPositionChange={(pos) => onUpdateBlockPosition(block.id, pos)}
                      pageId={pageId}
                    />
                  ))
                )}
              </SortableContext>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
