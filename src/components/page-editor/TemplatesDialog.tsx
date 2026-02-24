import { useState, useMemo } from 'react';
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
  LayoutTemplate, ChevronDown, Check, Lock, Crown, Sparkles,
  Briefcase, GraduationCap, Dumbbell, Camera, Home, UtensilsCrossed,
  Mail, Rocket, Users, Star,
} from 'lucide-react';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Import template thumbnails
import newsletterThumb from '@/assets/templates/newsletter.png';
import waitlistThumb from '@/assets/templates/waitlist.png';
import eventThumb from '@/assets/templates/event.png';
import productLaunchThumb from '@/assets/templates/product-launch.png';
import freeResourceThumb from '@/assets/templates/free-resource.png';
import saasLandingThumb from '@/assets/templates/saas-landing.png';
import agencyPortfolioThumb from '@/assets/templates/agency-portfolio.png';
import webinarThumb from '@/assets/templates/webinar.png';
import personalBrandThumb from '@/assets/templates/personal-brand.png';
import portfolioThumb from '@/assets/templates/portfolio.png';
import cvResumeThumb from '@/assets/templates/cv-resume.png';
import coachingThumb from '@/assets/templates/coaching.png';
import restaurantThumb from '@/assets/templates/restaurant.png';
import fitnessGymThumb from '@/assets/templates/fitness-gym.png';
import photographyThumb from '@/assets/templates/photography.png';
import realEstateThumb from '@/assets/templates/real-estate.png';
import educationThumb from '@/assets/templates/education.png';

interface TemplatesDialogProps {
  templates: PageTemplate[];
  onLoadTemplate: (template: PageTemplate) => void;
}

const TEMPLATE_THUMBNAILS: Record<string, string> = {
  newsletter: newsletterThumb,
  waitlist: waitlistThumb,
  event: eventThumb,
  product_launch: productLaunchThumb,
  free_resource: freeResourceThumb,
  saas_landing: saasLandingThumb,
  agency_portfolio: agencyPortfolioThumb,
  webinar: webinarThumb,
  personal_brand: personalBrandThumb,
  portfolio: portfolioThumb,
  cv_resume: cvResumeThumb,
  coaching: coachingThumb,
  restaurant: restaurantThumb,
  fitness_gym: fitnessGymThumb,
  photography: photographyThumb,
  real_estate: realEstateThumb,
  education: educationThumb,
};

const TEMPLATE_BADGES: Record<string, { label: string; variant: 'popular' | 'new' }> = {
  saas_landing: { label: 'Popular', variant: 'popular' },
  cv_resume: { label: 'Popular', variant: 'popular' },
  webinar: { label: 'New', variant: 'new' },
  fitness_gym: { label: 'New', variant: 'new' },
  education: { label: 'New', variant: 'new' },
  photography: { label: 'New', variant: 'new' },
  real_estate: { label: 'New', variant: 'new' },
};

type CategoryKey = 'all' | 'marketing' | 'business' | 'creative' | 'industry';

const CATEGORIES: { key: CategoryKey; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'All', icon: Sparkles },
  { key: 'marketing', label: 'Marketing', icon: Rocket },
  { key: 'business', label: 'Business', icon: Briefcase },
  { key: 'creative', label: 'Creative', icon: Camera },
  { key: 'industry', label: 'Industry', icon: Home },
];

const TEMPLATE_CATEGORIES: Record<string, CategoryKey> = {
  newsletter: 'marketing',
  waitlist: 'marketing',
  event: 'marketing',
  product_launch: 'marketing',
  free_resource: 'marketing',
  webinar: 'marketing',
  saas_landing: 'business',
  agency_portfolio: 'business',
  coaching: 'business',
  cv_resume: 'business',
  personal_brand: 'creative',
  portfolio: 'creative',
  photography: 'creative',
  restaurant: 'industry',
  fitness_gym: 'industry',
  real_estate: 'industry',
  education: 'industry',
};

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  all: 'All',
  marketing: 'Marketing',
  business: 'Business',
  creative: 'Creative',
  industry: 'Industry',
};

