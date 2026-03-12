import { BlockquoteProps } from '../types';

interface BlockquoteBlockProps {
  props: BlockquoteProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Record<string, any>) => void;
}

export function BlockquoteBlock({ props }: BlockquoteBlockProps) {
  const accentColor = props.accentColor || '#7c3aed';

  if (props.style === 'highlighted') {
    return (
      <div className="rounded-lg p-6" style={{ backgroundColor: `${accentColor}10` }}>
        <p className="italic leading-relaxed" style={{ fontSize: props.fontSize || 20, color: props.color || 'inherit' }}>
          "{props.text}"
        </p>
        {props.author && (
          <p className="mt-3 text-sm font-medium opacity-70" style={{ color: props.color || 'inherit' }}>— {props.author}</p>
        )}
      </div>
    );
  }

  return (
    <blockquote
      className="py-2"
      style={{
        borderLeft: props.style === 'bordered' ? `4px solid ${accentColor}` : 'none',
        paddingLeft: props.style === 'bordered' ? '1.5rem' : '0',
      }}
    >
      <p className="italic leading-relaxed" style={{ fontSize: props.fontSize || 20, color: props.color || 'inherit' }}>
        "{props.text}"
      </p>
      {props.author && (
        <p className="mt-3 text-sm font-medium opacity-70" style={{ color: props.color || 'inherit' }}>— {props.author}</p>
      )}
    </blockquote>
  );
}
