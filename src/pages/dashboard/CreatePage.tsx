import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { usePages } from '@/hooks/usePages';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, Newspaper, Rocket, Calendar, Package, Gift, ArrowLeft,
  Palette, Type, Layout, Sparkles, CheckCircle, Image, Monitor, Smartphone,
  Eye, Settings2, Wand2, Plus, Trash2
} from 'lucide-react';

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
  { name: 'Red', value: '#DC2626' },
  { name: 'Green', value: '#16A34A' },
];

const backgroundStyles = [
  { value: 'solid', label: 'Solid Color', icon: '◼' },
  { value: 'gradient', label: 'Gradient', icon: '◧' },
  { value: 'dots', label: 'Dots Pattern', icon: '⋮⋮' },
  { value: 'grid', label: 'Grid Pattern', icon: '▦' },
];

const fontStyles = [
  { value: 'inter', label: 'Inter', preview: 'Modern & Clean' },
  { value: 'playfair', label: 'Playfair Display', preview: 'Elegant & Serif' },
  { value: 'space-grotesk', label: 'Space Grotesk', preview: 'Bold & Technical' },
  { value: 'dm-sans', label: 'DM Sans', preview: 'Friendly & Rounded' },
];

interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea';
  label: string;
  placeholder: string;
  required: boolean;
}

