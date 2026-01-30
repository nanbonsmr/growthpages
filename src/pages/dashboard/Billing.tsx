import { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  CreditCard, 
  Crown, 
  Zap, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const planDetails = {
  free: {
    name: 'Free',
    icon: Zap,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    features: ['1 signup page', '100 subscribers', 'Basic templates'],
  },
  pro: {
    name: 'Pro',
    icon: Crown,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    features: ['Unlimited pages', '30,000 subscribers', 'Premium templates', 'No branding'],
  },
  business: {
    name: 'Business',
    icon: Building2,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    features: ['Everything in Pro', 'Unlimited subscribers', 'Custom domains', 'API access'],
  },
};

export default function Billing() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();
  const { 
    subscription, 
    isLoading, 
    createCheckout, 
    isCreatingCheckout,
    cancelSubscription,
    isCanceling 
  } = useSubscription();

  // Handle checkout success from URL
  useEffect(() => {
    if (searchParams.get('checkout') === 'success') {
      const plan = searchParams.get('plan');
      toast({
        title: '🎉 Payment Successful!',
        description: `Welcome to the ${plan?.charAt(0).toUpperCase()}${plan?.slice(1)} plan! Your subscription is now active.`,
      });
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard/billing');
    }
  }, [searchParams, toast]);

  const currentPlanId = subscription?.status === 'active' ? subscription.plan_id : 'free';
  const currentPlan = planDetails[currentPlanId as keyof typeof planDetails] || planDetails.free;
  const PlanIcon = currentPlan.icon;

  const handleUpgrade = (planId: string) => {
    createCheckout(planId);
  };

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription? You will retain access until the end of your billing period.')) {
      cancelSubscription();
    }
  };

  return (
    <DashboardLayout 
      title="Billing" 
      description="Manage your subscription and billing details"
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Current Plan Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Current Plan
                </CardTitle>
                <CardDescription>
                  Your active subscription and usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan Badge */}
                <div className="flex items-center gap-4">
                  <div className={cn('p-3 rounded-xl', currentPlan.bgColor)}>
                    <PlanIcon className={cn('h-6 w-6', currentPlan.color)} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{currentPlan.name} Plan</h3>
                      {subscription?.status === 'active' && (
                        <Badge variant="default" className="bg-success text-success-foreground">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                      {subscription?.status === 'past_due' && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Past Due
                        </Badge>
                      )}
                      {subscription?.cancel_at_period_end && (
                        <Badge variant="secondary">
                          Canceling
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {currentPlanId === 'free' 
                        ? 'Free forever' 
                        : `$${currentPlanId === 'pro' ? '12' : '39'}/month`}
                    </p>
                  </div>
                </div>

                {/* Billing Period */}
                {subscription?.current_period_end && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {subscription.cancel_at_period_end 
                          ? 'Access until' 
                          : 'Next billing date'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(subscription.current_period_end), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Plan Features */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Plan includes:</h4>
                  <ul className="space-y-2">
                    {currentPlan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {currentPlanId === 'free' && (
                    <Button 
                      onClick={() => navigate('/pricing')}
                      className="gradient-primary"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  )}
                  {currentPlanId !== 'free' && !subscription?.cancel_at_period_end && (
                    <Button 
                      variant="outline" 
                      onClick={handleCancelSubscription}
                      disabled={isCanceling}
                    >
                      {isCanceling ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Canceling...
                        </>
                      ) : (
                        'Cancel Subscription'
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Upgrade Card */}
            <div className="space-y-4">
              {currentPlanId !== 'business' && (
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Crown className="h-5 w-5 text-primary" />
                      {currentPlanId === 'free' ? 'Upgrade to Pro' : 'Upgrade to Business'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {currentPlanId === 'free' 
                        ? 'Unlock unlimited pages, premium templates, and remove branding.'
                        : 'Get unlimited subscribers, custom domains, and API access.'}
                    </p>
                    <Button 
                      className="w-full gradient-primary"
                      onClick={() => handleUpgrade(currentPlanId === 'free' ? 'pro' : 'business')}
                      disabled={isCreatingCheckout}
                    >
                      {isCreatingCheckout ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Upgrade Now
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Subscription ID for support */}
              {subscription?.dodo_subscription_id && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Subscription Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs font-mono text-muted-foreground break-all">
                      ID: {subscription.dodo_subscription_id}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
