import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

export interface VideoProps {
  url: string;
  aspectRatio: '16:9' | '4:3' | '1:1';
  autoplay: boolean;
  controls: boolean;
  alignment: 'left' | 'center' | 'right';
}

interface VideoBlockProps {
  props: VideoProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Partial<VideoProps>) => void;
}

function getEmbedUrl(url: string): string | null {
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  // Loom
  const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
  if (loomMatch) {
    return `https://www.loom.com/embed/${loomMatch[1]}`;
  }
  
  return null;
}

function getAspectRatioClass(ratio: string): string {
  switch (ratio) {
    case '16:9': return 'aspect-video';
    case '4:3': return 'aspect-[4/3]';
    case '1:1': return 'aspect-square';
    default: return 'aspect-video';
  }
}

export function VideoBlock({ props, isSelected, isPreview }: VideoBlockProps) {
  const embedUrl = getEmbedUrl(props.url);
  const aspectClass = getAspectRatioClass(props.aspectRatio);
  
  const justifyClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[props.alignment];

  return (
    <div className={cn('flex w-full', justifyClass)}>
      <div className={cn('w-full max-w-2xl', aspectClass)}>
        {embedUrl ? (
          <iframe
            src={`${embedUrl}${props.autoplay ? '?autoplay=1&mute=1' : ''}${props.controls ? '' : '&controls=0'}`}
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full bg-muted rounded-lg flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Play className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              {props.url ? 'Invalid video URL' : 'Paste a YouTube, Vimeo, or Loom URL'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
