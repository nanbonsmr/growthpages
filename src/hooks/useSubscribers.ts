import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Subscriber {
  id: string;
  page_id: string;
  name: string;
  email: string;
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  page?: {
    title: string;
    slug: string;
  };
}

export function useSubscribers(pageId?: string) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchSubscribers = async () => {
    if (!user) {
      setSubscribers([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // First get user's pages
      const { data: userPages, error: pagesError } = await supabase
        .from('pages')
        .select('id')
        .eq('user_id', user.id);

      if (pagesError) throw pagesError;

      const pageIds = userPages?.map(p => p.id) || [];
      
      if (pageIds.length === 0) {
        setSubscribers([]);
        setIsLoading(false);
        return;
      }

      let query = supabase
        .from('subscribers')
        .select(`
          *,
          page:pages(title, slug)
        `)
        .in('page_id', pageIds)
        .order('created_at', { ascending: false });

      if (pageId) {
        query = query.eq('page_id', pageId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSubscribers(data as Subscriber[]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSubscriber = async (id: string) => {
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchSubscribers();
  };

  const updateSubscriber = async (id: string, updateData: { name?: string; email?: string; tags?: string[] }) => {
    const { error } = await supabase
      .from('subscribers')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    await fetchSubscribers();
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Page', 'Tags', 'Signup Date'];
    const rows = subscribers.map(s => [
      s.name,
      s.email,
      s.page?.title || '',
      s.tags.join(', '),
      new Date(s.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchSubscribers();
  }, [user, pageId]);

  return {
    subscribers,
    isLoading,
    error,
    fetchSubscribers,
    deleteSubscriber,
    updateSubscriber,
    exportToCSV,
  };
}
