import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageEditor, PageData } from '@/components/page-editor';
import { DEFAULT_PAGE_SETTINGS } from '@/components/page-editor/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Crown } from 'lucide-react';

export default function CreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { canCreatePage, isAtPageLimit, limits, usage, currentPlan } = usePlanLimits();

  // Redirect if at limit
  useEffect(() => {
    if (isAtPageLimit && currentPlan === 'free') {
      toast({
        variant: 'destructive',
        title: 'Page limit reached',
        description: 'Upgrade to Pro to create unlimited pages.',
      });
    }
  }, [isAtPageLimit, currentPlan, toast]);

  // Show upgrade prompt if at limit
  if (isAtPageLimit) {
    return (
      <DashboardLayout title="Create Page" description="Build a new signup page">
        <Card className="max-w-lg mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
            <CardTitle>Page Limit Reached</CardTitle>
            <CardDescription>
              You've reached the maximum of {limits.maxPages} page{limits.maxPages === 1 ? '' : 's'} on the {currentPlan} plan.
              You currently have {usage.pages} page{usage.pages === 1 ? '' : 's'}.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button 
              onClick={() => navigate('/dashboard/billing')}
              className="gradient-primary"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
            <Button variant="ghost" onClick={() => navigate('/dashboard/pages')}>
              Back to Pages
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const initialData: PageData = {
    blocks: [],
    settings: { ...DEFAULT_PAGE_SETTINGS },
  };

  const handleSave = async (data: PageData) => {
    if (!user) throw new Error('User not authenticated');

    const themeSettingsJson = {
      backgroundType: data.settings.backgroundType,
      backgroundColor: data.settings.backgroundColor,
      gradientFrom: data.settings.gradientFrom,
      gradientTo: data.settings.gradientTo,
      backgroundImage: data.settings.backgroundImage,
      primaryColor: data.settings.primaryColor,
      fontFamily: data.settings.fontFamily,
      maxWidth: data.settings.maxWidth,
      blocks: data.blocks.map(block => ({
        id: block.id,
        type: block.type,
        props: block.props,
      })),
    };

    const { data: newPage, error } = await supabase
      .from('pages')
      .insert({
        title: data.settings.title,
        description: data.settings.description,
        slug: data.settings.slug,
        user_id: user.id,
        theme_settings: themeSettingsJson,
        is_active: false,
      })
      .select()
      .single();

    if (error) throw error;

    // Navigate to edit page after creation
    navigate(`/dashboard/pages/${newPage.id}/edit`);
  };

  const handlePublish = async (data: PageData) => {
    if (!user) throw new Error('User not authenticated');

    const themeSettingsJson = {
      backgroundType: data.settings.backgroundType,
      backgroundColor: data.settings.backgroundColor,
      gradientFrom: data.settings.gradientFrom,
      gradientTo: data.settings.gradientTo,
      backgroundImage: data.settings.backgroundImage,
      primaryColor: data.settings.primaryColor,
      fontFamily: data.settings.fontFamily,
      maxWidth: data.settings.maxWidth,
      blocks: data.blocks.map(block => ({
        id: block.id,
        type: block.type,
        props: block.props,
      })),
    };

    const { error } = await supabase
      .from('pages')
      .insert({
        title: data.settings.title,
        description: data.settings.description,
        slug: data.settings.slug,
        user_id: user.id,
        theme_settings: themeSettingsJson,
        is_active: true,
      });

    if (error) throw error;

    toast({
      title: 'Page published!',
      description: 'Your signup page is now live.',
    });

    navigate('/dashboard/pages');
  };

  return (
    <PageEditor
      initialData={initialData}
      onSave={handleSave}
      onPublish={handlePublish}
    />
  );
}
