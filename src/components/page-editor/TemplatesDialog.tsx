import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PageTemplate } from './templates';
import { cn } from '@/lib/utils';
import {
  LayoutTemplate,
  ChevronDown,
  Mail,
  Rocket,
  Calendar,
  Gift,
  Download,
  Globe,
  Palette,
  Video,
  User,
  Check,
} from 'lucide-react';

interface TemplatesDialogProps {
  templates: PageTemplate[];
  onLoadTemplate: (template: PageTemplate) => void;
}

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  newsletter: <Mail className="h-5 w-5" />,
  waitlist: <Rocket className="h-5 w-5" />,
  event: <Calendar className="h-5 w-5" />,
  product_launch: <Gift className="h-5 w-5" />,
  free_resource: <Download className="h-5 w-5" />,
  saas_landing: <Globe className="h-5 w-5" />,
  agency_portfolio: <Palette className="h-5 w-5" />,
  webinar: <Video className="h-5 w-5" />,
  personal_brand: <User className="h-5 w-5" />,
  portfolio: <Palette className="h-5 w-5" />,
  cv_resume: <User className="h-5 w-5" />,
  coaching: <User className="h-5 w-5" />,
  restaurant: <Globe className="h-5 w-5" />,
};

const TEMPLATE_COLORS: Record<string, string> = {
  newsletter: 'from-violet-500 to-purple-600',
  waitlist: 'from-cyan-500 to-blue-600',
  event: 'from-orange-500 to-red-600',
  product_launch: 'from-purple-500 to-pink-600',
  free_resource: 'from-emerald-500 to-green-600',
  saas_landing: 'from-blue-500 to-indigo-600',
  agency_portfolio: 'from-pink-500 to-rose-600',
  webinar: 'from-indigo-500 to-blue-600',
  personal_brand: 'from-amber-400 to-orange-500',
  portfolio: 'from-cyan-400 to-teal-600',
  cv_resume: 'from-blue-400 to-blue-700',
  coaching: 'from-purple-400 to-violet-600',
  restaurant: 'from-amber-500 to-yellow-700',
};

const TEMPLATE_BADGES: Record<string, string> = {
  saas_landing: 'Popular',
  webinar: 'New',
  agency_portfolio: 'Pro',
  portfolio: 'New',
  cv_resume: 'Popular',
};

export function TemplatesDialog({ templates, onLoadTemplate }: TemplatesDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelectTemplate = (template: PageTemplate) => {
    onLoadTemplate(template);
    setOpen(false);
    setSelectedId(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <LayoutTemplate className="h-4 w-4" />
          Templates
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden w-[95vw] sm:w-auto">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-border">
          <DialogTitle className="text-lg sm:text-xl font-semibold">Choose a Template</DialogTitle>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Start with a professionally designed template and customize it to match your brand.
          </p>
        </DialogHeader>
        <ScrollArea className="h-[55vh] sm:h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-6">
            {templates.map((template) => {
              const isSelected = selectedId === template.id;
              const icon = TEMPLATE_ICONS[template.id] || <LayoutTemplate className="h-5 w-5" />;
              const gradient = TEMPLATE_COLORS[template.id] || 'from-gray-500 to-gray-600';
              const badge = TEMPLATE_BADGES[template.id];

              return (
                <div
                  key={template.id}
                  onClick={() => setSelectedId(template.id)}
                  onDoubleClick={() => handleSelectTemplate(template)}
                  className={cn(
                    'group relative rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden',
                    isSelected
                      ? 'border-primary ring-2 ring-primary/20 scale-[1.02]'
                      : 'border-border hover:border-primary/50 hover:shadow-lg'
                  )}
                >
                  {/* Preview Header */}
                  <div className={cn('h-32 bg-gradient-to-br relative', gradient)}>
                    {/* Mock Content */}
                    <div className="absolute inset-0 p-4 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white mb-2">
                        {icon}
                      </div>
                      <div className="w-24 h-2 bg-white/30 rounded-full mb-1.5" />
                      <div className="w-16 h-1.5 bg-white/20 rounded-full" />
                    </div>
                    
                    {/* Badge */}
                    {badge && (
                      <Badge
                        variant="secondary"
                        className="absolute top-2 right-2 bg-white/90 text-foreground text-[10px] font-semibold"
                      >
                        {badge}
                      </Badge>
                    )}
                    
                    {/* Selected Check */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="p-4 bg-card">
                    <h3 className="font-semibold text-sm text-foreground mb-1">
                      {template.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4 border-t border-border bg-muted/50">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {selectedId
              ? `Selected: ${templates.find((t) => t.id === selectedId)?.name}`
              : 'Tap to select, then apply'}
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button
              onClick={() => {
                const template = templates.find((t) => t.id === selectedId);
                if (template) handleSelectTemplate(template);
              }}
              disabled={!selectedId}
              className="flex-1 sm:flex-none"
            >
              Apply Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
