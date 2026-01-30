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
  onUpdate?: (props: Partial<PricingProps>) => void;
}

export function PricingBlock({ props, isSelected, isPreview }: PricingBlockProps) {
  const gridCols = props.columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

  return (
    <div className={cn('w-full grid gap-6', gridCols)}>
      {props.tiers.map((tier) => (
        <div
          key={tier.id}
          className={cn(
            'relative rounded-xl p-6 flex flex-col',
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
          
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold">{tier.price}</span>
              {tier.period && (
                <span className="text-muted-foreground">/{tier.period}</span>
              )}
            </div>
            {tier.description && (
              <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
            )}
          </div>

          <ul className="space-y-3 flex-1 mb-6">
            {tier.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <Check 
                  className="w-5 h-5 shrink-0 mt-0.5" 
                  style={{ color: props.highlightColor }}
                />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            className={cn(
              'w-full',
              tier.highlighted && 'text-white'
            )}
            variant={tier.highlighted ? 'default' : 'outline'}
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
