import { DividerProps } from '../types';

interface DividerBlockProps {
  props: DividerProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Partial<DividerProps>) => void;
}

export function DividerBlock({ props }: DividerBlockProps) {
  const style = {
    borderTopStyle: props.style as any,
    borderTopColor: props.color,
    borderTopWidth: `${props.thickness}px`,
    width: `${props.width}%`,
    margin: '0 auto',
  };

  return <hr style={style} className="border-0" />;
}