function getBlockSummary(template: PageTemplate): string[] {
  const types = new Set(template.blocks.map(b => b.type));
  const tags: string[] = [];
  if (types.has('hero')) tags.push('Hero');
  if (types.has('form') || types.has('contact-form')) tags.push('Form');
  if (types.has('testimonial')) tags.push('Testimonial');
  if (types.has('pricing')) tags.push('Pricing');
  if (types.has('accordion')) tags.push('FAQ');
  if (types.has('feature-grid')) tags.push('Features');
  if (types.has('stats')) tags.push('Stats');
  if (types.has('countdown')) tags.push('Countdown');
  if (types.has('social')) tags.push('Social');
  if (types.has('map')) tags.push('Map');
  return tags;
}

const PLAN_HIERARCHY: Record<string, number> = { free: 0, pro: 1, business: 2 };

function canAccessTemplate(template: PageTemplate, currentPlan: string): boolean {
  const required = template.requiredPlan || 'free';
  return (PLAN_HIERARCHY[currentPlan] || 0) >= (PLAN_HIERARCHY[required] || 0);
}

function getPlanLabel(plan: string): string {
  return plan === 'business' ? 'Business' : 'Pro';
}

export function TemplatesDialog({ templates, onLoadTemplate }: TemplatesDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const { currentPlan } = usePlanLimits();
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'all') return templates;
    return templates.filter((t) => TEMPLATE_CATEGORIES[t.id] === activeCategory);
  }, [templates, activeCategory]);

  const handleSelectTemplate = (template: PageTemplate) => {
    if (!canAccessTemplate(template, currentPlan)) {
      toast({
        title: 'Upgrade required',
        description: `This template requires a ${getPlanLabel(template.requiredPlan || 'pro')} plan.`,
        variant: 'destructive',
      });
      return;
    }
    onLoadTemplate(template);
    setOpen(false);
    setSelectedId(null);
  };

  const selectedTemplate = templates.find((t) => t.id === selectedId);
  const isSelectedLocked = selectedTemplate && !canAccessTemplate(selectedTemplate, currentPlan);

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSelectedId(null); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 group">
          <LayoutTemplate className="h-4 w-4 transition-transform group-hover:rotate-12" />
          Templates
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden w-[96vw] sm:w-auto gap-0 border-border/50 shadow-2xl">
        {/* Header */}
        <DialogHeader className="px-5 sm:px-8 pt-6 sm:pt-8 pb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary">
              <LayoutTemplate className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                Choose a Template
              </DialogTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {templates.length} professionally crafted templates to kickstart your page
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Category Tabs */}
        <div className="px-5 sm:px-8 pt-4 pb-2">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setActiveCategory(key); setSelectedId(null); }}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200',
                  activeCategory === key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-border mx-5 sm:mx-8" />

        {/* Template Grid */}
        <ScrollArea className="h-[50vh] sm:h-[55vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5 sm:p-8 sm:pt-6">
            {filteredTemplates.map((template) => {
              const isSelected = selectedId === template.id;
              const badge = TEMPLATE_BADGES[template.id];
              const thumbnail = TEMPLATE_THUMBNAILS[template.id];
              const isLocked = !canAccessTemplate(template, currentPlan);
              const requiredPlan = template.requiredPlan;

              return (
                <div
                  key={template.id}
                  onClick={() => setSelectedId(template.id)}
                  onDoubleClick={() => handleSelectTemplate(template)}
                  className={cn(
                    'group relative rounded-xl cursor-pointer transition-all duration-300 overflow-hidden',
                    'border bg-card',
                    isLocked && 'opacity-75',
                    isSelected
                      ? 'border-primary ring-2 ring-primary/25 shadow-glow-primary scale-[1.02]'
                      : 'border-border/60 hover:border-primary/40 hover:shadow-premium-lg hover:-translate-y-1'
                  )}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={`${template.name} preview`}
                        className={cn(
                          'w-full h-full object-cover object-top transition-transform duration-500',
                          'group-hover:scale-110',
                          isLocked && 'blur-[2px]'
                        )}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-secondary">
                        <LayoutTemplate className="h-10 w-10 text-muted-foreground/30" />
                      </div>
                    )}

                    {/* Gradient overlay on hover */}
                    <div className={cn(
                      'absolute inset-0 transition-opacity duration-300',
                      'bg-gradient-to-t from-black/60 via-transparent to-transparent',
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    )} />

                    {/* Quick-use button on hover */}
                    {!isLocked && (
                      <div className={cn(
                        'absolute bottom-3 left-3 right-3 transition-all duration-300',
                        isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                      )}>
                        <Button
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); handleSelectTemplate(template); }}
                          className="w-full backdrop-blur-md bg-primary/90 hover:bg-primary text-primary-foreground text-xs h-8 shadow-lg"
                        >
                          Use Template
                        </Button>
                      </div>
                    )}

                    {/* Lock overlay */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-black/30 backdrop-blur-sm">
                          <Lock className="h-5 w-5 text-white" />
                          <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                            {getPlanLabel(requiredPlan || 'pro')} Plan
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Top-left: Badge (new/popular) */}
                    {badge && !isLocked && (
                      <Badge
                        className={cn(
                          'absolute top-2.5 left-2.5 text-[10px] font-bold shadow-md border-0',
                          badge.variant === 'popular'
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-500 text-white'
                        )}
                      >
                        {badge.variant === 'popular' && <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />}
                        {badge.label}
                      </Badge>
                    )}

                    {/* Top-right: Plan badge */}
                    {requiredPlan && requiredPlan !== 'free' && (
                      <Badge
                        className={cn(
                          'absolute top-2.5 right-2.5 text-[10px] font-semibold shadow-md border-0 gap-1',
                          requiredPlan === 'business'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                            : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
                        )}
                      >
                        <Crown className="h-3 w-3" />
                        {getPlanLabel(requiredPlan)}
                      </Badge>
                    )}

                    {/* Selected indicator */}
                    {isSelected && !isLocked && (
                      <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg ring-2 ring-white/50">
                        <Check className="h-3.5 w-3.5 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3.5 sm:p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm text-foreground leading-tight group-hover:text-primary transition-colors duration-200">
                        {template.name}
                      </h3>
                      <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md font-medium">
                        {template.blocks.filter(b => b.type !== 'spacer').length} blocks
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed mb-2">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {getBlockSummary(template).slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-primary/5 text-primary/70 border border-primary/10"
                        >
                          {tag}
                        </span>
                      ))}
                      {TEMPLATE_CATEGORIES[template.id] && (
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">
                          {CATEGORY_LABELS[TEMPLATE_CATEGORIES[template.id]]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 sm:px-8 py-4 border-t border-border bg-muted/30 backdrop-blur-sm">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {selectedId
              ? isSelectedLocked
                ? (
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    Upgrade to {getPlanLabel(selectedTemplate?.requiredPlan || 'pro')} to use "{selectedTemplate?.name}"
                  </span>
                )
                : (
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium text-foreground">{selectedTemplate?.name}</span> selected
                  </span>
                )
              : 'Click a template to preview, double-click to apply'}
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 sm:flex-none text-xs h-9">
              Cancel
            </Button>
            {isSelectedLocked ? (
              <Button
                onClick={() => { setOpen(false); navigate('/dashboard/billing'); }}
                className="flex-1 sm:flex-none gap-1.5 bg-gradient-to-r from-violet-500 to-amber-500 hover:from-violet-600 hover:to-amber-600 text-white border-0 text-xs h-9 shadow-md"
              >
                <Crown className="h-3.5 w-3.5" />
                Upgrade Plan
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (selectedTemplate) handleSelectTemplate(selectedTemplate);
                }}
                disabled={!selectedId}
                className="flex-1 sm:flex-none text-xs h-9 shadow-sm"
              >
                Apply Template
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
