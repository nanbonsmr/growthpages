import { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Block, PageSettings, PageData, BLOCK_DEFINITIONS, DEFAULT_PAGE_SETTINGS, BlockPosition } from './types';
import { PAGE_TEMPLATES, PageTemplate } from './templates';
import { ElementsPanel } from './ElementsPanel';
import { EditorCanvas } from './EditorCanvas';
import { SettingsPanel } from './SettingsPanel';
import { EditorToolbar } from './EditorToolbar';
import { BlockRenderer } from './blocks/BlockRenderer';
import { useToast } from '@/hooks/use-toast';

interface PageEditorProps {
  initialData?: PageData;
  pageId?: string;
  onSave: (data: PageData) => Promise<void>;
  onPublish: (data: PageData) => Promise<void>;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export function PageEditor({ initialData, pageId, onSave, onPublish }: PageEditorProps) {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<Block[]>(initialData?.blocks || []);
  const [settings, setSettings] = useState<PageSettings>(
    initialData?.settings || { ...DEFAULT_PAGE_SETTINGS }
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // History for undo/redo
  const [history, setHistory] = useState<Block[][]>([blocks]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

  const pushHistory = useCallback((newBlocks: Block[]) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newBlocks);
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setBlocks(history[newIndex]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setBlocks(history[newIndex]);
    }
  }, [history, historyIndex]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Check if dragging a new block from the elements panel
    const activeData = active.data.current;
    if (activeData?.type === 'new-block') {
      const newBlock: Block = {
        id: generateId(),
        type: activeData.blockType,
        props: { ...activeData.defaultProps },
      };

      // Add to the end if dropped on canvas, or at specific position
      const overIndex = blocks.findIndex((b) => b.id === over.id);
      const newBlocks = [...blocks];
      
      if (overIndex >= 0) {
        newBlocks.splice(overIndex, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }

      setBlocks(newBlocks);
      pushHistory(newBlocks);
      setSelectedBlockId(newBlock.id);
      return;
    }

    // Reordering existing blocks
    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newBlocks = arrayMove(blocks, oldIndex, newIndex);
        setBlocks(newBlocks);
        pushHistory(newBlocks);
      }
    }
  };

  const handleDeleteBlock = (id: string) => {
    const newBlocks = blocks.filter((b) => b.id !== id);
    setBlocks(newBlocks);
    pushHistory(newBlocks);
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const handleMoveBlock = (id: string, direction: 'up' | 'down') => {
    const currentIndex = blocks.findIndex((b) => b.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    
    const newBlocks = arrayMove(blocks, currentIndex, newIndex);
    setBlocks(newBlocks);
    pushHistory(newBlocks);
  };

  const handleUpdateBlock = (id: string, props: Record<string, any>) => {
    const newBlocks = blocks.map((b) =>
      b.id === id ? { ...b, props: { ...b.props, ...props } } : b
    );
    setBlocks(newBlocks);
    // Don't push to history for every keystroke, only on blur
  };

  const handleUpdateBlockPosition = (id: string, position: BlockPosition) => {
    const newBlocks = blocks.map((b) =>
      b.id === id ? { ...b, position } : b
    );
    setBlocks(newBlocks);
  };

  const handleUpdateSettings = (newSettings: Partial<PageSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleLoadTemplate = (template: PageTemplate) => {
    // Generate new IDs for template blocks and assign positions for free layout
    let currentY = 20;
    const newBlocks = template.blocks.map((b) => {
      const blockHeight = getBlockDefaultHeight(b.type);
      const position = {
        x: 20,
        y: currentY,
        width: 600,
        height: blockHeight,
      };
      currentY += blockHeight + 20; // Add spacing between blocks
      return {
        ...b,
        id: generateId(),
        position,
      };
    });
    setBlocks(newBlocks);
    pushHistory(newBlocks);
    setSettings((prev) => ({ ...prev, ...template.settings }));
    setSelectedBlockId(null);
    toast({
      title: 'Template loaded',
      description: `"${template.name}" template has been applied.`,
    });
  };

  // Helper to get default height for different block types
  const getBlockDefaultHeight = (type: string): number => {
    const heights: Record<string, number> = {
      spacer: 40,
      heading: 80,
      text: 60,
      form: 200,
      image: 200,
      button: 60,
      divider: 30,
      countdown: 100,
      testimonial: 150,
      social: 60,
      video: 300,
      accordion: 200,
      'feature-grid': 250,
      pricing: 400,
      hero: 350,
      nav: 70,
      footer: 200,
      'contact-form': 350,
    };
    return heights[type] || 100;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({ blocks, settings });
      toast({
        title: 'Saved',
        description: 'Your changes have been saved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save changes.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      await onPublish({ blocks, settings });
      toast({
        title: 'Published',
        description: 'Your page is now live!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to publish page.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    window.open(`/p/${settings.slug}`, '_blank');
  };

  // Get active block for drag overlay
  const activeBlock = activeId
    ? blocks.find((b) => b.id === activeId) ||
      (activeId.startsWith('new-')
        ? {
            id: activeId,
            type: activeId.replace('new-', '') as any,
            props: BLOCK_DEFINITIONS.find((b) => b.type === activeId.replace('new-', ''))?.defaultProps || {},
          }
        : null)
    : null;

  return (
    <div className="h-screen flex flex-col bg-background">
      <EditorToolbar
        slug={settings.slug}
        viewMode={viewMode}
        isSaving={isSaving}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        templates={PAGE_TEMPLATES}
        onSlugChange={(slug) => handleUpdateSettings({ slug })}
        onViewModeChange={setViewMode}
        onSave={handleSave}
        onPublish={handlePublish}
        onPreview={handlePreview}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onLoadTemplate={handleLoadTemplate}
      />

      <div className="flex-1 flex overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <ElementsPanel />

          <EditorCanvas
            blocks={blocks}
            settings={settings}
            selectedBlockId={selectedBlockId}
            viewMode={viewMode}
            onSelectBlock={setSelectedBlockId}
            onDeleteBlock={handleDeleteBlock}
            onUpdateBlock={handleUpdateBlock}
            onMoveBlock={handleMoveBlock}
            onUpdateBlockPosition={handleUpdateBlockPosition}
            pageId={pageId}
          />

          <DragOverlay>
            {activeBlock && (
              <div className="bg-background border border-primary rounded-lg p-4 shadow-lg opacity-80">
                <BlockRenderer
                  block={activeBlock}
                  isSelected={false}
                  isPreview
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>

        <SettingsPanel
          selectedBlock={selectedBlock}
          settings={settings}
          onUpdateBlock={(props) => {
            if (selectedBlockId) {
              handleUpdateBlock(selectedBlockId, props);
            }
          }}
          onUpdateSettings={handleUpdateSettings}
        />
      </div>
    </div>
  );
}
