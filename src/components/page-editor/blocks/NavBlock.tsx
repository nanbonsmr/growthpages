import { useState } from 'react';
import { Block } from '../types';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

interface NavBlockProps {
  block: Block;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (updates: Partial<Block>) => void;
}

export function NavBlock({ block, isSelected, isPreview, onUpdate }: NavBlockProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const props = block.props as {
    logoType: 'text' | 'image';
    logoText: string;
    logoImage: string;
    menuItems: Array<{ id: string; label: string; url: string }>;
    ctaButton: { enabled: boolean; text: string; url: string };
    style: 'transparent' | 'solid' | 'glass';
    alignment: 'left' | 'center' | 'spread';
    sticky: boolean;
    backgroundColor: string;
    textColor: string;
  };

  const styleClasses = {
    transparent: 'bg-transparent',
    solid: 'bg-background shadow-sm',
    glass: 'bg-background/80 backdrop-blur-md border-b border-border/50',
  };

  return (
    <nav
      className={cn(
        'w-full px-6 py-4',
        styleClasses[props.style || 'solid'],
        isSelected && !isPreview && 'ring-2 ring-primary ring-offset-2 rounded-lg'
      )}
      style={{
        backgroundColor: props.style === 'solid' ? props.backgroundColor : undefined,
        color: props.textColor,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className={cn(
          'flex items-center',
          props.alignment === 'spread' ? 'justify-between' : 'gap-8',
          props.alignment === 'center' && 'justify-center'
        )}>
          {/* Logo */}
          <div className="flex-shrink-0">
            {props.logoType === 'image' && props.logoImage ? (
              <img 
                src={props.logoImage} 
                alt="Logo" 
                className="h-8 w-auto object-contain"
              />
            ) : (
              <span 
                className="text-xl font-bold"
                contentEditable={!isPreview}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (!isPreview && onUpdate) {
                    onUpdate({ props: { ...props, logoText: e.currentTarget.textContent || '' } });
                  }
                }}
              >
                {props.logoText || 'Your Logo'}
              </span>
            )}
          </div>

          {/* Desktop Menu */}
          <div className={cn(
            'hidden md:flex items-center gap-6',
            props.alignment === 'spread' && 'flex-1 justify-center'
          )}>
            {props.menuItems?.map((item) => (
              <a
                key={item.id}
                href={isPreview ? item.url : undefined}
                className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={(e) => !isPreview && e.preventDefault()}
              >
                <span
                  contentEditable={!isPreview}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isPreview && onUpdate) {
                      const newItems = props.menuItems.map(i => 
                        i.id === item.id ? { ...i, label: e.currentTarget.textContent || '' } : i
                      );
                      onUpdate({ props: { ...props, menuItems: newItems } });
                    }
                  }}
                >
                  {item.label}
                </span>
              </a>
            ))}
          </div>

          {/* CTA Button */}
          {props.ctaButton?.enabled && (
            <div className="hidden md:block">
              <a
                href={isPreview ? props.ctaButton.url : undefined}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                onClick={(e) => !isPreview && e.preventDefault()}
              >
                <span
                  contentEditable={!isPreview}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isPreview && onUpdate) {
                      onUpdate({ 
                        props: { 
                          ...props, 
                          ctaButton: { ...props.ctaButton, text: e.currentTarget.textContent || '' } 
                        } 
                      });
                    }
                  }}
                >
                  {props.ctaButton.text || 'Get Started'}
                </span>
              </a>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border/50 space-y-3">
            {props.menuItems?.map((item) => (
              <a
                key={item.id}
                href={isPreview ? item.url : undefined}
                className="block py-2 text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
                onClick={(e) => !isPreview && e.preventDefault()}
              >
                {item.label}
              </a>
            ))}
            {props.ctaButton?.enabled && (
              <a
                href={isPreview ? props.ctaButton.url : undefined}
                className="block w-full text-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors mt-4"
                onClick={(e) => !isPreview && e.preventDefault()}
              >
                {props.ctaButton.text || 'Get Started'}
              </a>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
