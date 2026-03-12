import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Zap, Twitter, Facebook, Instagram, Linkedin, Youtube, Quote } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { z } from 'zod';

interface Block {
  id: string;
  type: string;
  props: Record<string, any>;
}

interface PageSettings {
  backgroundType: string;
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImage: string;
  primaryColor: string;
  fontFamily: string;
  maxWidth: string;
}

interface ThemeSettingsWithBlocks extends PageSettings {
  blocks?: Block[];
}

interface Page {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  template: string;
  button_text: string;
  theme_settings: ThemeSettingsWithBlocks | null;
  logo_url: string | null;
  is_active: boolean;
}

const socialIconMap: Record<string, React.ElementType> = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

export default function PublicSignupPage() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('Thank you for signing up!');

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data) {
        setPage(null);
      } else {
        const pageData: Page = {
          id: data.id,
          title: data.title,
          description: data.description,
          slug: data.slug,
          template: data.template,
          button_text: data.button_text,
          theme_settings: data.theme_settings as unknown as ThemeSettingsWithBlocks | null,
          logo_url: data.logo_url,
          is_active: data.is_active ?? false,
        };
        setPage(pageData);
      }
      setIsLoading(false);
    };

    fetchPage();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!page) return;

    setIsSubmitting(true);

    try {
      const name = formData.name || 'Anonymous';
      const email = formData.email || '';

      if (!email) {
        toast({
          variant: 'destructive',
          title: 'Email required',
          description: 'Please enter a valid email address.',
        });
        setIsSubmitting(false);
        return;
      }

      const metadata: Record<string, string> = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'name' && key !== 'email') {
          metadata[key] = value;
        }
      });

      // Use edge function to handle subscriber limits
      const response = await fetch(
        'https://zbshmgxrcpwqvcgdtkch.supabase.co/functions/v1/subscribe',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page_id: page.id,
            name,
            email,
            metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
          }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        if (result.error === 'already_subscribed') {
          toast({
            variant: 'destructive',
            title: 'Already subscribed',
            description: 'This email is already registered.',
          });
        } else if (result.error === 'subscriber_limit_reached') {
          toast({
            variant: 'destructive',
            title: 'Signup unavailable',
            description: result.message || 'This page is not accepting new signups at this time.',
          });
        } else {
          throw new Error(result.message || 'Failed to subscribe');
        }
        return;
      }

      setIsSuccess(true);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to subscribe.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBackgroundStyle = (settings: PageSettings | null) => {
    if (!settings) return { backgroundColor: '#ffffff' };

    switch (settings.backgroundType) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${settings.gradientFrom}, ${settings.gradientTo})`,
        };
      case 'image':
        return settings.backgroundImage
          ? {
              backgroundImage: `url(${settings.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : { backgroundColor: settings.backgroundColor };
      default:
        return { backgroundColor: settings.backgroundColor };
    }
  };

  // Determine if a background color is dark to set appropriate text color
  const getTextColorForBackground = (bgColor: string): string => {
    if (!bgColor || bgColor === 'transparent') return '#1a1a2e';
    const hex = bgColor.replace('#', '');
    if (hex.length !== 6) return '#1a1a2e';
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Relative luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#1a1a2e' : '#f0f0f5';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground">This signup page doesn't exist or is no longer active.</p>
        </div>
      </div>
    );
  }

  const settings = page.theme_settings;
  const blocks = settings?.blocks || [];
  const hasBlocks = blocks.length > 0;

  // Success state
  if (isSuccess) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          ...getBackgroundStyle(settings),
          fontFamily: settings?.fontFamily || 'Inter',
        }}
      >
        <div className="max-w-md w-full text-center animate-fade-in">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: `${settings?.primaryColor || '#7c3aed'}20` }}
          >
            <CheckCircle className="h-10 w-10" style={{ color: settings?.primaryColor || '#7c3aed' }} />
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: settings?.primaryColor || '#7c3aed' }}>
            Thank You!
          </h1>
          <p className="text-muted-foreground mb-8">{successMessage}</p>
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-semibold">GrowthPages</span>
          </p>
        </div>
      </div>
    );
  }

  // Block-based page rendering
  if (hasBlocks) {
    const maxWidthClasses: Record<string, string> = {
      sm: 'max-w-sm',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
    };

    return (
      <div
        className="min-h-screen scroll-smooth"
        style={{
          ...getBackgroundStyle(settings),
          fontFamily: settings?.fontFamily || 'Inter',
          color: getTextColorForBackground(settings?.backgroundColor || '#ffffff'),
        }}
      >
      <div className={`mx-auto px-4 sm:px-6 py-8 ${maxWidthClasses[settings?.maxWidth || 'lg']} scroll-smooth`}>
          {blocks.map((block, index) => (
            <div
              key={block.id}
              id={`section-${block.type}-${index}`}
              className="scroll-mt-20"
              style={{
                ...(block.props._bgColor ? { backgroundColor: block.props._bgColor } : {}),
                ...(block.props._padding !== undefined ? { padding: `${block.props._padding}px` } : {}),
                ...(block.props._borderRadius ? { borderRadius: `${block.props._borderRadius}px` } : {}),
                ...(block.props._opacity !== undefined && block.props._opacity !== 1 ? { opacity: block.props._opacity } : {}),
                ...(block.props._borderStyle && block.props._borderStyle !== 'none' ? {
                  border: `1px ${block.props._borderStyle} ${block.props._borderColor || '#e5e7eb'}`,
                } : {}),
              }}
            >
            <BlockRenderer
              block={block}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              primaryColor={settings?.primaryColor || '#7c3aed'}
              onSuccessMessage={setSuccessMessage}
              pageId={page.id}
            />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            Powered by{' '}
            <a href="/" className="font-semibold hover:underline inline-flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" /> GrowthPages
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Fallback for legacy pages without blocks
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        ...getBackgroundStyle(settings),
        fontFamily: settings?.fontFamily || 'Inter',
      }}
    >
      <div className="max-w-md w-full text-center">
        <h1
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: settings?.primaryColor || '#7c3aed' }}
        >
          {page.title}
        </h1>
        {page.description && <p className="text-lg text-muted-foreground mb-8">{page.description}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white/80 backdrop-blur p-6 rounded-2xl">
          <Input
            type="email"
            placeholder="Enter your email"
            value={formData.email || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            required
            className="h-12"
          />
          <Button
            type="submit"
            className="w-full h-12"
            style={{ backgroundColor: settings?.primaryColor || '#7c3aed' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : page.button_text || 'Subscribe'}
          </Button>
        </form>
      </div>
    </div>
  );
}

// Block renderer for the public page
interface BlockRendererProps {
  block: Block;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  primaryColor: string;
  onSuccessMessage: (msg: string) => void;
  pageId?: string;
}

function BlockRenderer({
  block,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  primaryColor,
  onSuccessMessage,
  pageId,
}: BlockRendererProps) {
  const props = block.props;
  
  // State for countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // State for accordion
  const [openItems, setOpenItems] = useState<string[]>([]);
  
  // State for mobile nav
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // State for scroll-based nav styling
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    if (block.type !== 'nav' || !props.sticky) return;
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [block.type, props.sticky]);

  // Countdown effect
  useEffect(() => {
    if (block.type !== 'countdown' || !props.targetDate) return;
    
    const calculateTimeLeft = () => {
      const difference = new Date(props.targetDate).getTime() - Date.now();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [block.type, props.targetDate]);

  const toggleAccordionItem = (id: string) => {
    if (props.allowMultiple) {
      setOpenItems(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else {
      setOpenItems(prev => prev.includes(id) ? [] : [id]);
    }
  };

  switch (block.type) {
    case 'heading': {
      const Tag = props.level || 'h1';
      const mobileFontSize = Math.max(Math.round((props.fontSize || 36) * 0.65), 18);
      return (
        <Tag
          style={{
            fontSize: `clamp(${mobileFontSize}px, 5vw, ${props.fontSize || 36}px)`,
            fontWeight: props.fontWeight === 'normal' ? 400 : props.fontWeight === 'medium' ? 500 : props.fontWeight === 'semibold' ? 600 : 700,
            textAlign: props.alignment || 'center',
            color: props.color || 'inherit',
          }}
          className="mb-4"
        >
          {props.text}
        </Tag>
      );
    }

    case 'text': {
      const textSize = props.fontSize || 16;
      const mobileTextSize = Math.max(Math.round(textSize * 0.85), 14);
      return (
        <p
          style={{
            fontSize: `clamp(${mobileTextSize}px, 2.5vw, ${textSize}px)`,
            textAlign: props.alignment || 'center',
            color: props.color || 'inherit',
          }}
          className="mb-4 leading-relaxed"
        >
          {props.text}
        </p>
      );
    }

    case 'image':
      if (!props.src) return null;
      return (
        <div
          className="mb-4"
          style={{
            display: 'flex',
            justifyContent: props.alignment === 'left' ? 'flex-start' : props.alignment === 'right' ? 'flex-end' : 'center',
          }}
        >
          <img
            src={props.src}
            alt={props.alt || ''}
            className="max-w-full"
            style={{
              width: `min(${props.width || 200}px, 100%)`,
              height: 'auto',
              aspectRatio: `${props.width || 200} / ${props.height || 200}`,
              borderRadius: `${props.borderRadius || 8}px`,
              objectFit: 'cover',
            }}
          />
        </div>
      );

    case 'button': {
      const sizeClasses: Record<string, string> = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      };
      return (
        <div className={`mb-4 ${props.fullWidth ? 'w-full' : 'flex justify-center'}`}>
          <button
            type={props.action === 'submit' ? 'submit' : 'button'}
            style={{
              backgroundColor: props.backgroundColor || primaryColor,
              color: props.textColor || '#ffffff',
              borderRadius: `${props.borderRadius || 8}px`,
            }}
            className={`${sizeClasses[props.size || 'md']} ${props.fullWidth ? 'w-full' : ''} font-medium transition-opacity hover:opacity-90`}
          >
            {props.text || 'Click me'}
          </button>
        </div>
      );
    }

    case 'divider':
      return (
        <hr
          className="my-4 border-0"
          style={{
            borderTopStyle: props.style || 'solid',
            borderTopColor: props.color || '#e5e7eb',
            borderTopWidth: `${props.thickness || 1}px`,
            width: `${props.width || 100}%`,
            margin: '0 auto',
          }}
        />
      );

    case 'spacer':
      return <div style={{ height: `${props.height || 40}px` }} />;

    case 'form': {
      // Store success message when form is rendered
      if (props.successMessage) {
        onSuccessMessage(props.successMessage);
      }

      const isInline = props.layout === 'inline';
      return (
        <form onSubmit={onSubmit} className="mb-4 w-full max-w-md mx-auto">
          <div className={isInline ? 'flex gap-2' : 'space-y-3'}>
            {props.showName && (
              <Input
                type="text"
                placeholder={props.namePlaceholder || 'Your name'}
                value={formData.name || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className={isInline ? 'flex-1' : ''}
              />
            )}
            {props.showEmail && (
              <Input
                type="email"
                placeholder={props.emailPlaceholder || 'Your email'}
                value={formData.email || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
                className={isInline ? 'flex-1' : ''}
              />
            )}
            {props.showPhone && !isInline && (
              <Input
                type="tel"
                placeholder={props.phonePlaceholder || 'Your phone'}
                value={formData.phone || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              />
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: props.buttonColor || primaryColor,
                color: '#ffffff',
              }}
              className={`px-6 py-2.5 rounded-md font-medium transition-opacity hover:opacity-90 disabled:opacity-50 ${isInline ? '' : 'w-full'}`}
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : props.buttonText || 'Subscribe'}
            </button>
          </div>
        </form>
      );
    }

    case 'social': {
      const sizeClasses: Record<string, string> = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      };
      const enabledPlatforms = props.platforms?.filter((p: any) => p.enabled) || [];
      return (
        <div
          className="flex gap-4 mb-4"
          style={{
            justifyContent: props.alignment === 'left' ? 'flex-start' : props.alignment === 'right' ? 'flex-end' : 'center',
          }}
        >
          {enabledPlatforms.map((platform: any) => {
            const Icon = socialIconMap[platform.name];
            if (!Icon) return null;
            return (
              <a
                key={platform.name}
                href={platform.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                style={{ color: props.color || '#6b7280' }}
              >
                <Icon className={sizeClasses[props.size || 'md']} />
              </a>
            );
          })}
        </div>
      );
    }

    case 'testimonial':
      return (
        <div
          className="p-6 rounded-xl max-w-lg mx-auto mb-4"
          style={{ backgroundColor: props.backgroundColor || '#f9fafb' }}
        >
          <Quote className="h-6 w-6 text-primary/30 mb-3" />
          <p className="text-foreground mb-4 leading-relaxed">{props.quote}</p>
          <div className="flex items-center gap-3">
            {props.avatar ? (
              <img src={props.avatar} alt={props.author} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: primaryColor }}
              >
                {props.author?.charAt(0) || 'A'}
              </div>
            )}
            <div>
              <p className="font-semibold text-foreground text-sm">{props.author}</p>
              <p className="text-muted-foreground text-xs">{props.role}</p>
            </div>
          </div>
        </div>
      );

    case 'countdown': {
      const units = [
        { key: 'days', label: 'Days', show: props.showDays },
        { key: 'hours', label: 'Hours', show: props.showHours },
        { key: 'minutes', label: 'Min', show: props.showMinutes },
        { key: 'seconds', label: 'Sec', show: props.showSeconds },
      ].filter((u) => u.show);

      return (
        <div className="text-center mb-4">
          {props.label && <p className="text-muted-foreground text-sm mb-3">{props.label}</p>}
          <div className="flex justify-center gap-2 sm:gap-3">
            {units.map((unit) => (
              <div key={unit.key} className="flex flex-col items-center">
                <div
                  className="text-xl sm:text-3xl font-bold w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${props.color || primaryColor}20`, color: props.color || primaryColor }}
                >
                  {String(timeLeft[unit.key as keyof typeof timeLeft]).padStart(2, '0')}
                </div>
                <span className="text-[10px] sm:text-xs text-muted-foreground mt-1">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'video': {
      if (!props.url) return null;
      
      // Parse video URL to get embed URL
      const getEmbedUrl = (url: string) => {
        // YouTube
        const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/);
        if (youtubeMatch) {
          return `https://www.youtube.com/embed/${youtubeMatch[1]}${props.autoplay ? '?autoplay=1&mute=1' : ''}`;
        }
        // Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) {
          return `https://player.vimeo.com/video/${vimeoMatch[1]}${props.autoplay ? '?autoplay=1&muted=1' : ''}`;
        }
        return url;
      };

      const aspectRatios: Record<string, string> = {
        '16:9': '56.25%',
        '4:3': '75%',
        '1:1': '100%',
      };

      return (
        <div
          className="mb-4"
          style={{
            display: 'flex',
            justifyContent: props.alignment === 'left' ? 'flex-start' : props.alignment === 'right' ? 'flex-end' : 'center',
          }}
        >
          <div className="relative w-full max-w-2xl" style={{ paddingBottom: aspectRatios[props.aspectRatio || '16:9'] }}>
            <iframe
              src={getEmbedUrl(props.url)}
              className="absolute inset-0 w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      );
    }

    case 'accordion': {
      return (
        <div className="mb-4 space-y-2 max-w-2xl mx-auto">
          {props.items?.map((item: any) => (
            <div
              key={item.id}
              className={`border rounded-lg overflow-hidden ${props.style === 'separated' ? 'mb-3' : ''}`}
            >
              <button
                onClick={() => toggleAccordionItem(item.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium">{item.question}</span>
                <span className={`transform transition-transform ${openItems.includes(item.id) ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openItems.includes(item.id) && (
                <div className="px-4 pb-4 text-muted-foreground">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    case 'pricing': {
      return (
        <div className={`mb-4 grid gap-4 sm:gap-6 grid-cols-1 ${props.columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} max-w-5xl mx-auto`}>
          {props.tiers?.map((tier: any) => (
            <div
              key={tier.id}
              className={`p-5 sm:p-6 rounded-xl border-2 ${tier.highlighted ? 'border-primary shadow-lg sm:scale-105' : 'border-border'}`}
              style={tier.highlighted ? { borderColor: props.highlightColor || primaryColor } : {}}
            >
              <h3 className="text-lg sm:text-xl font-bold mb-2">{tier.name}</h3>
              <div className="mb-4">
                <span className="text-2xl sm:text-3xl font-bold">{tier.price}</span>
                {tier.period && <span className="text-muted-foreground">/{tier.period}</span>}
              </div>
              <p className="text-muted-foreground text-sm mb-4">{tier.description}</p>
              <ul className="space-y-2 mb-6">
                {tier.features?.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <span style={{ color: props.highlightColor || primaryColor }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={tier.buttonUrl || '#'}
                className="block w-full text-center py-2 px-4 rounded-lg font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: tier.highlighted ? (props.highlightColor || primaryColor) : 'transparent',
                  color: tier.highlighted ? '#fff' : (props.highlightColor || primaryColor),
                  border: tier.highlighted ? 'none' : `2px solid ${props.highlightColor || primaryColor}`,
                }}
              >
                {tier.buttonText}
              </a>
            </div>
          ))}
        </div>
      );
    }

    case 'feature-grid': {
      const renderIcon = (iconName: string) => {
        const IconComp = (LucideIcons as any)[iconName] || LucideIcons.Star;
        return <IconComp className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: props.iconColor || primaryColor }} />;
      };

      return (
        <div className={`mb-4 grid gap-3 sm:gap-6 grid-cols-1 ${props.columns === 2 ? 'sm:grid-cols-2' : props.columns === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'} max-w-5xl mx-auto`}>
          {props.features?.map((feature: any) => (
            <div
              key={feature.id}
              className={`flex gap-3 ${
                props.style === 'cards' ? 'flex-col items-center text-center p-4 sm:p-6 border rounded-xl bg-card/50 backdrop-blur-sm' :
                props.style === 'minimal' ? 'flex-col items-center text-center p-3 sm:p-4' :
                'items-start'
              }`}
            >
              {props.showIcons && (
                <div
                  className={`shrink-0 rounded-lg flex items-center justify-center ${
                    props.style === 'icons-left' ? 'w-10 h-10' : 'w-12 h-12 sm:w-14 sm:h-14'
                  }`}
                  style={{ backgroundColor: `${props.iconColor || primaryColor}15` }}
                >
                  {renderIcon(feature.icon)}
                </div>
              )}
              <div>
                <h4 className="font-semibold mb-1 text-sm sm:text-base">{feature.title}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    case 'hero': {
      const heightClasses: Record<string, string> = {
        small: 'min-h-[200px] sm:min-h-[300px]',
        medium: 'min-h-[300px] sm:min-h-[450px]',
        large: 'min-h-[400px] sm:min-h-[600px]',
        full: 'min-h-screen',
      };

      const textColorValue = props.textColor === 'dark' ? '#000' : '#fff';

      return (
        <div
          className={`relative ${heightClasses[props.height || 'medium']} flex items-center justify-center mb-4 rounded-xl overflow-hidden`}
          style={{
            backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Background overlay when image exists */}
          {props.backgroundImage && (
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: (props.backgroundOverlay || 50) / 100 }}
            />
          )}

          {/* Fallback gradient when no image */}
          {!props.backgroundImage && (
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primaryColor}ee, ${primaryColor}99)` }} />
          )}

          <div
            className={`relative z-10 px-4 sm:px-8 py-8 sm:py-16 w-full max-w-3xl mx-auto ${props.alignment === 'left' ? 'text-left' : props.alignment === 'right' ? 'text-right' : 'text-center'}`}
          >
            <h1
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4"
              style={{ color: textColorValue }}
            >
              {props.headline || 'Your Powerful Headline'}
            </h1>
            <p
              className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 max-w-2xl mx-auto"
              style={{ color: textColorValue, opacity: 0.85 }}
            >
              {props.subheadline || 'Add a compelling subheadline that supports your main message.'}
            </p>
            {props.buttonText && (
              <a
                href={props.buttonLink || '#'}
                className="inline-block px-5 sm:px-8 py-2.5 sm:py-4 rounded-lg font-semibold text-sm sm:text-lg shadow-lg transition-all hover:scale-105 hover:opacity-90"
                style={{
                  backgroundColor: props.textColor === 'dark' ? primaryColor : '#fff',
                  color: props.textColor === 'dark' ? '#fff' : primaryColor,
                }}
              >
                {props.buttonText}
              </a>
            )}
          </div>
        </div>
      );
    }

    case 'nav': {
      const navStyleClasses: Record<string, string> = {
        transparent: 'bg-transparent',
        solid: 'shadow-sm',
        glass: 'backdrop-blur-md border-b border-border/50',
      };

      const isSticky = !!props.sticky;
      const navScrolled = isSticky && scrolled;

      return (
        <nav
          className={`w-full px-4 sm:px-6 py-3 sm:py-4 mb-4 rounded-lg transition-all duration-300 ${
            navScrolled
              ? 'backdrop-blur-md shadow-md border-b border-border/30'
              : navStyleClasses[props.style || 'solid']
          } ${isSticky ? 'sticky top-0 z-50' : ''}`}
          style={{
            backgroundColor: navScrolled
              ? (props.backgroundColor ? `${props.backgroundColor}f2` : undefined)
              : (props.backgroundColor || undefined),
            color: props.textColor,
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                {props.logoType === 'image' && props.logoImage ? (
                  <img src={props.logoImage} alt="Logo" className="h-7 sm:h-8 w-auto object-contain" />
                ) : (
                  <span className="text-lg sm:text-xl font-bold">{props.logoText || 'Logo'}</span>
                )}
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-6">
                {props.menuItems?.map((item: any) => {
                  const isAnchor = item.url?.startsWith('#');
                  return (
                    <a
                      key={item.id}
                      href={item.url || '#'}
                      className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
                      onClick={isAnchor ? (e: React.MouseEvent) => {
                        e.preventDefault();
                        const target = document.querySelector(item.url);
                        target?.scrollIntoView({ behavior: 'smooth' });
                      } : undefined}
                    >
                      {item.label}
                    </a>
                  );
                })}
                {props.ctaButton?.enabled && (
                  <a
                    href={props.ctaButton.url || '#'}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
                    style={{ backgroundColor: primaryColor, color: '#fff' }}
                    onClick={props.ctaButton.url?.startsWith('#') ? (e: React.MouseEvent) => {
                      e.preventDefault();
                      const target = document.querySelector(props.ctaButton.url);
                      target?.scrollIntoView({ behavior: 'smooth' });
                    } : undefined}
                  >
                    {props.ctaButton.text || 'Get Started'}
                  </a>
                )}
              </div>

              {/* Mobile Hamburger Button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-muted/50 active:scale-95 transition-all duration-200"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <span className={`absolute w-5 h-0.5 rounded-full transition-all duration-300 ${mobileOpen ? 'rotate-45 bg-current' : '-translate-y-1.5 bg-current'}`} />
                  <span className={`absolute w-5 h-0.5 rounded-full bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-0' : 'opacity-100'}`} />
                  <span className={`absolute w-5 h-0.5 rounded-full transition-all duration-300 ${mobileOpen ? '-rotate-45 bg-current' : 'translate-y-1.5 bg-current'}`} />
                </div>
              </button>
            </div>

            {/* Mobile Menu - Animated */}
            <div
              className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}
            >
              <div className="pt-4 border-t border-border/50 space-y-1">
                {props.menuItems?.map((item: any, index: number) => {
                  const isAnchor = item.url?.startsWith('#');
                  return (
                    <a
                      key={item.id}
                      href={item.url || '#'}
                      className={`block py-3 px-3 rounded-lg text-sm font-medium opacity-80 hover:opacity-100 hover:bg-muted/50 transition-all duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-4'}`}
                      style={{ transitionDelay: mobileOpen ? `${index * 50}ms` : '0ms' }}
                      onClick={(e: React.MouseEvent) => {
                        setMobileOpen(false);
                        if (isAnchor) {
                          e.preventDefault();
                          setTimeout(() => {
                            const target = document.querySelector(item.url);
                            target?.scrollIntoView({ behavior: 'smooth' });
                          }, 300);
                        }
                      }}
                    >
                      {item.label}
                    </a>
                  );
                })}
                {props.ctaButton?.enabled && (
                  <a
                    href={props.ctaButton.url || '#'}
                    className={`block w-full text-center py-3 px-4 rounded-lg text-sm font-medium text-white mt-2 active:scale-[0.98] transition-all duration-200 ${mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                    style={{
                      backgroundColor: primaryColor,
                      transitionDelay: mobileOpen ? `${(props.menuItems?.length || 0) * 50 + 50}ms` : '0ms',
                    }}
                    onClick={(e: React.MouseEvent) => {
                      setMobileOpen(false);
                      if (props.ctaButton.url?.startsWith('#')) {
                        e.preventDefault();
                        setTimeout(() => {
                          const target = document.querySelector(props.ctaButton.url);
                          target?.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                      }
                    }}
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

    case 'footer': {
      const footerSocialIcons: Record<string, string> = {
        twitter: '𝕏',
        facebook: 'f',
        instagram: '📷',
        linkedin: 'in',
        youtube: '▶',
        github: '⌂',
      };

      return (
        <footer
          className="w-full px-4 sm:px-8 py-8 sm:py-12 mt-8 rounded-lg"
          style={{
            backgroundColor: props.backgroundColor || '#111827',
            color: props.textColor || '#9ca3af',
          }}
        >
          <div className="max-w-6xl mx-auto">
            {props.style === 'columns' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
                {/* Logo Column */}
                <div>
                  {props.logoType === 'image' && props.logoImage ? (
                    <img src={props.logoImage} alt="Logo" className="h-8 w-auto mb-3" />
                  ) : (
                    <span className="text-lg font-bold text-white">{props.logoText || 'Logo'}</span>
                  )}
                  {props.tagline && <p className="text-sm mt-2">{props.tagline}</p>}
                </div>
                
                {/* Link Columns */}
                {props.columns?.map((col: any) => (
                  <div key={col.id}>
                    <h4 className="font-semibold text-white mb-3">{col.title}</h4>
                    <ul className="space-y-2">
                      {col.links?.map((link: any) => (
                        <li key={link.id}>
                          <a href={link.url || '#'} className="text-sm hover:text-white transition-colors">
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Simple/Centered Footer */}
            {(props.style === 'simple' || props.style === 'centered') && (
              <div className={`${props.style === 'centered' ? 'text-center' : 'flex flex-col sm:flex-row justify-between items-center gap-3'} mb-4`}>
                <div>
                  {props.logoType === 'image' && props.logoImage ? (
                    <img src={props.logoImage} alt="Logo" className="h-8 w-auto" />
                  ) : (
                    <span className="text-lg font-bold text-white">{props.logoText || 'Logo'}</span>
                  )}
                </div>
              </div>
            )}

            {/* Socials */}
            {props.showSocials && props.socials?.filter((s: any) => s.enabled).length > 0 && (
              <div className={`flex gap-4 ${props.style === 'centered' ? 'justify-center' : ''} mb-4`}>
              {props.socials?.filter((s: any) => s.enabled).map((social: any) => (
                  <a
                    key={social.platform}
                    href={social.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {footerSocialIcons[social.platform] || social.platform[0].toUpperCase()}
                  </a>
                ))}
              </div>
            )}

            {/* Copyright */}
            <div className={`pt-4 border-t border-white/10 text-sm ${props.style === 'centered' ? 'text-center' : ''}`}>
              {props.copyrightText || `© ${new Date().getFullYear()} All rights reserved.`}
            </div>
          </div>
        </footer>
      );
    }

    case 'list': {
      const spacingClass = props.spacing === 'tight' ? 'space-y-1' : props.spacing === 'relaxed' ? 'space-y-3' : 'space-y-2';
      return (
        <div className={`mb-4 ${spacingClass}`}>
          {(props.items || []).map((item: string, i: number) => (
            <div key={i} className="flex items-start gap-2" style={{ fontSize: props.fontSize || 16, color: props.color || 'inherit' }}>
              {props.style === 'bullet' && <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-current shrink-0" />}
              {props.style === 'numbered' && <span className="font-semibold shrink-0">{i + 1}.</span>}
              {props.style === 'check' && <CheckCircle className="h-5 w-5 shrink-0 mt-0.5 text-green-500" />}
              <span>{item}</span>
            </div>
          ))}
        </div>
      );
    }

    case 'blockquote':
      return (
        <blockquote
          className="mb-4 py-2"
          style={{
            borderLeft: props.style === 'bordered' ? `4px solid ${props.accentColor || primaryColor}` : 'none',
            paddingLeft: props.style === 'bordered' ? '1.5rem' : '0',
            backgroundColor: props.style === 'highlighted' ? `${(props.accentColor || primaryColor)}10` : 'transparent',
            borderRadius: props.style === 'highlighted' ? '0.5rem' : '0',
            padding: props.style === 'highlighted' ? '1.5rem' : undefined,
          }}
        >
          <p className="italic leading-relaxed" style={{ fontSize: props.fontSize || 20, color: props.color || 'inherit' }}>
            "{props.text}"
          </p>
          {props.author && (
            <p className="mt-3 text-sm font-medium opacity-70" style={{ color: props.color }}>— {props.author}</p>
          )}
        </blockquote>
      );

    case 'map': {
      const address = encodeURIComponent(props.address || 'New York, NY');
      const embedUrl = `https://www.google.com/maps?q=${address}&z=${props.zoom || 12}&output=embed`;
      return (
        <div className="mb-4">
          <iframe
            src={embedUrl}
            className="w-full border-0"
            style={{ height: props.height || 300, borderRadius: props.borderRadius || 12 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${props.address}`}
          />
        </div>
      );
    }

    case 'stats': {
      const cols = props.columns || 4;
      const gridCols = cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4';
      return (
        <div className={`grid gap-4 sm:gap-6 ${gridCols} mb-4`}>
          {(props.stats || []).map((stat: any) => (
            <div
              key={stat.id}
              className={`text-center p-4 ${
                props.style === 'cards' ? 'bg-card/80 backdrop-blur-sm rounded-xl shadow-sm border' :
                props.style === 'bordered' ? 'border-l-2 pl-4 text-left' : ''
              }`}
              style={props.style === 'bordered' ? { borderColor: props.valueColor || primaryColor } : {}}
            >
              <div className="font-bold leading-none" style={{ fontSize: `clamp(24px, 4vw, ${props.valueSize || 36}px)`, color: props.valueColor || primaryColor }}>
                {stat.prefix}{stat.value}{stat.suffix}
              </div>
              <div className="mt-2 text-sm opacity-70 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      );
    }

    case 'logo-cloud': {
      const cols = props.columns || 6;
      const gridCols =
        cols === 3 ? 'grid-cols-3' :
        cols === 4 ? 'grid-cols-2 sm:grid-cols-4' :
        cols === 5 ? 'grid-cols-3 sm:grid-cols-5' :
        'grid-cols-3 sm:grid-cols-6';
      return (
        <div className="mb-4 space-y-4">
          {props.showTitle && props.title && (
            <p className="text-center text-sm font-medium uppercase tracking-wider opacity-60">{props.title}</p>
          )}
          <div className={`grid gap-6 items-center justify-items-center ${gridCols}`}>
            {(props.logos || []).map((logo: any) => (
              <div key={logo.id} className={`flex items-center justify-center h-12 w-full ${props.grayscale ? 'opacity-50' : ''}`}>
                {logo.imageUrl ? (
                  <img src={logo.imageUrl} alt={logo.name} className={`max-h-10 max-w-full object-contain ${props.grayscale ? 'grayscale' : ''}`} />
                ) : (
                  <span className="text-xs font-medium opacity-50">{logo.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'alert-banner': {
      const typeColors: Record<string, { filled: string; outlined: string; subtle: string }> = {
        info: { filled: 'bg-blue-500 text-white', outlined: 'border-2 border-blue-500 text-blue-700', subtle: 'bg-blue-50 text-blue-700 border border-blue-200' },
        success: { filled: 'bg-green-500 text-white', outlined: 'border-2 border-green-500 text-green-700', subtle: 'bg-green-50 text-green-700 border border-green-200' },
        warning: { filled: 'bg-amber-500 text-white', outlined: 'border-2 border-amber-500 text-amber-700', subtle: 'bg-amber-50 text-amber-700 border border-amber-200' },
        error: { filled: 'bg-red-500 text-white', outlined: 'border-2 border-red-500 text-red-700', subtle: 'bg-red-50 text-red-700 border border-red-200' },
      };
      const colors = typeColors[props.type || 'info'];
      const styleClass = props.style === 'filled' ? colors.filled : props.style === 'outlined' ? colors.outlined : colors.subtle;
      return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-4 ${styleClass}`}>
          <p className="text-sm font-medium flex-1">{props.text}</p>
        </div>
      );
    }

    case 'html-embed':
      return (
        <div
          className="mb-4 w-full overflow-hidden rounded-lg"
          style={{ minHeight: props.height || 200 }}
          dangerouslySetInnerHTML={{ __html: props.code || '' }}
        />
      );

    default:
      return null;
  }
}

// Contact Form component for public pages
interface ContactFormPublicProps {
  props: Record<string, any>;
  pageId: string;
  primaryColor: string;
}

function ContactFormPublic({ props, pageId, primaryColor }: ContactFormPublicProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const createContactSchema = () => {
    return z.object({
      name: props.showName
        ? z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters')
        : z.string().optional(),
      email: props.showEmail
        ? z.string().trim().email('Please enter a valid email').max(255, 'Email must be less than 255 characters')
        : z.string().optional(),
      phone: props.showPhone
        ? props.requirePhone
          ? z.string().trim().min(1, 'Phone is required').max(20, 'Phone must be less than 20 characters')
              .regex(/^[\d\s\-+()]+$/, 'Please enter a valid phone number')
          : z.string().trim().max(20, 'Phone must be less than 20 characters')
              .regex(/^[\d\s\-+()]*$/, 'Please enter a valid phone number').optional().or(z.literal(''))
        : z.string().optional(),
      message: props.showMessage
        ? z.string().trim().min(1, 'Message is required').max(2000, 'Message must be less than 2000 characters')
        : z.string().optional(),
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const schema = createContactSchema();
    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (!pageId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Form configuration error. Please try again later.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          page_id: pageId,
          name: formData.name || null,
          email: formData.email || null,
          phone: formData.phone || null,
          message: formData.message || null,
          metadata: {
            submitted_at: new Date().toISOString(),
          },
        });

      if (error) throw error;

      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Contact form submission error:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit form. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full p-8 rounded-lg text-center mb-4">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: props.buttonColor || primaryColor }}
          >
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-medium">
            {props.successMessage || "Thank you! We'll be in touch soon."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 rounded-lg mb-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className={
            props.layout === 'two-column' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'
          }
        >
          {props.showName && (
            <div className="space-y-2">
              <Label htmlFor="contact-name">
                {props.nameLabel || 'Name'} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact-name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder={props.namePlaceholder || 'Your name'}
                className={errors.name ? 'border-destructive' : ''}
                disabled={isSubmitting}
                maxLength={100}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
          )}

          {props.showEmail && (
            <div className="space-y-2">
              <Label htmlFor="contact-email">
                {props.emailLabel || 'Email'} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder={props.emailPlaceholder || 'your@email.com'}
                className={errors.email ? 'border-destructive' : ''}
                disabled={isSubmitting}
                maxLength={255}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
          )}

          {props.showPhone && (
            <div className="space-y-2">
              <Label htmlFor="contact-phone">
                {props.phoneLabel || 'Phone'}
                {props.requirePhone && <span className="text-destructive"> *</span>}
              </Label>
              <Input
                id="contact-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder={props.phonePlaceholder || '+1 (555) 000-0000'}
                className={errors.phone ? 'border-destructive' : ''}
                disabled={isSubmitting}
                maxLength={20}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>
          )}
        </div>

        {props.showMessage && (
          <div className="space-y-2">
            <Label htmlFor="contact-message">
              {props.messageLabel || 'Message'} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="contact-message"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder={props.messagePlaceholder || 'How can we help you?'}
              className={`min-h-[120px] resize-none ${errors.message ? 'border-destructive' : ''}`}
              disabled={isSubmitting}
              maxLength={2000}
            />
            {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
            <p className="text-xs text-muted-foreground text-right">
              {formData.message.length}/2000
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full text-white font-medium"
          style={{ backgroundColor: props.buttonColor || primaryColor }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            props.buttonText || 'Send Message'
          )}
        </Button>
      </form>
    </div>
  );
}
