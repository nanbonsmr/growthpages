import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageEditor, PageData } from '@/components/page-editor';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<PageData | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (!id || !user) return;

      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        toast({
          variant: 'destructive',
          title: 'Page not found',
          description: 'The page you are looking for does not exist or you do not have access.',
        });
        navigate('/dashboard/pages');
        return;
      }

      // Transform database data to PageData format
      const themeSettings = data.theme_settings as Record<string, any> | null;
      const pageData: PageData = {
        blocks: themeSettings?.blocks || [],
        settings: {
          title: data.title,
          description: data.description || '',
          slug: data.slug,
          backgroundType: themeSettings?.backgroundType || 'solid',
          backgroundColor: themeSettings?.backgroundColor || '#ffffff',
          gradientFrom: themeSettings?.gradientFrom || '#667eea',
          gradientTo: themeSettings?.gradientTo || '#764ba2',
          backgroundImage: themeSettings?.backgroundImage || '',
          primaryColor: themeSettings?.primaryColor || '#7c3aed',
          fontFamily: themeSettings?.fontFamily || 'Inter',
          maxWidth: themeSettings?.maxWidth || 'md',
        },
      };

      setInitialData(pageData);
      setIsLoading(false);
    };

    fetchPage();
  }, [id, user, navigate, toast]);

  const handleSave = async (data: PageData) => {
    if (!id || !user) throw new Error('Missing page ID or user');

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
        position: block.position ? {
          x: block.position.x,
          y: block.position.y,
          width: block.position.width,
          height: block.position.height,
        } : undefined,
      })),
    };

    const { error } = await supabase
      .from('pages')
      .update({
        title: data.settings.title,
        description: data.settings.description,
        slug: data.settings.slug,
        theme_settings: themeSettingsJson,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  };

  const handlePublish = async (data: PageData) => {
    if (!id || !user) throw new Error('Missing page ID or user');

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
        position: block.position ? {
          x: block.position.x,
          y: block.position.y,
          width: block.position.width,
          height: block.position.height,
        } : undefined,
      })),
    };

    const { error } = await supabase
      .from('pages')
      .update({
        title: data.settings.title,
        description: data.settings.description,
        slug: data.settings.slug,
        theme_settings: themeSettingsJson,
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  };

  if (isLoading || !initialData) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading page editor...</p>
        </div>
      </div>
    );
  }

  return (
    <PageEditor
      initialData={initialData}
      pageId={id}
      onSave={handleSave}
      onPublish={handlePublish}
    />
  );
}
