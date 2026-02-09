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

  const handleNavigation = (url: string, e: React.MouseEvent) => {
    if (!isPreview) {
      e.preventDefault();
      return;
    }
    
    // Close mobile menu when navigating
    setMobileMenuOpen(false);
    
    // Handle different URL types
    if (url.startsWith('#')) {
      // Anchor link - scroll to element
      e.preventDefault();
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (url.startsWith('http') || url.startsWith('https')) {
      // External link - open in new tab
      e.preventDefault();
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    // For relative links, let the default behavior happen
  };

  return (
    <nav
      className={cn(
        'w-full px-4 sm:px-6 py-4',
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
                className="text-lg sm:text-xl font-bold"
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
                href={item.url || '#'}
                className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={(e) => handleNavigation(item.url, e)}
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

          {/* CTA Button - Desktop */}
          {props.ctaButton?.enabled && (
            <div className="hidden md:block">
              <a
                href={props.ctaButton.url || '#'}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                onClick={(e) => handleNavigation(props.ctaButton.url, e)}
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

          {/* Mobile Menu Button - Hamburger */}
          <button
            className={cn(
              'md:hidden p-2 rounded-lg transition-all duration-200',
              'hover:bg-muted/50 active:scale-95',
              mobileMenuOpen && 'bg-muted/30'
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <div className="relative w-5 h-5">
              <Menu 
                className={cn(
                  'h-5 w-5 absolute inset-0 transition-all duration-300',
                  mobileMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                )} 
              />
              <X 
                className={cn(
                  'h-5 w-5 absolute inset-0 transition-all duration-300',
                  mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                )} 
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu - Animated Slide Down */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            mobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
          )}
        >
          <div className="pt-4 border-t border-border/50 space-y-1">
            {props.menuItems?.map((item, index) => (
              <a
                key={item.id}
                href={item.url || '#'}
                className={cn(
                  'block py-3 px-3 rounded-lg text-sm font-medium',
                  'opacity-80 hover:opacity-100 hover:bg-muted/50',
                  'transition-all duration-200',
                  'transform',
                  mobileMenuOpen 
                    ? 'translate-x-0 opacity-100' 
                    : '-translate-x-4 opacity-0'
                )}
                style={{
                  transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms'
                }}
                onClick={(e) => handleNavigation(item.url, e)}
              >
                {item.label}
              </a>
            ))}
            
            {/* CTA Button - Mobile */}
            {props.ctaButton?.enabled && (
              <a
                href={props.ctaButton.url || '#'}
                className={cn(
                  'block w-full text-center px-4 py-3 mt-3 rounded-lg',
                  'bg-primary text-primary-foreground text-sm font-medium',
                  'hover:bg-primary/90 active:scale-[0.98]',
                  'transition-all duration-200',
                  mobileMenuOpen 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-2 opacity-0'
                )}
                style={{
                  transitionDelay: mobileMenuOpen ? `${(props.menuItems?.length || 0) * 50 + 50}ms` : '0ms'
                }}
                onClick={(e) => handleNavigation(props.ctaButton.url, e)}
              >
                {props.ctaButton.text || 'Get Started'}
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
