import { ButtonProps } from '../types';

interface ButtonBlockProps {
  props: ButtonProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Partial<ButtonProps>) => void;
}

export function ButtonBlock({ props, isSelected, isPreview, onUpdate }: ButtonBlockProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const style = {
    backgroundColor: props.backgroundColor,
    color: props.textColor,
    borderRadius: `${props.borderRadius}px`,
  };

  return (
    <div className={props.fullWidth ? 'w-full' : 'flex justify-center'}>
      <button
        style={style}
        className={`
          ${sizeClasses[props.size]}
          ${props.fullWidth ? 'w-full' : ''}
          font-medium transition-opacity hover:opacity-90
        `}
        onClick={(e) => {
          if (!isPreview) {
            e.preventDefault();
          }
        }}
      >
        {props.text}
      </button>
    </div>
  );
}
