import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageEditor, PageData } from '@/components/page-editor';
import { DEFAULT_PAGE_SETTINGS } from '@/components/page-editor/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function CreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

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
