import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePages } from '@/hooks/usePages';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Newspaper, Rocket, Calendar, Package, Gift, ArrowLeft } from 'lucide-react';

const templates = [
  { value: 'newsletter', label: 'Newsletter Signup', icon: Newspaper, description: 'Grow your email list' },
  { value: 'waitlist', label: 'Startup Waitlist', icon: Rocket, description: 'Build anticipation' },
  { value: 'event', label: 'Event Registration', icon: Calendar, description: 'Collect RSVPs' },
  { value: 'product_launch', label: 'Product Launch', icon: Package, description: 'Early access signups' },
  { value: 'free_resource', label: 'Free Resource', icon: Gift, description: 'Lead magnet downloads' },
];

const colorPresets = [
  { name: 'Indigo', value: '#4F46E5' },
  { name: 'Purple', value: '#7C3AED' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'Teal', value: '#0D9488' },
  { name: 'Orange', value: '#EA580C' },
  { name: 'Pink', value: '#DB2777' },
];

export default function CreatePage() {
  const navigate = useNavigate();
  const { createPage } = usePages();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    template: 'newsletter' as const,
    button_text: 'Subscribe',
    primaryColor: '#4F46E5',
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createPage({
        title: formData.title,
        description: formData.description,
        slug: formData.slug,
        template: formData.template,
        button_text: formData.button_text,
        theme_settings: {
          primaryColor: formData.primaryColor,
          backgroundColor: '#ffffff',
          backgroundStyle: 'solid',
          fontStyle: 'inter',
        },
      });

      toast({
        title: 'Page created!',
        description: 'Your signup page is now live.',
      });

      navigate('/dashboard/pages');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create page.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Create New Page"
      description="Set up a new signup page to capture leads."
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
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Details</CardTitle>
              <CardDescription>Basic information about your signup page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  placeholder="My Newsletter"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">/p/</span>
                  <Input
                    id="slug"
                    placeholder="my-newsletter"
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
                  placeholder="Join our newsletter to get weekly updates..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="button_text">Button Text</Label>
                <Input
                  id="button_text"
                  placeholder="Subscribe"
                  value={formData.button_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template</CardTitle>
              <CardDescription>Choose a template for your page.</CardDescription>
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
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Customize your page appearance.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label>Primary Color</Label>
                <div className="flex flex-wrap gap-2">
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
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full gradient-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Page'
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
              <div 
                className="rounded-lg border bg-white p-8 min-h-[400px] flex flex-col items-center justify-center text-center"
              >
                <h2 
                  className="text-2xl font-bold mb-4"
                  style={{ color: formData.primaryColor }}
                >
                  {formData.title || 'Your Page Title'}
                </h2>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  {formData.description || 'Add a compelling description to tell visitors what they will get.'}
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
