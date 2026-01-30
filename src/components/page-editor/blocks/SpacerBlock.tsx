import { SpacerProps } from '../types';

interface SpacerBlockProps {
  props: SpacerProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Partial<SpacerProps>) => void;
}

export function SpacerBlock({ props, isSelected }: SpacerBlockProps) {
  return (
    <div
      style={{ height: `${props.height}px` }}
      className={isSelected ? 'bg-primary/5 border border-dashed border-primary/20' : ''}
    />
  );
}
