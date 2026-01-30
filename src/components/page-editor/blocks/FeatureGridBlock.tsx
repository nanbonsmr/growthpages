import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

export interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface FeatureGridProps {
  features: FeatureItem[];
  columns: 2 | 3 | 4;
  style: 'cards' | 'minimal' | 'icons-left';
  iconColor: string;
  showIcons: boolean;
}

interface FeatureGridBlockProps {
  props: FeatureGridProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Partial<FeatureGridProps>) => void;
}

function DynamicIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const IconComponent = (Icons as any)[name] || Icons.Star;
  return <IconComponent className={className} style={style} />;
}

export function FeatureGridBlock({ props, isSelected, isPreview }: FeatureGridBlockProps) {
  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[props.columns];

  return (
    <div className={cn('w-full grid gap-6', gridCols)}>
      {props.features.map((feature) => (
        <div
          key={feature.id}
          className={cn(
            'flex gap-4',
            props.style === 'cards' && 'flex-col items-center text-center p-6 rounded-xl border bg-card',
            props.style === 'minimal' && 'flex-col items-center text-center p-4',
            props.style === 'icons-left' && 'items-start'
          )}
        >
          {props.showIcons && (
            <div
              className={cn(
                'shrink-0 rounded-lg flex items-center justify-center',
                props.style === 'icons-left' ? 'w-10 h-10' : 'w-14 h-14',
                props.style === 'cards' && 'bg-primary/10',
                props.style === 'minimal' && 'bg-muted'
              )}
              style={{ backgroundColor: `${props.iconColor}15` }}
            >
              <DynamicIcon
                name={feature.icon}
                className={cn(
                  props.style === 'icons-left' ? 'w-5 h-5' : 'w-7 h-7'
                )}
                style={{ color: props.iconColor }}
              />
            </div>
          )}
          <div className={props.style === 'icons-left' ? '' : ''}>
            <h4 className="font-semibold mb-1">{feature.title}</h4>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
