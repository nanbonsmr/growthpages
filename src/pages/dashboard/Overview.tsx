import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePages } from '@/hooks/usePages';
import { useSubscribers } from '@/hooks/useSubscribers';
import { FileText, Users, TrendingUp, Star, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { useMemo } from 'react';

export default function Overview() {
  const { pages, isLoading: pagesLoading } = usePages();
  const { subscribers, isLoading: subscribersLoading } = useSubscribers();

  // Calculate stats
  const totalPages = pages.length;
  const totalSubscribers = subscribers.length;

  // Subscribers in last 7 days
  const last7Days = subDays(new Date(), 7);
  const recentSubscribers = subscribers.filter(
    s => new Date(s.created_at) >= last7Days
  ).length;

  // Best performing page
  const pageSubscriberCount = useMemo(() => {
    const counts: Record<string, number> = {};
    subscribers.forEach(s => {
      counts[s.page_id] = (counts[s.page_id] || 0) + 1;
    });
    return counts;
  }, [subscribers]);

  const bestPage = pages.reduce((best, page) => {
    const count = pageSubscriberCount[page.id] || 0;
    if (!best || count > (pageSubscriberCount[best.id] || 0)) {
      return page;
    }
    return best;
  }, pages[0]);

  // Chart data - last 7 days
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = subscribers.filter(
        s => format(new Date(s.created_at), 'yyyy-MM-dd') === dateStr
      ).length;
      data.push({
        date: format(date, 'MMM dd'),
        subscribers: count,
      });
    }
    return data;
  }, [subscribers]);

  // Recent activity
  const recentActivity = subscribers.slice(0, 5);

  const isLoading = pagesLoading || subscribersLoading;

  return (
    <DashboardLayout
      title="Dashboard"
      description="Welcome back! Here's an overview of your LeadCapture performance."
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Pages"
          value={isLoading ? '...' : totalPages}
          icon={<FileText className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title="Total Subscribers"
          value={isLoading ? '...' : totalSubscribers}
          icon={<Users className="h-5 w-5 text-primary" />}
          trend={totalSubscribers > 0 ? { value: 12, positive: true } : undefined}
        />
        <StatsCard
          title="Last 7 Days"
          value={isLoading ? '...' : recentSubscribers}
          icon={<TrendingUp className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title="Best Page"
          value={isLoading ? '...' : (bestPage?.title?.slice(0, 15) || 'N/A')}
          icon={<Star className="h-5 w-5 text-primary" />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Subscriber Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="subscribers" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recent signups yet.</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                      {sub.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{sub.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{sub.email}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
