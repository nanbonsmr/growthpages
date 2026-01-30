import { Card, CardContent } from '@/components/ui/card';
import { Users, UserPlus, TrendingUp, Star } from 'lucide-react';
import { Subscriber } from '@/hooks/useSubscribers';
import { subDays, isAfter } from 'date-fns';

interface SubscriberStatsProps {
  subscribers: Subscriber[];
  pages: { id: string; title: string }[];
}

export function SubscriberStats({ subscribers, pages }: SubscriberStatsProps) {
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);
  const fourteenDaysAgo = subDays(now, 14);

  // Total subscribers
  const totalSubscribers = subscribers.length;

  // New subscribers in last 7 days
  const newSubscribers = subscribers.filter(s => 
    isAfter(new Date(s.created_at), sevenDaysAgo)
  ).length;

  // Subscribers from 7-14 days ago (for growth comparison)
  const previousWeekSubscribers = subscribers.filter(s => {
    const date = new Date(s.created_at);
    return isAfter(date, fourteenDaysAgo) && !isAfter(date, sevenDaysAgo);
  }).length;

  // Growth percentage
  const growthPercentage = previousWeekSubscribers === 0 
    ? (newSubscribers > 0 ? 100 : 0)
    : Math.round(((newSubscribers - previousWeekSubscribers) / previousWeekSubscribers) * 100);

  // Best performing page
  const pageSubscriberCounts = subscribers.reduce((acc, s) => {
    acc[s.page_id] = (acc[s.page_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const bestPageId = Object.entries(pageSubscriberCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0];
  
  const bestPage = pages.find(p => p.id === bestPageId);

  const stats = [
    {
      title: 'Total Subscribers',
      value: totalSubscribers.toLocaleString(),
      icon: Users,
      description: 'All time subscribers',
      trend: null,
    },
    {
      title: 'New This Week',
      value: newSubscribers.toLocaleString(),
      icon: UserPlus,
      description: 'Last 7 days',
      trend: null,
    },
    {
      title: 'Weekly Growth',
      value: `${growthPercentage >= 0 ? '+' : ''}${growthPercentage}%`,
      icon: TrendingUp,
      description: 'vs. previous week',
      trend: growthPercentage >= 0 ? 'up' : 'down',
    },
    {
      title: 'Top Performing Page',
      value: bestPage?.title || 'N/A',
      icon: Star,
      description: bestPageId ? `${pageSubscriberCounts[bestPageId]} subscribers` : 'No data yet',
      trend: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{stat.title}</p>
                <p className={`text-lg sm:text-2xl font-bold tracking-tight truncate ${
                  stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 
                  stat.trend === 'down' ? 'text-red-600 dark:text-red-400' : ''
                }`}>
                  {stat.value}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{stat.description}</p>
              </div>
              <div className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0 ${
                stat.trend === 'up' ? 'bg-green-100 dark:bg-green-900/30' :
                stat.trend === 'down' ? 'bg-red-100 dark:bg-red-900/30' :
                'bg-primary/10'
              }`}>
                <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${
                  stat.trend === 'up' ? 'text-green-600 dark:text-green-400' :
                  stat.trend === 'down' ? 'text-red-600 dark:text-red-400' :
                  'text-primary'
                }`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
