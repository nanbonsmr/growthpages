import { StatsProps } from '../types';
import { cn } from '@/lib/utils';

interface StatsBlockProps {
  props: StatsProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Record<string, any>) => void;
}

export function StatsBlock({ props }: StatsBlockProps) {
  const cols = props.columns || 4;
  const gridCols = cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4';

  return (
    <div className={cn('grid gap-6', gridCols)}>
      {(props.stats || []).map((stat) => (
        <div
          key={stat.id}
          className={cn(
            'text-center p-4',
            props.style === 'cards' && 'bg-background rounded-xl shadow-sm border border-border',
            props.style === 'bordered' && 'border-l-2 pl-4 text-left',
          )}
          style={props.style === 'bordered' ? { borderColor: props.valueColor || '#7c3aed' } : {}}
        >
          <div
            className="font-bold leading-none"
            style={{ fontSize: props.valueSize || 36, color: props.valueColor || '#7c3aed' }}
          >
            {stat.prefix}{stat.value}{stat.suffix}
          </div>
          <div className="mt-2 text-sm text-muted-foreground font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
