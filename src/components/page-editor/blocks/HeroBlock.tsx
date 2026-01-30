import { Block } from '../types';
import { cn } from '@/lib/utils';

interface HeroBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (updates: Partial<Block>) => void;
}

export function HeroBlock({ block, isSelected, isPreview, onUpdate }: HeroBlockProps) {
  const props = block.props as {
    headline: string;
    subheadline: string;
    buttonText: string;
    buttonLink: string;
    backgroundImage: string;
    backgroundOverlay: number;
    height: 'small' | 'medium' | 'large' | 'full';
    alignment: 'left' | 'center' | 'right';
    textColor: 'light' | 'dark';
  };

  const heightClasses = {
    small: 'min-h-[300px]',
    medium: 'min-h-[450px]',
    large: 'min-h-[600px]',
    full: 'min-h-screen',
  };

  const alignmentClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  const handleTextEdit = (field: 'headline' | 'subheadline' | 'buttonText', value: string) => {
    if (!isPreview && onUpdate) {
      onUpdate({
        props: { ...props, [field]: value },
      });
    }
  };

  return (
    <div
      className={cn(
        'relative w-full flex flex-col justify-center px-8 py-16 overflow-hidden rounded-lg',
        heightClasses[props.height || 'medium'],
        alignmentClasses[props.alignment || 'center'],
        isSelected && !isPreview && 'ring-2 ring-primary ring-offset-2'
      )}
      style={{
        backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background overlay */}
      {props.backgroundImage && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: (props.backgroundOverlay || 50) / 100 }}
        />
      )}

      {/* Fallback gradient background when no image */}
      {!props.backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/60" />
      )}

      {/* Content */}
      <div className={cn(
        'relative z-10 max-w-3xl mx-auto flex flex-col gap-6',
        alignmentClasses[props.alignment || 'center']
      )}>
        {/* Headline */}
        <h1
          contentEditable={!isPreview}
          suppressContentEditableWarning
          onBlur={(e) => handleTextEdit('headline', e.currentTarget.textContent || '')}
          className={cn(
            'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight outline-none',
            props.textColor === 'dark' ? 'text-foreground' : 'text-white',
            !isPreview && 'hover:ring-1 hover:ring-white/30 rounded px-1'
          )}
        >
          {props.headline || 'Your Powerful Headline'}
        </h1>

        {/* Subheadline */}
        <p
          contentEditable={!isPreview}
          suppressContentEditableWarning
          onBlur={(e) => handleTextEdit('subheadline', e.currentTarget.textContent || '')}
          className={cn(
            'text-lg md:text-xl lg:text-2xl max-w-2xl outline-none',
            props.textColor === 'dark' ? 'text-muted-foreground' : 'text-white/80',
            !isPreview && 'hover:ring-1 hover:ring-white/30 rounded px-1'
          )}
        >
          {props.subheadline || 'Add a compelling subheadline that supports your main message and encourages action.'}
        </p>

        {/* CTA Button */}
        <button
          className={cn(
            'mt-4 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg',
            props.textColor === 'dark'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-white text-primary hover:bg-white/90'
          )}
        >
          <span
            contentEditable={!isPreview}
            suppressContentEditableWarning
            onBlur={(e) => handleTextEdit('buttonText', e.currentTarget.textContent || '')}
            className="outline-none"
          >
            {props.buttonText || 'Get Started'}
          </span>
        </button>
      </div>
    </div>
  );
}
