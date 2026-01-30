import { Block } from '../types';
import { HeadingBlock } from './HeadingBlock';
import { TextBlock } from './TextBlock';
import { ImageBlock } from './ImageBlock';
import { ButtonBlock } from './ButtonBlock';
import { DividerBlock } from './DividerBlock';
import { SpacerBlock } from './SpacerBlock';
import { FormBlock } from './FormBlock';
import { SocialBlock } from './SocialBlock';
import { TestimonialBlock } from './TestimonialBlock';
import { CountdownBlock } from './CountdownBlock';

interface BlockRendererProps {
  block: Block;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Record<string, any>) => void;
}

export function BlockRenderer({ block, isSelected, isPreview = false, onUpdate }: BlockRendererProps) {
  const commonProps = {
    isSelected,
    isPreview,
    onUpdate,
  };

  switch (block.type) {
    case 'heading':
      return <HeadingBlock props={block.props as any} {...commonProps} />;
    case 'text':
      return <TextBlock props={block.props as any} {...commonProps} />;
    case 'image':
      return <ImageBlock props={block.props as any} {...commonProps} />;
    case 'button':
      return <ButtonBlock props={block.props as any} {...commonProps} />;
    case 'divider':
      return <DividerBlock props={block.props as any} {...commonProps} />;
    case 'spacer':
      return <SpacerBlock props={block.props as any} {...commonProps} />;
    case 'form':
      return <FormBlock props={block.props as any} {...commonProps} />;
    case 'social':
      return <SocialBlock props={block.props as any} {...commonProps} />;
    case 'testimonial':
      return <TestimonialBlock props={block.props as any} {...commonProps} />;
    case 'countdown':
      return <CountdownBlock props={block.props as any} {...commonProps} />;
    default:
      return (
        <div className="p-4 bg-muted rounded text-muted-foreground text-sm">
          Unknown block type: {block.type}
        </div>
      );
  }
}
