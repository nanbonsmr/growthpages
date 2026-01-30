import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Zap, Newspaper, Rocket, Calendar, Package, Gift } from 'lucide-react';

interface ThemeSettings {
  primaryColor?: string;
  backgroundColor?: string;
  backgroundStyle?: string;
  fontStyle?: string;
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

export default function PublicSignupPage() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

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
        // Cast with proper type handling
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
      const { error } = await supabase.from('subscribers').insert({
        page_id: page.id,
        name: formData.name,
        email: formData.email,
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
  const primaryColor = page.theme_settings?.primaryColor || '#4F46E5';

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="absolute inset-0 -z-10">
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: primaryColor }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: primaryColor }}
          />
        </div>

        <div className="max-w-md w-full text-center animate-fade-up">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <CheckCircle className="h-10 w-10" style={{ color: primaryColor }} />
          </div>
          <h1 className="text-3xl font-bold mb-4">You're In!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for signing up. We'll be in touch soon!
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-semibold">LeadCapture</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: primaryColor }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: primaryColor }}
        />
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-up">
          {/* Icon */}
          <div 
            className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: primaryColor }}
          >
            <Icon className="h-8 w-8 text-white" />
          </div>

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

        {/* Form */}
        <form 
          onSubmit={handleSubmit} 
          className="space-y-4 animate-fade-up"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              className="h-12"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-semibold"
            style={{ backgroundColor: primaryColor }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Subscribing...
              </>
            ) : (
              page.button_text || 'Subscribe'
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Powered by{' '}
          <a href="/" className="font-semibold hover:underline">
            <Zap className="inline h-4 w-4" /> LeadCapture
          </a>
        </p>
      </div>
    </div>
  );
}
