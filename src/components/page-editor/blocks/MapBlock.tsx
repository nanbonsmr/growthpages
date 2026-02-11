import { MapProps } from '../types';
import { MapPin } from 'lucide-react';

interface MapBlockProps {
  props: MapProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Record<string, any>) => void;
}

export function MapBlock({ props, isPreview }: MapBlockProps) {
  const address = encodeURIComponent(props.address || 'New York, NY');
  const embedUrl = `https://www.google.com/maps?q=${address}&z=${props.zoom || 12}&output=embed`;

  if (!isPreview) {
    // Show placeholder in editor to avoid iframe issues
    return (
      <div
        className="flex flex-col items-center justify-center bg-muted/50 border border-dashed border-border"
        style={{ height: props.height || 300, borderRadius: props.borderRadius || 12 }}
      >
        <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm font-medium text-muted-foreground">Map: {props.address}</p>
        <p className="text-xs text-muted-foreground mt-1">Visible on published page</p>
      </div>
    );
  }

  return (
    <iframe
      src={embedUrl}
      className="w-full border-0"
      style={{ height: props.height || 300, borderRadius: props.borderRadius || 12 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title={`Map of ${props.address}`}
    />
  );
}
