import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UsageIndicator } from '@/components/dashboard/UsageIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePages } from '@/hooks/usePages';
import { useSubscribers } from '@/hooks/useSubscribers';
import { FileText, Users, TrendingUp, Star, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';

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
        date: format(date, 'EEE'),
        fullDate: format(date, 'MMM dd'),
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <StatsCard
          title="Total Pages"
          value={isLoading ? '—' : totalPages}
          icon={<FileText className="h-5 w-5" />}
          subtitle="Active signup pages"
        />
        <StatsCard
          title="Total Subscribers"
          value={isLoading ? '—' : totalSubscribers}
          icon={<Users className="h-5 w-5" />}
          trend={totalSubscribers > 0 ? { value: 12, positive: true } : undefined}
        />
        <StatsCard
          title="Last 7 Days"
          value={isLoading ? '—' : recentSubscribers}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={recentSubscribers > 0 ? { value: 8, positive: true } : undefined}
        />
        <StatsCard
          title="Best Performer"
          value={isLoading ? '—' : (bestPage?.title?.slice(0, 12) || 'N/A')}
          icon={<Star className="h-5 w-5" />}
          subtitle={bestPage ? `${pageSubscriberCount[bestPage.id] || 0} subscribers` : undefined}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Chart Card */}
        <Card className="lg:col-span-2 rounded-xl sm:rounded-2xl border-border/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6 sm:pb-2">
            <div>
              <CardTitle className="text-base sm:text-lg font-semibold">Subscriber Growth</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Daily new signups this week</p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-4 p-4 sm:p-6 sm:pt-4">
            <div className="h-[200px] sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSubscribers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="hsl(var(--border))" 
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    dx={-5}
                    width={25}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      padding: '8px 12px',
                      fontSize: '12px',
                    }}
                    labelFormatter={(_, payload) => payload[0]?.payload?.fullDate}
                    formatter={(value: number) => [`${value} subscribers`, 'Signups']}
                  />
                  <Area
                    type="monotone"
                    dataKey="subscribers"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#colorSubscribers)"
                    dot={false}
                    activeDot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card className="rounded-xl sm:rounded-2xl border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6 sm:pb-2">
            <div>
              <CardTitle className="text-base sm:text-lg font-semibold">Recent Signups</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Latest subscriber activity</p>
            </div>
          </CardHeader>
          <CardContent className="pt-2 p-4 sm:p-6 sm:pt-2">
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center mb-2 sm:mb-3">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">No signups yet</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {recentActivity.map((sub, index) => (
                  <div
                    key={sub.id}
                    className="flex items-center gap-2.5 sm:gap-3 group animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-medium text-xs sm:text-sm flex-shrink-0">
                      {sub.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">{sub.name}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{sub.email}</p>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Usage Indicator */}
        <UsageIndicator />
      </div>
    </DashboardLayout>
  );
}
