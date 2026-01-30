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
  status: 'active' | 'unsubscribed';
  notes: string | null;
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

  const updateSubscriber = async (id: string, updateData: { name?: string; email?: string; tags?: string[]; notes?: string; status?: string }) => {
    const { error } = await supabase
      .from('subscribers')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    await fetchSubscribers();
  };

  const bulkUpdateTags = async (ids: string[], tag: string) => {
    for (const id of ids) {
      const subscriber = subscribers.find(s => s.id === id);
      if (subscriber) {
        const newTags = subscriber.tags?.includes(tag) 
          ? subscriber.tags 
          : [...(subscriber.tags || []), tag];
        await supabase
          .from('subscribers')
          .update({ tags: newTags })
          .eq('id', id);
      }
    }
    await fetchSubscribers();
  };

  const bulkDelete = async (ids: string[]) => {
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .in('id', ids);

    if (error) throw error;
    await fetchSubscribers();
  };

  const exportSelectedToCSV = (ids: string[]) => {
    const selectedSubscribers = subscribers.filter(s => ids.includes(s.id));
    const headers = ['Name', 'Email', 'Page', 'Tags', 'Status', 'Signup Date'];
    const rows = selectedSubscribers.map(s => [
      s.name,
      s.email,
      s.page?.title || '',
      s.tags?.join(', ') || '',
      s.status || 'active',
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
    a.download = `subscribers-selected-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
    bulkUpdateTags,
    bulkDelete,
    exportSelectedToCSV,
  };
}
