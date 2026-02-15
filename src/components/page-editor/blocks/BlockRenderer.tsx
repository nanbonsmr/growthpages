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
import { VideoBlock } from './VideoBlock';
import { AccordionBlock } from './AccordionBlock';
import { PricingBlock } from './PricingBlock';
import { FeatureGridBlock } from './FeatureGridBlock';
import { HeroBlock } from './HeroBlock';
import { NavBlock } from './NavBlock';
import { FooterBlock } from './FooterBlock';
import { ContactFormBlock } from './ContactFormBlock';
import { ListBlock } from './ListBlock';
import { BlockquoteBlock } from './BlockquoteBlock';
import { MapBlock } from './MapBlock';
import { StatsBlock } from './StatsBlock';
import { LogoCloudBlock } from './LogoCloudBlock';
import { AlertBannerBlock } from './AlertBannerBlock';
import { HtmlEmbedBlock } from './HtmlEmbedBlock';

interface BlockRendererProps {
  block: Block;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Record<string, any>) => void;
  pageId?: string;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
}

export function BlockRenderer({ block, isSelected, isPreview = false, onUpdate, pageId, viewMode }: BlockRendererProps) {
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
    case 'video':
      return <VideoBlock props={block.props as any} {...commonProps} />;
    case 'accordion':
      return <AccordionBlock props={block.props as any} {...commonProps} />;
    case 'pricing':
      return <PricingBlock props={block.props as any} {...commonProps} />;
    case 'feature-grid':
      return <FeatureGridBlock props={block.props as any} {...commonProps} />;
    case 'hero':
      return <HeroBlock block={block} isSelected={isSelected} isPreview={isPreview} onUpdate={(updates) => onUpdate?.(updates.props || {})} />;
    case 'nav':
      return <NavBlock block={block} isSelected={isSelected} isPreview={isPreview} viewMode={viewMode} onUpdate={(updates) => onUpdate?.(updates.props || {})} />;
    case 'footer':
      return <FooterBlock props={block.props as any} {...commonProps} />;
    case 'contact-form':
      return <ContactFormBlock props={block.props as any} {...commonProps} pageId={pageId} />;
    case 'list':
      return <ListBlock props={block.props as any} {...commonProps} />;
    case 'blockquote':
      return <BlockquoteBlock props={block.props as any} {...commonProps} />;
    case 'map':
      return <MapBlock props={block.props as any} {...commonProps} />;
    case 'stats':
      return <StatsBlock props={block.props as any} {...commonProps} />;
    case 'logo-cloud':
      return <LogoCloudBlock props={block.props as any} {...commonProps} />;
    case 'alert-banner':
      return <AlertBannerBlock props={block.props as any} {...commonProps} />;
    case 'html-embed':
      return <HtmlEmbedBlock props={block.props as any} {...commonProps} />;
    default:
      return (
        <div className="p-4 bg-muted rounded text-muted-foreground text-sm">
          Unknown block type: {block.type}
        </div>
      );
  }
}
