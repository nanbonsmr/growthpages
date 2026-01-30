import { cn } from '@/lib/utils';
import { Twitter, Facebook, Instagram, Linkedin, Youtube, Github } from 'lucide-react';

interface FooterLink {
  id: string;
  label: string;
  url: string;
}

interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

interface FooterSocial {
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'github';
  url: string;
  enabled: boolean;
}

export interface FooterProps {
  logoType: 'text' | 'image';
  logoText: string;
  logoImage: string;
  tagline: string;
  columns: FooterColumn[];
  socials: FooterSocial[];
  copyrightText: string;
  style: 'simple' | 'columns' | 'centered';
  backgroundColor: string;
  textColor: string;
  showSocials: boolean;
}

interface FooterBlockProps {
  props: FooterProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Partial<FooterProps>) => void;
}

const socialIcons = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
};

export function FooterBlock({ props, isSelected, isPreview, onUpdate }: FooterBlockProps) {
  const currentYear = new Date().getFullYear();
  const copyrightText = props.copyrightText?.replace('{year}', String(currentYear)) || `© ${currentYear} Your Company`;

  const handleTextEdit = (field: keyof FooterProps, value: string) => {
    if (!isPreview && onUpdate) {
      onUpdate({ [field]: value });
    }
  };

  const enabledSocials = props.socials?.filter(s => s.enabled) || [];

  return (
    <footer
      className={cn(
        'w-full py-12 px-8 rounded-lg',
        isSelected && !isPreview && 'ring-2 ring-primary ring-offset-2'
      )}
      style={{
        backgroundColor: props.backgroundColor || '#1a1a2e',
        color: props.textColor || '#ffffff',
      }}
    >
      {props.style === 'simple' && (
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Tagline */}
            <div className="flex flex-col items-center md:items-start gap-2">
              {props.logoType === 'image' && props.logoImage ? (
                <img src={props.logoImage} alt="Logo" className="h-8 object-contain" />
              ) : (
                <span
                  contentEditable={!isPreview}
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextEdit('logoText', e.currentTarget.textContent || '')}
                  className="text-xl font-bold outline-none"
                >
                  {props.logoText || 'YourBrand'}
                </span>
              )}
              <span
                contentEditable={!isPreview}
                suppressContentEditableWarning
                onBlur={(e) => handleTextEdit('tagline', e.currentTarget.textContent || '')}
                className="text-sm opacity-70 outline-none"
              >
                {props.tagline || 'Building the future, one step at a time.'}
              </span>
            </div>

            {/* Social Icons */}
            {props.showSocials && enabledSocials.length > 0 && (
              <div className="flex items-center gap-4">
                {enabledSocials.map((social) => {
                  const Icon = socialIcons[social.platform];
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            )}

            {/* Copyright */}
            <span
              contentEditable={!isPreview}
              suppressContentEditableWarning
              onBlur={(e) => handleTextEdit('copyrightText', e.currentTarget.textContent || '')}
              className="text-sm opacity-70 outline-none"
            >
              {copyrightText}
            </span>
          </div>
        </div>
      )}

      {props.style === 'columns' && (
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="md:col-span-1">
              {props.logoType === 'image' && props.logoImage ? (
                <img src={props.logoImage} alt="Logo" className="h-8 object-contain mb-4" />
              ) : (
                <span
                  contentEditable={!isPreview}
                  suppressContentEditableWarning
                  onBlur={(e) => handleTextEdit('logoText', e.currentTarget.textContent || '')}
                  className="text-xl font-bold outline-none block mb-4"
                >
                  {props.logoText || 'YourBrand'}
                </span>
              )}
              <p
                contentEditable={!isPreview}
                suppressContentEditableWarning
                onBlur={(e) => handleTextEdit('tagline', e.currentTarget.textContent || '')}
                className="text-sm opacity-70 outline-none mb-4"
              >
                {props.tagline || 'Building the future, one step at a time.'}
              </p>
              {props.showSocials && enabledSocials.length > 0 && (
                <div className="flex items-center gap-3">
                  {enabledSocials.map((social) => {
                    const Icon = socialIcons[social.platform];
                    return (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Link Columns */}
            {props.columns?.map((column) => (
              <div key={column.id}>
                <h4 className="font-semibold mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.url}
                        className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-current/10">
            <span
              contentEditable={!isPreview}
              suppressContentEditableWarning
              onBlur={(e) => handleTextEdit('copyrightText', e.currentTarget.textContent || '')}
              className="text-sm opacity-70 outline-none"
            >
              {copyrightText}
            </span>
          </div>
        </div>
      )}

      {props.style === 'centered' && (
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-6">
            {props.logoType === 'image' && props.logoImage ? (
              <img src={props.logoImage} alt="Logo" className="h-10 object-contain mx-auto" />
            ) : (
              <span
                contentEditable={!isPreview}
                suppressContentEditableWarning
                onBlur={(e) => handleTextEdit('logoText', e.currentTarget.textContent || '')}
                className="text-2xl font-bold outline-none"
              >
                {props.logoText || 'YourBrand'}
              </span>
            )}
          </div>

          {/* Tagline */}
          <p
            contentEditable={!isPreview}
            suppressContentEditableWarning
            onBlur={(e) => handleTextEdit('tagline', e.currentTarget.textContent || '')}
            className="text-sm opacity-70 outline-none mb-6 max-w-md mx-auto"
          >
            {props.tagline || 'Building the future, one step at a time.'}
          </p>

          {/* Quick Links */}
          {props.columns?.[0]?.links && (
            <div className="flex flex-wrap justify-center gap-6 mb-6">
              {props.columns[0].links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Social Icons */}
          {props.showSocials && enabledSocials.length > 0 && (
            <div className="flex justify-center gap-4 mb-6">
              {enabledSocials.map((social) => {
                const Icon = socialIcons[social.platform];
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity p-2 rounded-full bg-current/10"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          )}

          {/* Copyright */}
          <span
            contentEditable={!isPreview}
            suppressContentEditableWarning
            onBlur={(e) => handleTextEdit('copyrightText', e.currentTarget.textContent || '')}
            className="text-sm opacity-50 outline-none"
          >
            {copyrightText}
          </span>
        </div>
      )}
    </footer>
  );
}
