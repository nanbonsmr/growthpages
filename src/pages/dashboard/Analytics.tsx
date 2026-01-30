import { useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePages } from '@/hooks/usePages';
import { useSubscribers } from '@/hooks/useSubscribers';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { TrendingUp, Users, Target, Zap } from 'lucide-react';

const COLORS = ['hsl(239, 84%, 67%)', 'hsl(262, 83%, 58%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)'];

export default function Analytics() {
  const { pages } = usePages();
  const { subscribers } = useSubscribers();

  // Daily signups for last 30 days
  const dailyData = useMemo(() => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
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

  // Page performance
  const pagePerformance = useMemo(() => {
    return pages.map(page => {
      const count = subscribers.filter(s => s.page_id === page.id).length;
      return {
        name: page.title.slice(0, 20),
        subscribers: count,
      };
    }).sort((a, b) => b.subscribers - a.subscribers);
  }, [pages, subscribers]);

  // Template distribution
  const templateDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    pages.forEach(page => {
      counts[page.template] = (counts[page.template] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.replace('_', ' '),
      value,
    }));
  }, [pages]);

  // Key metrics
  const totalSubscribers = subscribers.length;
  const last7DaysSubscribers = subscribers.filter(
    s => new Date(s.created_at) >= subDays(new Date(), 7)
  ).length;
  const avgPerDay = totalSubscribers > 0 ? (totalSubscribers / 30).toFixed(1) : '0';
  const conversionRate = pages.length > 0 
    ? ((totalSubscribers / pages.length) * 10).toFixed(1) 
    : '0';

  return (
    <DashboardLayout
      title="Analytics"
      description="Track your signup performance and growth metrics."
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-lg bg-primary/10">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Subscribers</p>
                <p className="text-lg sm:text-2xl font-bold">{totalSubscribers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-lg bg-success/10">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Last 7 Days</p>
                <p className="text-lg sm:text-2xl font-bold">{last7DaysSubscribers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-lg bg-warning/10">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-warning" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Avg/Day</p>
                <p className="text-lg sm:text-2xl font-bold">{avgPerDay}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-lg bg-accent/10">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Subs/Page</p>
                <p className="text-lg sm:text-2xl font-bold">{conversionRate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Daily Signups */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Daily Signups (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                    width={30}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.5rem',
                      fontSize: '12px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="subscribers" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Page Performance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Page Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] sm:h-[300px]">
              {pagePerformance.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  No pages created yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pagePerformance.slice(0, 5)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" className="text-xs fill-muted-foreground" tick={{ fontSize: 10 }} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      className="text-xs fill-muted-foreground"
                      width={60}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.5rem',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="subscribers" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Template Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Template Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] sm:h-[250px]">
            {templateDistribution.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No pages created yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={templateDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ strokeWidth: 1 }}
                  >
                    {templateDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
