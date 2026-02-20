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
import { LayoutTemplate, ChevronDown, Check, Lock, Crown } from 'lucide-react';
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

const TEMPLATE_BADGES: Record<string, string> = {
  saas_landing: 'Popular',
  webinar: 'New',
  cv_resume: 'Popular',
  fitness_gym: 'New',
  education: 'New',
};

const PLAN_HIERARCHY: Record<string, number> = {
  free: 0,
  pro: 1,
  business: 2,
};

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
  const { currentPlan } = usePlanLimits();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelectTemplate = (template: PageTemplate) => {
    if (!canAccessTemplate(template, currentPlan)) {
      toast({
        title: 'Upgrade required',
        description: `This template requires a ${getPlanLabel(template.requiredPlan || 'pro')} plan. Upgrade to unlock it.`,
        variant: 'destructive',
      });
      return;
    }
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
                    'group relative rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden',
                    isLocked && 'opacity-80',
                    isSelected
                      ? 'border-primary ring-2 ring-primary/20 scale-[1.02]'
                      : 'border-border hover:border-primary/50 hover:shadow-lg'
                  )}
                >
                  {/* Thumbnail Preview */}
                  <div className="relative h-36 sm:h-40 overflow-hidden bg-muted">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={`${template.name} preview`}
                        className={cn(
                          'w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105',
                          isLocked && 'filter blur-[1px]'
                        )}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
                        <LayoutTemplate className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />

                    {/* Lock overlay for premium templates */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-1">
                          <Lock className="h-6 w-6 text-white drop-shadow-md" />
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md">
                            {getPlanLabel(requiredPlan || 'pro')} Only
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Badge */}
                    {badge && !isLocked && (
                      <Badge
                        variant="secondary"
                        className="absolute top-2 right-2 bg-white/90 text-foreground text-[10px] font-semibold shadow-sm"
                      >
                        {badge}
                      </Badge>
                    )}

                    {/* Plan badge for premium */}
                    {requiredPlan && requiredPlan !== 'free' && (
                      <Badge
                        className={cn(
                          'absolute top-2 right-2 text-[10px] font-semibold shadow-sm gap-1',
                          requiredPlan === 'business'
                            ? 'bg-amber-500/90 hover:bg-amber-500/90 text-white'
                            : 'bg-violet-500/90 hover:bg-violet-500/90 text-white'
                        )}
                      >
                        <Crown className="h-3 w-3" />
                        {getPlanLabel(requiredPlan)}
                      </Badge>
                    )}

                    {/* Selected Check */}
                    {isSelected && !isLocked && (
                      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="p-3 sm:p-4 bg-card">
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
              ? (() => {
                  const selected = templates.find((t) => t.id === selectedId);
                  const locked = selected && !canAccessTemplate(selected, currentPlan);
                  return locked
                    ? `🔒 Upgrade to ${getPlanLabel(selected.requiredPlan || 'pro')} to use "${selected.name}"`
                    : `Selected: ${selected?.name}`;
                })()
              : 'Tap to select, then apply'}
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            {selectedId && templates.find((t) => t.id === selectedId) && !canAccessTemplate(templates.find((t) => t.id === selectedId)!, currentPlan) ? (
              <Button
                onClick={() => {
                  setOpen(false);
                  navigate('/dashboard/billing');
                }}
                className="flex-1 sm:flex-none gap-1 bg-gradient-to-r from-violet-500 to-amber-500 hover:from-violet-600 hover:to-amber-600"
              >
                <Crown className="h-4 w-4" />
                Upgrade Plan
              </Button>
            ) : (
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
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
