import { ImageProps } from '../types';
import { Image as ImageIcon } from 'lucide-react';

interface ImageBlockProps {
  props: ImageProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Partial<ImageProps>) => void;
}

export function ImageBlock({ props, isSelected, isPreview, onUpdate }: ImageBlockProps) {
  const containerStyle = {
    display: 'flex',
    justifyContent: props.alignment === 'left' ? 'flex-start' : props.alignment === 'right' ? 'flex-end' : 'center',
  };

  const imageStyle = {
    width: `${props.width}px`,
    height: `${props.height}px`,
    borderRadius: `${props.borderRadius}px`,
    objectFit: 'cover' as const,
  };

  if (!props.src) {
    return (
      <div style={containerStyle}>
        <div
          style={imageStyle}
          className="bg-muted flex items-center justify-center border-2 border-dashed border-border"
        >
          <div className="text-center text-muted-foreground">
            <ImageIcon className="h-8 w-8 mx-auto mb-2" />
            <span className="text-xs">Add image URL in settings</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <img
        src={props.src}
        alt={props.alt}
        style={imageStyle}
        className="object-cover"
      />
    </div>
  );
}
