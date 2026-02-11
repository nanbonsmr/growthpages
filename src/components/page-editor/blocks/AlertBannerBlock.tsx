import { AlertBannerProps } from '../types';
import { cn } from '@/lib/utils';
import { Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface AlertBannerBlockProps {
  props: AlertBannerProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Record<string, any>) => void;
}

const typeConfig = {
  info: { icon: Info, filled: 'bg-blue-500 text-white', outlined: 'border-blue-500 text-blue-700', subtle: 'bg-blue-50 text-blue-700 border-blue-200' },
  success: { icon: CheckCircle2, filled: 'bg-green-500 text-white', outlined: 'border-green-500 text-green-700', subtle: 'bg-green-50 text-green-700 border-green-200' },
  warning: { icon: AlertTriangle, filled: 'bg-amber-500 text-white', outlined: 'border-amber-500 text-amber-700', subtle: 'bg-amber-50 text-amber-700 border-amber-200' },
  error: { icon: XCircle, filled: 'bg-red-500 text-white', outlined: 'border-red-500 text-red-700', subtle: 'bg-red-50 text-red-700 border-red-200' },
};

export function AlertBannerBlock({ props }: AlertBannerBlockProps) {
  const config = typeConfig[props.type || 'info'];
  const Icon = config.icon;
  const styleClass = props.style === 'filled' ? config.filled : props.style === 'outlined' ? `border-2 ${config.outlined}` : `border ${config.subtle}`;

  return (
    <div className={cn('flex items-center gap-3 px-4 py-3 rounded-lg', styleClass)}>
      {props.icon && <Icon className="h-5 w-5 shrink-0" />}
      <p className="text-sm font-medium flex-1">{props.text}</p>
    </div>
  );
}