const defaultFields: FormField[] = [
  { id: 'name', type: 'text', label: 'Name', placeholder: 'Your name', required: true },
  { id: 'email', type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
];

export default function CreatePage() {
  const navigate = useNavigate();
  const { createPage } = usePages();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState('details');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    template: 'newsletter' as const,
    button_text: 'Subscribe',
    primaryColor: '#4F46E5',
    secondaryColor: '#7C3AED',
    backgroundColor: '#ffffff',
    backgroundStyle: 'solid',
    fontStyle: 'inter',
    // New advanced fields
    showSocialProof: true,
    socialProofText: 'Join 10,000+ subscribers',
    showBadge: true,
    badgeText: '✨ Free forever',
    thankYouTitle: 'Thank you!',
    thankYouMessage: "You're all set. Check your inbox for confirmation.",
    showLogo: false,
    logoUrl: '',
    formFields: defaultFields,
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

  const addFormField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: 'New Field',
      placeholder: 'Enter value',
      required: false,
    };
    setFormData(prev => ({
      ...prev,
      formFields: [...prev.formFields, newField],
    }));
  };

  const removeFormField = (id: string) => {
    if (id === 'name' || id === 'email') return; // Can't remove required fields
    setFormData(prev => ({
      ...prev,
      formFields: prev.formFields.filter(f => f.id !== id),
    }));
  };

  const updateFormField = (id: string, updates: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      formFields: prev.formFields.map(f => f.id === id ? { ...f, ...updates } : f),
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
          secondaryColor: formData.secondaryColor,
          backgroundColor: formData.backgroundColor,
          backgroundStyle: formData.backgroundStyle,
          fontStyle: formData.fontStyle,
          showSocialProof: formData.showSocialProof,
          socialProofText: formData.socialProofText,
          showBadge: formData.showBadge,
          badgeText: formData.badgeText,
          thankYouTitle: formData.thankYouTitle,
          thankYouMessage: formData.thankYouMessage,
          formFields: formData.formFields,
        },
        logo_url: formData.showLogo ? formData.logoUrl : null,
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

  const getBackgroundStyle = () => {
    switch (formData.backgroundStyle) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${formData.backgroundColor} 0%, ${formData.primaryColor}15 100%)`,
        };
      case 'dots':
        return {
          backgroundColor: formData.backgroundColor,
          backgroundImage: `radial-gradient(${formData.primaryColor}20 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        };
      case 'grid':
        return {
          backgroundColor: formData.backgroundColor,
          backgroundImage: `linear-gradient(${formData.primaryColor}10 1px, transparent 1px), linear-gradient(90deg, ${formData.primaryColor}10 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        };
      default:
        return { backgroundColor: formData.backgroundColor };
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

      <div className="grid lg:grid-cols-[1fr,400px] xl:grid-cols-[1fr,500px] gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="details" className="gap-2">
                <Settings2 className="h-4 w-4" />
                <span className="hidden sm:inline">Details</span>
              </TabsTrigger>
              <TabsTrigger value="design" className="gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Design</span>
              </TabsTrigger>
              <TabsTrigger value="form" className="gap-2">
                <Layout className="h-4 w-4" />
                <span className="hidden sm:inline">Form</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="gap-2">
                <Wand2 className="h-4 w-4" />
                <span className="hidden sm:inline">Advanced</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-primary" />
                    Page Details
                  </CardTitle>
                  <CardDescription>Basic information about your signup page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Page Title *</Label>
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
                      <span className="text-muted-foreground text-sm whitespace-nowrap">/p/</span>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5 text-primary" />
                    Template
                  </CardTitle>
                  <CardDescription>Choose a template that fits your use case.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {templates.map((template) => (
                      <button
                        key={template.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, template: template.value as any }))}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          formData.template === template.value
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
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
            </TabsContent>

            <TabsContent value="design" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Colors
                  </CardTitle>
                  <CardDescription>Customize your brand colors.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Primary Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {colorPresets.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, primaryColor: color.value }))}
                          className={`w-10 h-10 rounded-lg transition-all ${
                            formData.primaryColor === color.value 
                              ? 'scale-110 ring-2 ring-offset-2 ring-ring' 
                              : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                      <div className="relative">
                        <input
                          type="color"
                          value={formData.primaryColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-dashed border-border"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, backgroundColor: '#ffffff' }))}
                        className={`w-10 h-10 rounded-lg border-2 ${
                          formData.backgroundColor === '#ffffff' ? 'ring-2 ring-offset-2 ring-ring' : ''
                        }`}
                        style={{ backgroundColor: '#ffffff' }}
                        title="White"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, backgroundColor: '#f8fafc' }))}
                        className={`w-10 h-10 rounded-lg border ${
                          formData.backgroundColor === '#f8fafc' ? 'ring-2 ring-offset-2 ring-ring' : ''
                        }`}
                        style={{ backgroundColor: '#f8fafc' }}
                        title="Slate 50"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, backgroundColor: '#faf5ff' }))}
                        className={`w-10 h-10 rounded-lg border ${
                          formData.backgroundColor === '#faf5ff' ? 'ring-2 ring-offset-2 ring-ring' : ''
                        }`}
                        style={{ backgroundColor: '#faf5ff' }}
                        title="Purple 50"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, backgroundColor: '#f0f9ff' }))}
                        className={`w-10 h-10 rounded-lg border ${
                          formData.backgroundColor === '#f0f9ff' ? 'ring-2 ring-offset-2 ring-ring' : ''
                        }`}
                        style={{ backgroundColor: '#f0f9ff' }}
                        title="Sky 50"
                      />
                      <input
                        type="color"
                        value={formData.backgroundColor}
                        onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-10 h-10 rounded-lg cursor-pointer border-2 border-dashed border-border"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-primary" />
                    Background Style
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {backgroundStyles.map((style) => (
                      <button
                        key={style.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, backgroundStyle: style.value }))}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          formData.backgroundStyle === style.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="text-2xl mb-1 block">{style.icon}</span>
                        <p className="text-sm font-medium">{style.label}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5 text-primary" />
                    Typography
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {fontStyles.map((font) => (
                      <button
                        key={font.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, fontStyle: font.value }))}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          formData.fontStyle === font.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <p className="font-semibold">{font.label}</p>
                        <p className="text-sm text-muted-foreground">{font.preview}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="form" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5 text-primary" />
                    Form Fields
                  </CardTitle>
                  <CardDescription>Customize what information you collect.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.formFields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-3 p-4 rounded-lg border bg-muted/30">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Label</Label>
                          <Input
                            value={field.label}
                            onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                            placeholder="Field label"
                            disabled={field.id === 'email'}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={field.type}
                            onValueChange={(value) => updateFormField(field.id, { type: value as FormField['type'] })}
                            disabled={field.id === 'email'}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="textarea">Long Text</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5 col-span-2">
                          <Label className="text-xs">Placeholder</Label>
                          <Input
                            value={field.placeholder}
                            onChange={(e) => updateFormField(field.id, { placeholder: e.target.value })}
                            placeholder="Placeholder text"
                          />
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <Switch
                            checked={field.required}
                            onCheckedChange={(checked) => updateFormField(field.id, { required: checked })}
                            disabled={field.id === 'email'}
                          />
                          <Label className="text-sm">Required field</Label>
                        </div>
                      </div>
                      {field.id !== 'name' && field.id !== 'email' && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFormField(field.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addFormField}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Field
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Button Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Social Proof & Badge
                  </CardTitle>
                  <CardDescription>Build trust with visitors.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Show Social Proof</p>
                      <p className="text-sm text-muted-foreground">Display subscriber count</p>
                    </div>
                    <Switch
                      checked={formData.showSocialProof}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showSocialProof: checked }))}
                    />
                  </div>
                  {formData.showSocialProof && (
                    <div className="space-y-2 pl-4">
                      <Label>Social Proof Text</Label>
                      <Input
                        value={formData.socialProofText}
                        onChange={(e) => setFormData(prev => ({ ...prev, socialProofText: e.target.value }))}
                        placeholder="Join 10,000+ subscribers"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Show Badge</p>
                      <p className="text-sm text-muted-foreground">Eye-catching badge above title</p>
                    </div>
                    <Switch
                      checked={formData.showBadge}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showBadge: checked }))}
                    />
                  </div>
                  {formData.showBadge && (
                    <div className="space-y-2 pl-4">
                      <Label>Badge Text</Label>
                      <Input
                        value={formData.badgeText}
                        onChange={(e) => setFormData(prev => ({ ...prev, badgeText: e.target.value }))}
                        placeholder="✨ Free forever"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Thank You Message
                  </CardTitle>
                  <CardDescription>Shown after successful signup.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={formData.thankYouTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, thankYouTitle: e.target.value }))}
                      placeholder="Thank you!"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                      value={formData.thankYouMessage}
                      onChange={(e) => setFormData(prev => ({ ...prev, thankYouMessage: e.target.value }))}
                      placeholder="You're all set. Check your inbox for confirmation."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-primary" />
                    Logo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Show Logo</p>
                      <p className="text-sm text-muted-foreground">Display your brand logo</p>
                    </div>
                    <Switch
                      checked={formData.showLogo}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showLogo: checked }))}
                    />
                  </div>
                  {formData.showLogo && (
                    <div className="space-y-2 pl-4">
                      <Label>Logo URL</Label>
                      <Input
                        value={formData.logoUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Button type="submit" className="w-full gradient-primary h-12 text-lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Create Page
              </>
            )}
          </Button>
        </form>

        {/* Live Preview */}
        <div className="hidden lg:block">
          <Card className="sticky top-8">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
                <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
                  <Button
                    type="button"
                    variant={previewMode === 'desktop' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant={previewMode === 'mobile' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`mx-auto transition-all duration-300 ${
                previewMode === 'mobile' ? 'max-w-[320px]' : 'w-full'
              }`}>
                <div 
                  className="rounded-lg border overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-center p-6"
                  style={getBackgroundStyle()}
                >
                  {formData.showLogo && formData.logoUrl && (
                    <img 
                      src={formData.logoUrl} 
                      alt="Logo" 
                      className="h-12 w-auto mb-4 object-contain"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  )}
                  
                  {formData.showBadge && (
                    <div 
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-4"
                      style={{ 
                        backgroundColor: `${formData.primaryColor}15`,
                        color: formData.primaryColor 
                      }}
                    >
                      {formData.badgeText || '✨ Free forever'}
                    </div>
                  )}
                  
                  <h2 
                    className="text-2xl font-bold mb-3"
                    style={{ color: formData.primaryColor }}
                  >
                    {formData.title || 'Your Page Title'}
                  </h2>
                  
                  <p className="text-muted-foreground mb-6 max-w-sm text-sm">
                    {formData.description || 'Add a compelling description to tell visitors what they will get.'}
                  </p>
                  
                  <div className="w-full max-w-xs space-y-3">
                    {formData.formFields.map((field) => (
                      <div key={field.id}>
                        {field.type === 'textarea' ? (
                          <Textarea 
                            placeholder={field.placeholder} 
                            disabled 
                            className="bg-white/80"
                            rows={2}
                          />
                        ) : (
                          <Input 
                            placeholder={field.placeholder} 
                            disabled 
                            className="bg-white/80"
                          />
                        )}
                      </div>
                    ))}
                    <Button 
                      className="w-full"
                      style={{ backgroundColor: formData.primaryColor }}
                      disabled
                    >
                      {formData.button_text || 'Subscribe'}
                    </Button>
                  </div>
                  
                  {formData.showSocialProof && (
                    <p className="text-xs text-muted-foreground mt-4">
                      {formData.socialProofText || 'Join 10,000+ subscribers'}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
