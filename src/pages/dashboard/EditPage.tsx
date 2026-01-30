import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { usePages, Page } from '@/hooks/usePages';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Newspaper, Rocket, Calendar, Package, Gift, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const templates = [
  { value: 'newsletter', label: 'Newsletter Signup', icon: Newspaper },
  { value: 'waitlist', label: 'Startup Waitlist', icon: Rocket },
  { value: 'event', label: 'Event Registration', icon: Calendar },
  { value: 'product_launch', label: 'Product Launch', icon: Package },
  { value: 'free_resource', label: 'Free Resource', icon: Gift },
];

const colorPresets = [
  { name: 'Indigo', value: '#4F46E5' },
  { name: 'Purple', value: '#7C3AED' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'Teal', value: '#0D9488' },
  { name: 'Orange', value: '#EA580C' },
  { name: 'Pink', value: '#DB2777' },
];

export default function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updatePage } = usePages();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    slug: string;
    template: 'newsletter' | 'waitlist' | 'event' | 'product_launch' | 'free_resource';
    button_text: string;
    primaryColor: string;
    is_active: boolean;
  }>({
    title: '',
    description: '',
    slug: '',
    template: 'newsletter',
    button_text: 'Subscribe',
    primaryColor: '#4F46E5',
    is_active: true,
  });

  useEffect(() => {
    const fetchPage = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        toast({
          variant: 'destructive',
          title: 'Page not found',
        });
        navigate('/dashboard/pages');
        return;
      }

      const page = data as Page;
      setFormData({
        title: page.title,
        description: page.description || '',
        slug: page.slug,
        template: page.template,
        button_text: page.button_text,
        primaryColor: page.theme_settings?.primaryColor || '#4F46E5',
        is_active: page.is_active,
      });
      setIsFetching(false);
    };

    fetchPage();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsLoading(true);

    try {
      await updatePage(id, {
        title: formData.title,
        description: formData.description,
        slug: formData.slug,
        template: formData.template,
        button_text: formData.button_text,
        is_active: formData.is_active,
        theme_settings: {
          primaryColor: formData.primaryColor,
          backgroundColor: '#ffffff',
          backgroundStyle: 'solid',
          fontStyle: 'inter',
        },
      });

      toast({
        title: 'Page updated!',
        description: 'Your changes have been saved.',
      });

      navigate('/dashboard/pages');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update page.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <DashboardLayout title="Edit Page" description="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Edit Page"
      description="Update your signup page settings."
    >
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate('/dashboard/pages')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Pages
      </Button>

      <div className="grid lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="is_active">Page Active</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable this page</p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">/p/</span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="button_text">Button Text</Label>
                <Input
                  id="button_text"
                  value={formData.button_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, template: template.value as any }))}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.template === template.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <template.icon className={`h-5 w-5 mb-2 ${
                      formData.template === template.value ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <p className="font-medium text-sm">{template.label}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <Label>Primary Color</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {colorPresets.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, primaryColor: color.value }))}
                    className={`w-10 h-10 rounded-lg transition-transform ${
                      formData.primaryColor === color.value ? 'scale-110 ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full gradient-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>

        {/* Live Preview */}
        <div className="hidden lg:block">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-white p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                <h2 
                  className="text-2xl font-bold mb-4"
                  style={{ color: formData.primaryColor }}
                >
                  {formData.title || 'Your Page Title'}
                </h2>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  {formData.description || 'Add a description...'}
                </p>
                <div className="w-full max-w-xs space-y-3">
                  <Input placeholder="Your name" disabled />
                  <Input placeholder="Your email" disabled />
                  <Button 
                    className="w-full"
                    style={{ backgroundColor: formData.primaryColor }}
                    disabled
                  >
                    {formData.button_text || 'Subscribe'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
