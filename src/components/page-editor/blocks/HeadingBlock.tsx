import { useRef, useEffect } from 'react';
import { HeadingProps } from '../types';

interface HeadingBlockProps {
  props: HeadingProps;
  isSelected: boolean;
  isPreview?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onUpdate?: (props: Partial<HeadingProps>) => void;
}

export function HeadingBlock({ props, isSelected, isPreview, viewMode, onUpdate }: HeadingBlockProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  const isMobile = viewMode === 'mobile';
  const isTablet = viewMode === 'tablet';
  const fontSize = props.fontSize || 36;
  const responsiveFontSize = isMobile ? Math.max(Math.round(fontSize * 0.6), 16) : isTablet ? Math.max(Math.round(fontSize * 0.8), 18) : fontSize;

  const style = {
    fontSize: `${responsiveFontSize}px`,
    fontWeight: props.fontWeight === 'normal' ? 400 : props.fontWeight === 'medium' ? 500 : props.fontWeight === 'semibold' ? 600 : 700,
    textAlign: props.alignment as any,
    color: props.color,
  };

  const handleBlur = () => {
    if (ref.current && onUpdate) {
      onUpdate({ text: ref.current.innerText });
    }
  };

  const Tag = props.level;

  return (
    <Tag
      ref={ref}
      contentEditable={!isPreview}
      suppressContentEditableWarning
      onBlur={handleBlur}
      style={style}
      className="outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 min-h-[1em]"
    >
      {props.text}
    </Tag>
  );
}
