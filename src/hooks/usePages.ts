import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Page {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  slug: string;
  template: 'newsletter' | 'waitlist' | 'event' | 'product_launch' | 'free_resource';
  button_text: string;
  theme_settings: {
    primaryColor: string;
    backgroundColor: string;
    backgroundStyle: string;
    fontStyle: string;
  };
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function usePages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchPages = async () => {
    if (!user) {
      setPages([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data as Page[]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPage = async (pageData: Omit<Partial<Page>, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { title: string; slug: string }) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('pages')
      .insert({
        title: pageData.title,
        slug: pageData.slug,
        description: pageData.description,
        template: pageData.template,
        button_text: pageData.button_text,
        theme_settings: pageData.theme_settings,
        logo_url: pageData.logo_url,
        is_active: pageData.is_active,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    await fetchPages();
    return data as Page;
  };

  const updatePage = async (id: string, pageData: Partial<Page>) => {
    const { data, error } = await supabase
      .from('pages')
      .update(pageData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    await fetchPages();
    return data as Page;
  };

  const deletePage = async (id: string) => {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchPages();
  };

  useEffect(() => {
    fetchPages();
  }, [user]);

  return {
    pages,
    isLoading,
    error,
    fetchPages,
    createPage,
    updatePage,
    deletePage,
  };
}
