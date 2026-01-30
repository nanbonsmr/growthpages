import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Zap, Newspaper, Rocket, Calendar, Package, Gift } from 'lucide-react';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea';
  label: string;
  placeholder: string;
  required: boolean;
}

interface ThemeSettings {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  backgroundStyle?: string;
  fontStyle?: string;
  showSocialProof?: boolean;
  socialProofText?: string;
  showBadge?: boolean;
  badgeText?: string;
  thankYouTitle?: string;
  thankYouMessage?: string;
  formFields?: FormField[];
}

interface Page {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  template: string;
  button_text: string;
  theme_settings: ThemeSettings | null;
  logo_url: string | null;
  is_active: boolean;
}

const templateIcons: Record<string, React.ElementType> = {
  newsletter: Newspaper,
  waitlist: Rocket,
  event: Calendar,
  product_launch: Package,
  free_resource: Gift,
};

const templateTitles: Record<string, string> = {
  newsletter: 'Join Our Newsletter',
  waitlist: 'Join the Waitlist',
  event: 'Register for the Event',
  product_launch: 'Get Early Access',
  free_resource: 'Download Now',
};

const defaultFormFields: FormField[] = [
  { id: 'name', type: 'text', label: 'Name', placeholder: 'Your name', required: true },
  { id: 'email', type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
];

const fontFamilies: Record<string, string> = {
  'inter': '"Inter", system-ui, sans-serif',
  'playfair': '"Playfair Display", serif',
  'space-grotesk': '"Space Grotesk", sans-serif',
  'dm-sans': '"DM Sans", sans-serif',
};

export default function PublicSignupPage() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

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
          theme_settings: data.theme_settings as ThemeSettings | null,
          logo_url: data.logo_url,
          is_active: data.is_active,
        };
        setPage(pageData);
        
        // Initialize form data with field IDs
        const fields = pageData.theme_settings?.formFields || defaultFormFields;
        const initialData: Record<string, string> = {};
        fields.forEach(field => {
          initialData[field.id] = '';
        });
        setFormData(initialData);
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
      // Extract name and email from form data
      const name = formData.name || formData[Object.keys(formData).find(k => k !== 'email') || 'name'] || '';
      const email = formData.email || '';
      
      // Store additional fields in metadata
      const metadata: Record<string, string> = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'name' && key !== 'email') {
          metadata[key] = value;
        }
      });

      const { error } = await supabase.from('subscribers').insert({
        page_id: page.id,
        name,
        email,
        metadata: Object.keys(metadata).length > 0 ? metadata : null,
      });

      if (error) {
        if (error.code === '23505') {
          toast({
            variant: 'destructive',
            title: 'Already subscribed',
            description: 'This email is already registered.',
          });
        } else {
          throw error;
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

  const getBackgroundStyle = (theme: ThemeSettings | null) => {
    const primaryColor = theme?.primaryColor || '#4F46E5';
    const backgroundColor = theme?.backgroundColor || '#ffffff';
    const style = theme?.backgroundStyle || 'solid';

    switch (style) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${backgroundColor} 0%, ${primaryColor}15 50%, ${backgroundColor} 100%)`,
        };
      case 'dots':
        return {
          backgroundColor,
          backgroundImage: `radial-gradient(${primaryColor}25 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        };
      case 'grid':
        return {
          backgroundColor,
          backgroundImage: `linear-gradient(${primaryColor}12 1px, transparent 1px), linear-gradient(90deg, ${primaryColor}12 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        };
      default:
        return { backgroundColor };
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

  const Icon = templateIcons[page.template] || Newspaper;
  const theme = page.theme_settings;
  const primaryColor = theme?.primaryColor || '#4F46E5';
  const fontFamily = fontFamilies[theme?.fontStyle || 'inter'] || fontFamilies.inter;
  const formFields = theme?.formFields || defaultFormFields;
  const showBadge = theme?.showBadge !== false;
  const badgeText = theme?.badgeText || '✨ Free forever';
  const showSocialProof = theme?.showSocialProof !== false;
  const socialProofText = theme?.socialProofText || 'Join 10,000+ subscribers';
  const thankYouTitle = theme?.thankYouTitle || "You're In!";
  const thankYouMessage = theme?.thankYouMessage || "Thank you for signing up. We'll be in touch soon!";

  if (isSuccess) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-4"
        style={{ ...getBackgroundStyle(theme), fontFamily }}
      >
        {/* Ambient background blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse-slow"
            style={{ backgroundColor: primaryColor }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse-slow"
            style={{ backgroundColor: primaryColor, animationDelay: '2s' }}
          />
        </div>

        <div className="max-w-md w-full text-center animate-fade-up">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <CheckCircle className="h-10 w-10" style={{ color: primaryColor }} />
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
            {thankYouTitle}
          </h1>
          <p className="text-muted-foreground mb-8">
            {thankYouMessage}
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-semibold">LeadCapture</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ ...getBackgroundStyle(theme), fontFamily }}
    >
      {/* Ambient background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse-slow"
          style={{ backgroundColor: primaryColor }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse-slow"
          style={{ backgroundColor: primaryColor, animationDelay: '2s' }}
        />
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-up">
          {/* Logo */}
          {page.logo_url && (
            <img 
              src={page.logo_url} 
              alt="Logo" 
              className="h-14 w-auto mx-auto mb-6 object-contain"
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
          )}

          {/* Badge */}
          {showBadge && badgeText && (
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ 
                backgroundColor: `${primaryColor}15`,
                color: primaryColor 
              }}
            >
              {badgeText}
            </div>
          )}

          {/* Icon (only show if no logo) */}
          {!page.logo_url && (
            <div 
              className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <Icon className="h-8 w-8 text-white" />
            </div>
          )}

          {/* Title */}
          <h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: primaryColor }}
          >
            {page.title || templateTitles[page.template]}
          </h1>

          {/* Description */}
          {page.description && (
            <p className="text-lg text-muted-foreground">
              {page.description}
            </p>
          )}
        </div>

        {/* Form Card */}
        <div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-lg animate-fade-up"
          style={{ animationDelay: '0.1s' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {formFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                    required={field.required}
                    rows={3}
                    className="resize-none"
                  />
                ) : (
                  <Input
                    id={field.id}
                    type={field.type === 'phone' ? 'tel' : field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                    required={field.required}
                    className="h-12"
                  />
                )}
              </div>
            ))}

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
              style={{ backgroundColor: primaryColor }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                page.button_text || 'Subscribe'
              )}
            </Button>
          </form>

          {/* Social Proof */}
          {showSocialProof && socialProofText && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              {socialProofText}
            </p>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Powered by{' '}
          <a href="/" className="font-semibold hover:underline inline-flex items-center gap-1">
            <Zap className="h-3.5 w-3.5" /> LeadCapture
          </a>
        </p>
      </div>
    </div>
  );
}
