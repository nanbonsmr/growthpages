import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
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
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface PageEditorProps {
  initialData?: PageData;
  pageId?: string;
  onSave: (data: PageData) => Promise<void>;
  onPublish: (data: PageData) => Promise<void>;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export function PageEditor({ initialData, pageId, onSave, onPublish }: PageEditorProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [blocks, setBlocks] = useState<Block[]>(initialData?.blocks || []);
  const [settings, setSettings] = useState<PageSettings>(
    initialData?.settings || { ...DEFAULT_PAGE_SETTINGS }
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [elementsOpen, setElementsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
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
      return newHistory.slice(-50);
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

    const activeData = active.data.current;
    if (activeData?.type === 'new-block') {
      const newBlock: Block = {
        id: generateId(),
        type: activeData.blockType,
        props: { ...activeData.defaultProps },
      };

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
      if (isMobile) setElementsOpen(false);
      return;
    }

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
    const newBlocks = template.blocks.map((b) => ({
      ...b,
      id: generateId(),
    }));
    setBlocks(newBlocks);
    pushHistory(newBlocks);
    setSettings((prev) => ({ ...prev, ...template.settings }));
    setSelectedBlockId(null);
    toast({
      title: 'Template loaded',
      description: `"${template.name}" template has been applied.`,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({ blocks, settings });
      toast({ title: 'Saved', description: 'Your changes have been saved.' });
    } catch (error: any) {
      console.error('Save error:', error);
      const errorMessage = error?.message || error?.code || 'Failed to save changes.';
      toast({
        title: 'Error saving',
        description: errorMessage.includes('duplicate') 
          ? 'This URL slug is already in use. Please choose a different one.'
          : errorMessage,
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
      toast({ title: 'Published', description: 'Your page is now live!' });
    } catch (error: any) {
      console.error('Publish error:', error);
      const errorMessage = error?.message || error?.code || 'Failed to publish page.';
      toast({
        title: 'Error publishing',
        description: errorMessage.includes('duplicate') 
          ? 'This URL slug is already in use. Please choose a different one.'
          : errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    window.open(`/p/${settings.slug}`, '_blank');
  };

  const handleSelectBlock = (id: string | null) => {
    setSelectedBlockId(id);
    if (id && isMobile) {
      setSettingsOpen(true);
    }
  };

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

  const elementsPanelContent = (
    <ElementsPanel />
  );

  const settingsPanelContent = (
    <SettingsPanel
      selectedBlock={selectedBlock}
      blocks={blocks}
      settings={settings}
      onUpdateBlock={(props) => {
        if (selectedBlockId) {
          handleUpdateBlock(selectedBlockId, props);
        }
      }}
      onUpdateSettings={handleUpdateSettings}
    />
  );

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
        onToggleElements={() => setElementsOpen(true)}
        onToggleSettings={() => setSettingsOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {!isMobile && elementsPanelContent}

          <EditorCanvas
            blocks={blocks}
            settings={settings}
            selectedBlockId={selectedBlockId}
            viewMode={isMobile ? 'mobile' : viewMode}
            onSelectBlock={handleSelectBlock}
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

        {!isMobile && settingsPanelContent}

        {isMobile && (
          <Sheet open={elementsOpen} onOpenChange={setElementsOpen}>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetHeader className="p-4 border-b border-border">
                <SheetTitle>Elements</SheetTitle>
              </SheetHeader>
              <div className="h-[calc(100vh-60px)] overflow-hidden">
                {elementsPanelContent}
              </div>
            </SheetContent>
          </Sheet>
        )}

        {isMobile && (
          <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
            <SheetContent side="right" className="w-[300px] p-0">
              <SheetHeader className="p-4 border-b border-border">
                <SheetTitle>Settings</SheetTitle>
              </SheetHeader>
              <div className="h-[calc(100vh-60px)] overflow-hidden">
                {settingsPanelContent}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
}
