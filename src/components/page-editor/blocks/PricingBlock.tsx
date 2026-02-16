import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonUrl: string;
  highlighted: boolean;
}

export interface PricingProps {
  tiers: PricingTier[];
  columns: 2 | 3;
  style: 'cards' | 'minimal' | 'gradient';
  highlightColor: string;
}

interface PricingBlockProps {
  props: PricingProps;
  isSelected: boolean;
  isPreview?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (props: Partial<PricingProps>) => void;
}

export function PricingBlock({ props, isSelected, isPreview, viewMode }: PricingBlockProps) {
  const isMobile = viewMode === 'mobile';
  const gridCols = isMobile
    ? 'grid-cols-1'
    : props.columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={cn('w-full grid grid-cols-1 gap-4', isMobile ? 'gap-3' : 'sm:gap-6', gridCols)}>
      {props.tiers.map((tier) => (
        <div
          key={tier.id}
          className={cn(
            'relative rounded-xl flex flex-col',
            isMobile ? 'p-4' : 'p-6',
            props.style === 'cards' && 'border bg-card shadow-sm',
            props.style === 'minimal' && 'border-2',
            props.style === 'gradient' && 'bg-gradient-to-br from-background to-muted border',
            tier.highlighted && props.style === 'cards' && 'border-2 shadow-lg',
            tier.highlighted && props.style === 'minimal' && 'border-primary',
            tier.highlighted && props.style === 'gradient' && 'ring-2 ring-primary'
          )}
          style={tier.highlighted ? { borderColor: props.highlightColor } : undefined}
        >
          {tier.highlighted && (
            <div 
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold rounded-full text-white"
              style={{ backgroundColor: props.highlightColor }}
            >
              Popular
            </div>
          )}
          
          <div className={cn('text-center', isMobile ? 'mb-4' : 'mb-6')}>
            <h3 className={cn('font-semibold mb-2', isMobile ? 'text-base' : 'text-lg')}>{tier.name}</h3>
            <div className="flex items-baseline justify-center gap-1">
              <span className={cn('font-bold', isMobile ? 'text-2xl' : 'text-3xl sm:text-4xl')}>{tier.price}</span>
              {tier.period && (
                <span className="text-muted-foreground text-sm">/{tier.period}</span>
              )}
            </div>
            {tier.description && (
              <p className={cn('text-muted-foreground mt-2', isMobile ? 'text-xs' : 'text-sm')}>{tier.description}</p>
            )}
          </div>

          <ul className={cn('flex-1', isMobile ? 'space-y-2 mb-4' : 'space-y-3 mb-6')}>
            {tier.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check 
                  className={cn('shrink-0 mt-0.5', isMobile ? 'w-4 h-4' : 'w-5 h-5')}
                  style={{ color: props.highlightColor }}
                />
                <span className={cn(isMobile ? 'text-xs' : 'text-sm')}>{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            className={cn(
              'w-full',
              tier.highlighted && 'text-white'
            )}
            variant={tier.highlighted ? 'default' : 'outline'}
            size={isMobile ? 'sm' : 'default'}
            style={tier.highlighted ? { backgroundColor: props.highlightColor } : undefined}
            onClick={(e) => {
              if (isPreview || !tier.buttonUrl) {
                e.preventDefault();
              } else {
                window.open(tier.buttonUrl, '_blank');
              }
            }}
          >
            {tier.buttonText}
          </Button>
        </div>
      ))}
    </div>
  );
}
