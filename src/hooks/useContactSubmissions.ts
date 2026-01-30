import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ContactSubmission {
  id: string;
  page_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  page?: {
    title: string;
    slug: string;
  };
}

export function useContactSubmissions(pageId?: string) {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchSubmissions = async () => {
    if (!user) {
      setSubmissions([]);
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

      const pageIds = userPages?.map((p) => p.id) || [];

      if (pageIds.length === 0) {
        setSubmissions([]);
        setIsLoading(false);
        return;
      }

      let query = supabase
        .from('contact_submissions')
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
      setSubmissions(data as ContactSubmission[]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSubmission = async (id: string) => {
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchSubmissions();
  };

  const bulkDelete = async (ids: string[]) => {
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .in('id', ids);

    if (error) throw error;
    await fetchSubmissions();
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Message', 'Page', 'Submitted At'];
    const rows = submissions.map((s) => [
      s.name || '',
      s.email || '',
      s.phone || '',
      s.message?.replace(/"/g, '""') || '',
      s.page?.title || '',
      new Date(s.created_at).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSelectedToCSV = (ids: string[]) => {
    const selectedSubmissions = submissions.filter((s) => ids.includes(s.id));
    const headers = ['Name', 'Email', 'Phone', 'Message', 'Page', 'Submitted At'];
    const rows = selectedSubmissions.map((s) => [
      s.name || '',
      s.email || '',
      s.phone || '',
      s.message?.replace(/"/g, '""') || '',
      s.page?.title || '',
      new Date(s.created_at).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact-submissions-selected-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchSubmissions();
  }, [user, pageId]);

  return {
    submissions,
    isLoading,
    error,
    fetchSubmissions,
    deleteSubmission,
    bulkDelete,
    exportToCSV,
    exportSelectedToCSV,
  };
}
