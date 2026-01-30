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
  Smartphone,
  LayoutTemplate,
  ChevronDown,
  Loader2,
  ArrowLeft,
  Share2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { PageTemplate } from './templates';
import { cn } from '@/lib/utils';
import { getPublicPageUrl } from '@/lib/config';
import { useToast } from '@/hooks/use-toast';

interface EditorToolbarProps {
  slug: string;
  viewMode: 'desktop' | 'mobile';
  isSaving: boolean;
  canUndo: boolean;
  canRedo: boolean;
  templates: PageTemplate[];
  onSlugChange: (slug: string) => void;
  onViewModeChange: (mode: 'desktop' | 'mobile') => void;
  onSave: () => void;
  onPublish: () => void;
  onPreview: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onLoadTemplate: (template: PageTemplate) => void;
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
}: EditorToolbarProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
    <div className="h-14 border-b border-border bg-background flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Back Button */}
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

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Templates */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <LayoutTemplate className="h-4 w-4" />
              Templates
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {templates.map((template) => (
              <DropdownMenuItem
                key={template.id}
                onClick={() => onLoadTemplate(template)}
              >
                <div>
                  <p className="font-medium">{template.name}</p>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-border" />

        {/* Slug Editor */}
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

      {/* Center Section - View Mode */}
      <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
        <Button
          variant={viewMode === 'desktop' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('desktop')}
          className={cn(
            'gap-2',
            viewMode === 'desktop' && 'shadow-sm'
          )}
        >
          <Monitor className="h-4 w-4" />
          Desktop
        </Button>
        <Button
          variant={viewMode === 'mobile' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('mobile')}
          className={cn(
            'gap-2',
            viewMode === 'mobile' && 'shadow-sm'
          )}
        >
          <Smartphone className="h-4 w-4" />
          Mobile
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onPreview} className="gap-2">
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        
        {/* Share Dropdown */}
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
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
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
