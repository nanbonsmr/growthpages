import { SocialProps } from '../types';
import { Twitter, Facebook, Instagram, Linkedin, Youtube, Github, Globe } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
  dribbble: Globe, // fallback for dribbble
};

interface SocialBlockProps {
  props: SocialProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Partial<SocialProps>) => void;
}

export function SocialBlock({ props }: SocialBlockProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const enabledPlatforms = props.platforms.filter((p) => p.enabled);

  return (
    <div
      className="flex gap-4"
      style={{
        justifyContent: props.alignment === 'left' ? 'flex-start' : props.alignment === 'right' ? 'flex-end' : 'center',
      }}
    >
      {enabledPlatforms.map((platform) => {
        const Icon = iconMap[platform.name] || Globe;
        if (!Icon) return null;
        return (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
            style={{ color: props.color }}
            onClick={(e) => e.preventDefault()}
          >
            <Icon className={sizeClasses[props.size]} />
          </a>
        );
      })}
    </div>
  );
}
