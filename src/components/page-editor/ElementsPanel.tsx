import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  Type,
  AlignLeft,
  Image,
  MousePointer,
  Minus,
  MoveVertical,
  FileInput,
  Share2,
  Quote,
  Clock,
  Play,
  ChevronDown,
  CreditCard,
  LayoutGrid,
  Sparkles,
  PanelTop,
  PanelBottom,
  MessageSquare,
} from 'lucide-react';
import { BLOCK_DEFINITIONS, BlockDefinition, BlockCategory } from './types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Type,
  AlignLeft,
  Image,
  MousePointer,
  Minus,
  MoveVertical,
  FileInput,
  Share2,
  Quote,
  Clock,
  Play,
  ChevronDown,
  CreditCard,
  LayoutGrid,
  Sparkles,
  PanelTop,
  PanelBottom,
  MessageSquare,
};

const categoryLabels: Record<BlockCategory, string> = {
  basic: 'Basic',
  forms: 'Forms',
  marketing: 'Marketing',
  layout: 'Layout',
};

interface DraggableBlockProps {
  block: BlockDefinition;
}

function DraggableBlock({ block }: DraggableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `new-${block.type}`,
    data: {
      type: 'new-block',
      blockType: block.type,
      defaultProps: block.defaultProps,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const Icon = iconMap[block.icon] || Type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'flex flex-col items-center gap-2 p-3 rounded-lg border border-border bg-card cursor-grab',
        'hover:border-primary/50 hover:bg-accent transition-colors',
        isDragging && 'opacity-50 cursor-grabbing'
      )}
    >
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="text-xs font-medium text-foreground">{block.label}</span>
    </div>
  );
}

export function ElementsPanel() {
  const categories = ['basic', 'layout', 'forms', 'marketing'] as BlockCategory[];

  return (
    <div className="w-64 border-r border-border bg-background flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Elements</h2>
        <p className="text-xs text-muted-foreground mt-1">Drag blocks to the canvas</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {categories.map((category) => {
            const blocks = BLOCK_DEFINITIONS.filter((b) => b.category === category);
            if (blocks.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {categoryLabels[category]}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {blocks.map((block) => (
                    <DraggableBlock key={block.type} block={block} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
