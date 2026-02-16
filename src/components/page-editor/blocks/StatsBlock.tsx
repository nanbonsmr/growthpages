import { StatsProps } from '../types';
import { cn } from '@/lib/utils';

interface StatsBlockProps {
  props: StatsProps;
  isSelected: boolean;
  isPreview?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (props: Record<string, any>) => void;
}

export function StatsBlock({ props, viewMode }: StatsBlockProps) {
  const isMobile = viewMode === 'mobile';
  const cols = props.columns || 4;
  const gridCols = isMobile
    ? 'grid-cols-2'
    : cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4';

  const valueSize = props.valueSize || 36;
  const responsiveValueSize = isMobile ? Math.max(Math.round(valueSize * 0.65), 20) : valueSize;

  return (
    <div className={cn('grid', isMobile ? 'gap-3' : 'gap-6', gridCols)}>
      {(props.stats || []).map((stat) => (
        <div
          key={stat.id}
          className={cn(
            'text-center',
            isMobile ? 'p-2' : 'p-4',
            props.style === 'cards' && 'bg-background rounded-xl shadow-sm border border-border',
            props.style === 'bordered' && 'border-l-2 pl-4 text-left',
          )}
          style={props.style === 'bordered' ? { borderColor: props.valueColor || '#7c3aed' } : {}}
        >
          <div
            className="font-bold leading-none"
            style={{ fontSize: `${responsiveValueSize}px`, color: props.valueColor || '#7c3aed' }}
          >
            {stat.prefix}{stat.value}{stat.suffix}
          </div>
          <div className={cn('mt-2 text-muted-foreground font-medium', isMobile ? 'text-xs' : 'text-sm')}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
