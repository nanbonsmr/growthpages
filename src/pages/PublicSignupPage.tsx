import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Zap, Twitter, Facebook, Instagram, Linkedin, Youtube, Quote } from 'lucide-react';
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
            Powered by <span className="font-semibold">LeadCapture</span>
          </p>
        </div>
      </div>
    );
  }

  // Block-based page rendering
  if (hasBlocks) {
    const maxWidthClasses: Record<string, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
    };

    return (
      <div
        className="min-h-screen"
        style={{
          ...getBackgroundStyle(settings),
          fontFamily: settings?.fontFamily || 'Inter',
        }}
      >
        <div className={`mx-auto px-6 py-8 ${maxWidthClasses[settings?.maxWidth || 'md']}`}>
          {blocks.map((block) => (
            <BlockRenderer
              key={block.id}
              block={block}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              primaryColor={settings?.primaryColor || '#7c3aed'}
              onSuccessMessage={setSuccessMessage}
              pageId={page.id}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            Powered by{' '}
            <a href="/" className="font-semibold hover:underline inline-flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" /> LeadCapture
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

  switch (block.type) {
    case 'heading': {
      const Tag = props.level || 'h1';
      return (
        <Tag
          style={{
            fontSize: `${props.fontSize || 36}px`,
            fontWeight: props.fontWeight === 'normal' ? 400 : props.fontWeight === 'medium' ? 500 : props.fontWeight === 'semibold' ? 600 : 700,
            textAlign: props.alignment || 'center',
            color: props.color || '#000000',
          }}
          className="mb-4"
        >
          {props.text}
        </Tag>
      );
    }

    case 'text':
      return (
        <p
          style={{
            fontSize: `${props.fontSize || 16}px`,
            textAlign: props.alignment || 'center',
            color: props.color || '#666666',
          }}
          className="mb-4 leading-relaxed"
        >
          {props.text}
        </p>
      );

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
            style={{
              width: `${props.width || 200}px`,
              height: `${props.height || 200}px`,
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
      const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

      useEffect(() => {
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
      }, [props.targetDate]);

      const units = [
        { key: 'days', label: 'Days', show: props.showDays },
        { key: 'hours', label: 'Hours', show: props.showHours },
        { key: 'minutes', label: 'Min', show: props.showMinutes },
        { key: 'seconds', label: 'Sec', show: props.showSeconds },
      ].filter((u) => u.show);

      return (
        <div className="text-center mb-4">
          {props.label && <p className="text-muted-foreground text-sm mb-3">{props.label}</p>}
          <div className="flex justify-center gap-3">
            {units.map((unit) => (
              <div key={unit.key} className="flex flex-col items-center">
                <div
                  className="text-3xl font-bold w-16 h-16 flex items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${props.color || primaryColor}20`, color: props.color || primaryColor }}
                >
                  {String(timeLeft[unit.key as keyof typeof timeLeft]).padStart(2, '0')}
                </div>
                <span className="text-xs text-muted-foreground mt-1">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'contact-form':
      return (
        <ContactFormPublic
          props={props}
          pageId={pageId || ''}
          primaryColor={primaryColor}
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
