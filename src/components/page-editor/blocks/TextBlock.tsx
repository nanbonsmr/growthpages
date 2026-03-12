import { useRef } from 'react';
import { TextProps } from '../types';

interface TextBlockProps {
  props: TextProps;
  isSelected: boolean;
  isPreview?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (props: Partial<TextProps>) => void;
}

export function TextBlock({ props, isSelected, isPreview, viewMode, onUpdate }: TextBlockProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  const isMobile = viewMode === 'mobile';
  const fontSize = props.fontSize || 16;
  const responsiveFontSize = isMobile ? Math.max(Math.round(fontSize * 0.85), 13) : fontSize;

  const style: React.CSSProperties = {
    fontSize: `${responsiveFontSize}px`,
    textAlign: props.alignment as any,
    color: props.color || 'inherit',
  };

  const handleBlur = () => {
    if (ref.current && onUpdate) {
      onUpdate({ text: ref.current.innerText });
    }
  };

  return (
    <p
      ref={ref}
      contentEditable={!isPreview}
      suppressContentEditableWarning
      onBlur={handleBlur}
      style={style}
      className="outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 min-h-[1em] leading-relaxed"
    >
      {props.text}
    </p>
  );
}
