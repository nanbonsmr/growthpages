import { LogoCloudProps } from '../types';
import { cn } from '@/lib/utils';
import { Building2 } from 'lucide-react';

interface LogoCloudBlockProps {
  props: LogoCloudProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Record<string, any>) => void;
}

export function LogoCloudBlock({ props }: LogoCloudBlockProps) {
  const cols = props.columns || 6;
  const gridCols =
    cols === 3 ? 'grid-cols-3' :
    cols === 4 ? 'grid-cols-2 sm:grid-cols-4' :
    cols === 5 ? 'grid-cols-3 sm:grid-cols-5' :
    'grid-cols-3 sm:grid-cols-6';

  return (
    <div className="space-y-4">
      {props.showTitle && props.title && (
        <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {props.title}
        </p>
      )}
      <div className={cn('grid gap-6 items-center justify-items-center', gridCols)}>
        {(props.logos || []).map((logo) => (
          <div
            key={logo.id}
            className={cn(
              'flex items-center justify-center h-12 w-full',
              props.grayscale && 'opacity-50 hover:opacity-100 transition-opacity'
            )}
          >
            {logo.imageUrl ? (
              <img
                src={logo.imageUrl}
                alt={logo.name}
                className={cn('max-h-10 max-w-full object-contain', props.grayscale && 'grayscale hover:grayscale-0 transition-all')}
              />
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-5 w-5" />
                <span className="text-xs font-medium">{logo.name}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
