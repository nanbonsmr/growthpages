import { useRef, useEffect } from 'react';
import { HeadingProps } from '../types';

interface HeadingBlockProps {
  props: HeadingProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Partial<HeadingProps>) => void;
}

export function HeadingBlock({ props, isSelected, isPreview, onUpdate }: HeadingBlockProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  const style = {
    fontSize: `${props.fontSize}px`,
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
