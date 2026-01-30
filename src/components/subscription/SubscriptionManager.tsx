import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, Zap, Building2, CreditCard, Calendar, AlertTriangle, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const planDetails = {
  free: {
    name: 'Free',
    icon: Zap,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
  pro: {
    name: 'Pro',
    icon: Crown,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  business: {
    name: 'Business',
    icon: Building2,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
};

export function SubscriptionManager() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { subscription, isLoading, createCheckout, isCreatingCheckout, cancelSubscription, isCanceling } = useSubscription();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const currentPlanId = subscription?.status === 'active' ? subscription.plan_id : (profile?.plan || 'free');
  const plan = planDetails[currentPlanId as keyof typeof planDetails] || planDetails.free;
  const PlanIcon = plan.icon;

  const isActive = subscription?.status === 'active';
  const isCancelScheduled = subscription?.cancel_at_period_end;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Subscription & Billing
        </CardTitle>
        <CardDescription>
          Manage your subscription plan and billing information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50">
          <div className="flex items-center gap-4">
            <div className={cn('p-3 rounded-xl', plan.bgColor)}>
              <PlanIcon className={cn('h-6 w-6', plan.color)} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{plan.name} Plan</h3>
                {isActive && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    Active
                  </Badge>
                )}
                {isCancelScheduled && (
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                    Cancels Soon
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {currentPlanId === 'free' 
                  ? 'Limited features and 1 page'
                  : currentPlanId === 'pro'
                  ? 'Unlimited pages, 30k subscribers'
                  : 'Unlimited everything + team access'}
              </p>
            </div>
          </div>
          
          {currentPlanId === 'free' ? (
            <Button 
              className="gradient-primary"
              onClick={() => navigate('/pricing')}
            >
              Upgrade Plan
            </Button>
          ) : (
            <Button 
              variant="outline"
              onClick={() => navigate('/pricing')}
            >
              Change Plan
            </Button>
          )}
        </div>

        {/* Billing Period */}
        {subscription && isActive && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Billing Period
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-1">Current Period Started</p>
                  <p className="font-medium">
                    {subscription.current_period_start 
                      ? format(new Date(subscription.current_period_start), 'MMM d, yyyy')
                      : 'N/A'}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-1">Next Billing Date</p>
                  <p className="font-medium">
                    {subscription.current_period_end 
                      ? format(new Date(subscription.current_period_end), 'MMM d, yyyy')
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {isCancelScheduled && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-warning">Subscription Cancellation Scheduled</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your subscription will remain active until{' '}
                      {subscription.current_period_end 
                        ? format(new Date(subscription.current_period_end), 'MMMM d, yyyy')
                        : 'the end of your billing period'}
                      . After that, you'll be downgraded to the Free plan.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Cancel Subscription */}
        {subscription && isActive && !isCancelScheduled && (
          <>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Cancel Subscription</h4>
                <p className="text-sm text-muted-foreground">
                  You'll retain access until the end of your billing period
                </p>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-destructive hover:text-destructive">
                    Cancel Plan
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel your subscription?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Your subscription will remain active until{' '}
                      <strong>
                        {subscription.current_period_end 
                          ? format(new Date(subscription.current_period_end), 'MMMM d, yyyy')
                          : 'the end of your billing period'}
                      </strong>
                      . After that, you'll be downgraded to the Free plan with limited features.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => cancelSubscription()}
                      disabled={isCanceling}
                    >
                      {isCanceling ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Canceling...
                        </>
                      ) : (
                        'Yes, Cancel'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}

        {/* No active subscription */}
        {!subscription && currentPlanId === 'free' && (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Upgrade to unlock unlimited pages, more subscribers, and premium features.
            </p>
            <Button 
              className="gradient-primary"
              onClick={() => navigate('/pricing')}
            >
              View Plans
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
