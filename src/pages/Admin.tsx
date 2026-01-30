import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Users, FileText, UserCheck, Crown, Loader2 } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalPages: number;
  totalSubscribers: number;
  planBreakdown: {
    free: number;
    pro: number;
    business: number;
  };
}

export default function Admin() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAdmin) return;

      try {
        // Fetch all profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('plan');

        if (profilesError) throw profilesError;

        // Fetch all pages count
        const { count: pagesCount, error: pagesError } = await supabase
          .from('pages')
          .select('*', { count: 'exact', head: true });

        if (pagesError) throw pagesError;

        // Fetch all subscribers count
        const { count: subscribersCount, error: subscribersError } = await supabase
          .from('subscribers')
          .select('*', { count: 'exact', head: true });

        if (subscribersError) throw subscribersError;

        // Calculate plan breakdown
        const planBreakdown = {
          free: profiles?.filter(p => p.plan === 'free').length || 0,
          pro: profiles?.filter(p => p.plan === 'pro').length || 0,
          business: profiles?.filter(p => p.plan === 'business').length || 0,
        };

        setStats({
          totalUsers: profiles?.length || 0,
          totalPages: pagesCount || 0,
          totalSubscribers: subscribersCount || 0,
          planBreakdown,
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  if (authLoading || isLoading) {
    return (
      <DashboardLayout title="Admin Panel" description="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <DashboardLayout
      title="Admin Panel"
      description="Platform-wide statistics and management."
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title="Total Pages"
          value={stats?.totalPages || 0}
          icon={<FileText className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title="Total Subscribers"
          value={stats?.totalSubscribers || 0}
          icon={<UserCheck className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title="Pro/Business Users"
          value={(stats?.planBreakdown.pro || 0) + (stats?.planBreakdown.business || 0)}
          icon={<Crown className="h-5 w-5 text-warning" />}
        />
      </div>

      {/* Plan Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border bg-muted/50 text-center">
              <p className="text-4xl font-bold mb-2">{stats?.planBreakdown.free || 0}</p>
              <p className="text-muted-foreground">Free Users</p>
            </div>
            <div className="p-6 rounded-lg border bg-primary/5 text-center">
              <p className="text-4xl font-bold text-primary mb-2">{stats?.planBreakdown.pro || 0}</p>
              <p className="text-muted-foreground">Pro Users</p>
            </div>
            <div className="p-6 rounded-lg border bg-accent/5 text-center">
              <p className="text-4xl font-bold text-accent mb-2">{stats?.planBreakdown.business || 0}</p>
              <p className="text-muted-foreground">Business Users</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
