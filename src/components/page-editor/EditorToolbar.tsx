import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Save,
  Upload,
  Eye,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Loader2,
  ArrowLeft,
  Share2,
  Copy,
  ExternalLink,
  LayoutGrid,
  Settings,
} from 'lucide-react';
import { PageTemplate } from './templates';
import { TemplatesDialog } from './TemplatesDialog';
import { cn } from '@/lib/utils';
import { getPublicPageUrl } from '@/lib/config';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface EditorToolbarProps {
  slug: string;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  isSaving: boolean;
  canUndo: boolean;
  canRedo: boolean;
  templates: PageTemplate[];
  onSlugChange: (slug: string) => void;
  onViewModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  onSave: () => void;
  onPublish: () => void;
  onPreview: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onLoadTemplate: (template: PageTemplate) => void;
  onToggleElements?: () => void;
  onToggleSettings?: () => void;
}

export function EditorToolbar({
  slug,
  viewMode,
  isSaving,
  canUndo,
  canRedo,
  templates,
  onSlugChange,
  onViewModeChange,
  onSave,
  onPublish,
  onPreview,
  onUndo,
  onRedo,
  onLoadTemplate,
  onToggleElements,
  onToggleSettings,
}: EditorToolbarProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleCopyLink = () => {
    const url = getPublicPageUrl(slug);
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link copied!',
      description: 'The public page URL has been copied to your clipboard.',
    });
  };

  const handleOpenPublicPage = () => {
    window.open(getPublicPageUrl(slug), '_blank');
  };

  if (isMobile) {
    return (
      <div className="border-b border-border bg-background">
        {/* Top row: back, title, save/publish */}
        <div className="h-12 flex items-center justify-between px-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard/pages')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo}>
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onRedo} disabled={!canRedo}>
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={onSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            </Button>
            <Button size="icon" onClick={onPublish} disabled={isSaving}>
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bottom row: elements, templates, preview, settings */}
        <div className="h-10 flex items-center justify-between px-3 border-t border-border/50">
          <div className="flex items-center gap-1">
            {onToggleElements && (
              <Button variant="ghost" size="sm" onClick={onToggleElements} className="gap-1.5 text-xs h-8">
                <LayoutGrid className="h-3.5 w-3.5" />
                Elements
              </Button>
            )}
            <TemplatesDialog templates={templates} onLoadTemplate={onLoadTemplate} />
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onPreview} className="h-8 w-8">
              <Eye className="h-3.5 w-3.5" />
            </Button>
            {onToggleSettings && (
              <Button variant="ghost" size="icon" onClick={onToggleSettings} className="h-8 w-8">
                <Settings className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-14 border-b border-border bg-background flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard/pages')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo} title="Undo">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onRedo} disabled={!canRedo} title="Redo">
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />

        <TemplatesDialog templates={templates} onLoadTemplate={onLoadTemplate} />

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">/p/</span>
          <Input
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            className="w-40 h-8"
            placeholder="page-slug"
          />
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === 'desktop' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => onViewModeChange('desktop')}
            className={cn('h-8 w-8', viewMode === 'desktop' && 'shadow-sm')}
            title="Desktop"
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'tablet' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => onViewModeChange('tablet')}
            className={cn('h-8 w-8', viewMode === 'tablet' && 'shadow-sm')}
            title="Tablet"
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => onViewModeChange('mobile')}
            className={cn('h-8 w-8', viewMode === 'mobile' && 'shadow-sm')}
            title="Mobile"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onPreview} className="gap-2">
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOpenPublicPage} className="cursor-pointer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Public Page
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="outline" size="sm" onClick={onSave} disabled={isSaving} className="gap-2">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Draft
        </Button>
        <Button size="sm" onClick={onPublish} disabled={isSaving} className="gap-2">
          <Upload className="h-4 w-4" />
          Publish
        </Button>
      </div>
    </div>
  );
}
