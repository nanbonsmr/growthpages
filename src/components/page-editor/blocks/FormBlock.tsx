import { FormProps } from '../types';
import { Input } from '@/components/ui/input';

interface FormBlockProps {
  props: FormProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Partial<FormProps>) => void;
}

export function FormBlock({ props, isPreview }: FormBlockProps) {
  const isInline = props.layout === 'inline';

  const buttonStyle = {
    backgroundColor: props.buttonColor,
    color: '#ffffff',
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className={isInline ? 'flex gap-2' : 'space-y-3'}>
        {props.showName && (
          <Input
            type="text"
            placeholder={props.namePlaceholder}
            className={isInline ? 'flex-1' : ''}
            disabled={!isPreview}
          />
        )}
        {props.showEmail && (
          <Input
            type="email"
            placeholder={props.emailPlaceholder}
            className={isInline ? 'flex-1' : ''}
            disabled={!isPreview}
          />
        )}
        {props.showPhone && !isInline && (
          <Input
            type="tel"
            placeholder={props.phonePlaceholder}
            disabled={!isPreview}
          />
        )}
        <button
          style={buttonStyle}
          className={`
            px-6 py-2.5 rounded-md font-medium transition-opacity hover:opacity-90
            ${isInline ? '' : 'w-full'}
          `}
          disabled={!isPreview}
        >
          {props.buttonText}
        </button>
      </div>
    </div>
  );
}
