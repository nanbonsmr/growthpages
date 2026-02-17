import { ListProps } from '../types';
import { Check } from 'lucide-react';

interface ListBlockProps {
  props: ListProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Record<string, any>) => void;
}

export function ListBlock({ props, isPreview }: ListBlockProps) {
  const spacingClass = props.spacing === 'tight' ? 'space-y-1' : props.spacing === 'relaxed' ? 'space-y-3' : 'space-y-2';

  return (
    <div className={spacingClass}>
      {(props.items || []).map((item, index) => (
        <div key={index} className="flex items-start gap-2" style={{ fontSize: props.fontSize || 16, color: props.color || '#333' }}>
          {props.style === 'bullet' && <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-current shrink-0" />}
          {props.style === 'numbered' && <span className="font-semibold shrink-0">{index + 1}.</span>}
          {props.style === 'check' && <Check className="h-5 w-5 shrink-0 mt-0.5 text-green-500" />}
          <span>{typeof item === 'string' ? item : (item as any)?.text || ''}</span>
        </div>
      ))}
    </div>
  );
}
