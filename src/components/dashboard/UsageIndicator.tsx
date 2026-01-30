import { usePlanLimits } from '@/hooks/usePlanLimits';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, Zap, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function UsageIndicator() {
  const navigate = useNavigate();
  const {
    currentPlan,
    limits,
    usage,
    pagesRemaining,
    subscribersRemaining,
    isAtPageLimit,
    isAtSubscriberLimit,
  } = usePlanLimits();

  const pagePercentage = limits.maxPages
    ? Math.min((usage.pages / limits.maxPages) * 100, 100)
    : 0;

  const subscriberPercentage = limits.maxSubscribers
    ? Math.min((usage.subscribers / limits.maxSubscribers) * 100, 100)
    : 0;

  const isNearPageLimit = limits.maxPages && pagesRemaining !== null && pagesRemaining <= 0;
  const isNearSubscriberLimit = limits.maxSubscribers && subscribersRemaining !== null && subscribersRemaining <= Math.ceil(limits.maxSubscribers * 0.1);

  const showUpgradePrompt = currentPlan === 'free' && (isNearPageLimit || isNearSubscriberLimit);

  return (
    <Card className="rounded-xl sm:rounded-2xl border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6 sm:pb-2">
        <div>
          <CardTitle className="text-base sm:text-lg font-semibold">Plan Usage</CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 capitalize">
            {currentPlan} plan
          </p>
        </div>
        {showUpgradePrompt && (
          <Button
            size="sm"
            onClick={() => navigate('/pricing')}
            className="gap-1.5 rounded-lg text-xs"
          >
            <Zap className="h-3.5 w-3.5" />
            Upgrade
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-2 p-4 sm:p-6 sm:pt-2 space-y-4">
        {/* Pages Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Pages</span>
            </div>
            <span className={cn(
              "text-xs",
              isAtPageLimit ? "text-destructive font-medium" : "text-muted-foreground"
            )}>
              {usage.pages} / {limits.maxPages ?? '∞'}
            </span>
          </div>
          {limits.maxPages && (
            <div className="relative">
              <Progress
                value={pagePercentage}
                className={cn(
                  "h-2 rounded-full",
                  isAtPageLimit && "[&>div]:bg-destructive"
                )}
              />
              {isAtPageLimit && (
                <div className="flex items-center gap-1 mt-1.5 text-xs text-destructive">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Limit reached</span>
                </div>
              )}
            </div>
          )}
          {!limits.maxPages && (
            <p className="text-xs text-muted-foreground">Unlimited pages</p>
          )}
        </div>

        {/* Subscribers Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Subscribers</span>
            </div>
            <span className={cn(
              "text-xs",
              isAtSubscriberLimit ? "text-destructive font-medium" : "text-muted-foreground"
            )}>
              {usage.subscribers.toLocaleString()} / {limits.maxSubscribers?.toLocaleString() ?? '∞'}
            </span>
          </div>
          {limits.maxSubscribers && (
            <div className="relative">
              <Progress
                value={subscriberPercentage}
                className={cn(
                  "h-2 rounded-full",
                  isAtSubscriberLimit && "[&>div]:bg-destructive"
                )}
              />
              {isAtSubscriberLimit && (
                <div className="flex items-center gap-1 mt-1.5 text-xs text-destructive">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Limit reached</span>
                </div>
              )}
            </div>
          )}
          {!limits.maxSubscribers && (
            <p className="text-xs text-muted-foreground">Unlimited subscribers</p>
          )}
        </div>

        {/* Feature badges */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex flex-wrap gap-1.5">
            {limits.canRemoveBranding && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                No Branding
              </span>
            )}
            {limits.canUseCustomDomain && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                Custom Domain
              </span>
            )}
            {limits.canAccessApi && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                API Access
              </span>
            )}
            {!limits.canRemoveBranding && !limits.canUseCustomDomain && !limits.canAccessApi && (
              <span className="text-[10px] text-muted-foreground">
                Upgrade to unlock more features
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
