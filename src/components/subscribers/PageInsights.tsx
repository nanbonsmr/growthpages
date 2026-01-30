import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Subscriber } from '@/hooks/useSubscribers';
import { BarChart3 } from 'lucide-react';

interface PageInsightsProps {
  subscribers: Subscriber[];
  pages: { id: string; title: string }[];
}

export function PageInsights({ subscribers, pages }: PageInsightsProps) {
  // Calculate subscribers per page
  const pageStats = pages.map((page) => {
    const count = subscribers.filter(s => s.page_id === page.id).length;
    return { ...page, count };
  }).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...pageStats.map(p => p.count), 1);

  if (pageStats.length === 0) {
    return null;
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          Page Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pageStats.slice(0, 5).map((page) => (
          <div key={page.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium truncate max-w-[180px]">{page.title}</span>
              <span className="text-muted-foreground shrink-0 ml-2">{page.count}</span>
            </div>
            <Progress 
              value={(page.count / maxCount) * 100} 
              className="h-2"
            />
          </div>
        ))}
        {pageStats.length > 5 && (
          <p className="text-xs text-muted-foreground text-center pt-2">
            +{pageStats.length - 5} more pages
          </p>
        )}
      </CardContent>
    </Card>
  );
}
