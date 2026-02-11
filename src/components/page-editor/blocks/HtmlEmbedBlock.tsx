import { HtmlEmbedProps } from '../types';
import { Code } from 'lucide-react';

interface HtmlEmbedBlockProps {
  props: HtmlEmbedProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Record<string, any>) => void;
}

export function HtmlEmbedBlock({ props, isPreview }: HtmlEmbedBlockProps) {
  if (!isPreview) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-muted/50 border border-dashed border-border rounded-lg"
        style={{ minHeight: props.height || 200 }}
      >
        <Code className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm font-medium text-muted-foreground">HTML Embed</p>
        <p className="text-xs text-muted-foreground mt-1">Rendered on published page</p>
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-hidden rounded-lg"
      style={{ minHeight: props.height || 200 }}
      dangerouslySetInnerHTML={{ __html: props.code || '' }}
    />
  );
}
