import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Zap, Crown, Building2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Plan {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: number;
  priceDisplay: string;
  period: string;
  tagline: string;
  features: string[];
  limits: {
    pages: string;
    subscribers: string;
  };
  popular: boolean;
  ctaText: string;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    icon: <Zap className="h-5 w-5" />,
    price: 0,
    priceDisplay: '$0',
    period: 'forever',
    tagline: 'Perfect for getting started',
    features: [
      '1 signup page',
      'Up to 100 subscribers',
      'Basic templates',
      'Email support',
      'LeadCapture branding',
    ],
    limits: {
      pages: '1 page',
      subscribers: '100 subscribers',
    },
    popular: false,
    ctaText: 'Get Started Free',
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: <Crown className="h-5 w-5" />,
    price: 12,
    priceDisplay: '$12',
    period: 'per month',
    tagline: 'For growing creators & teams',
    features: [
      'Unlimited signup pages',
      'Up to 30,000 subscribers',
      'All premium templates',
      'Remove LeadCapture branding',
      'Custom colors & fonts',
      'Advanced analytics',
      'Priority support',
    ],
    limits: {
      pages: 'Unlimited pages',
      subscribers: '30,000 subscribers',
    },
    popular: true,
    ctaText: 'Subscribe with Dodo',
  },
  {
    id: 'business',
    name: 'Business',
    icon: <Building2 className="h-5 w-5" />,
    price: 39,
    priceDisplay: '$39',
    period: 'per month',
    tagline: 'For agencies & enterprises',
    features: [
      'Everything in Pro',
      'Unlimited subscribers',
      'Custom domain support',
      'Team members access',
      'API access',
      'Dedicated account manager',
      'White-label solution',
      'SLA guarantee',
    ],
    limits: {
      pages: 'Unlimited pages',
      subscribers: 'Unlimited',
    },
    popular: false,
    ctaText: 'Subscribe with Dodo',
  },
];

interface PricingCardProps {
  plan: Plan;
  onSubscribe: (planId: string) => void;
  isLoading: boolean;
  currentPlan?: string;
  isLoggedIn: boolean;
}

function PricingCard({ plan, onSubscribe, isLoading, currentPlan, isLoggedIn }: PricingCardProps) {
  const isCurrentPlan = currentPlan === plan.id;
  
  return (
    <div
      className={cn(
        'relative flex flex-col p-6 sm:p-8 rounded-2xl border transition-all duration-300',
        'bg-card hover:-translate-y-1',
        plan.popular
          ? 'border-primary shadow-xl shadow-primary/10 scale-[1.02] z-10'
          : 'border-border/50 hover:border-border hover:shadow-lg',
        isCurrentPlan && 'ring-2 ring-success'
      )}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold gradient-primary text-primary-foreground shadow-lg">
            ✨ Most Popular
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-4 right-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success text-success-foreground shadow-lg">
            Current Plan
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-6">
        <div
          className={cn(
            'inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4',
            plan.popular
              ? 'gradient-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {plan.icon}
        </div>
        <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
        <p className="text-sm text-muted-foreground">{plan.tagline}</p>
      </div>

      {/* Price */}
      <div className="text-center mb-6 pb-6 border-b border-border/50">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl sm:text-5xl font-bold tracking-tight">
            {plan.priceDisplay}
          </span>
          <span className="text-muted-foreground text-sm">/{plan.period}</span>
        </div>
        {plan.price > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Billed monthly • Cancel anytime
          </p>
        )}
      </div>

      {/* Usage Limits Highlight */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-muted/50 text-center">
          <p className="text-xs text-muted-foreground mb-1">Pages</p>
          <p className="text-sm font-semibold">{plan.limits.pages}</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/50 text-center">
          <p className="text-xs text-muted-foreground mb-1">Subscribers</p>
          <p className="text-sm font-semibold">{plan.limits.subscribers}</p>
        </div>
      </div>

      {/* Features List */}
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/10 flex items-center justify-center mt-0.5">
              <Check className="h-3 w-3 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        className={cn(
          'w-full h-12 rounded-xl font-semibold transition-all duration-200',
          plan.popular
            ? 'gradient-primary btn-lift shadow-lg shadow-primary/20'
            : 'hover:bg-primary hover:text-primary-foreground'
        )}
        variant={plan.popular ? 'default' : 'outline'}
        onClick={() => onSubscribe(plan.id)}
        disabled={isLoading || isCurrentPlan}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : isCurrentPlan ? (
          'Current Plan'
        ) : !isLoggedIn && plan.price > 0 ? (
          'Sign up to Subscribe'
        ) : (
          plan.ctaText
        )}
      </Button>

      {/* Security note */}
      {plan.price > 0 && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          🔒 Secure payment via Dodo
        </p>
      )}
    </div>
  );
}

export function PricingCards() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription, createCheckout, isCreatingCheckout } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // Check for checkout success in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      const plan = params.get('plan');
      toast({
        title: '🎉 Payment Successful!',
        description: `Thank you! You are now subscribed to the ${plan?.charAt(0).toUpperCase()}${plan?.slice(1)} plan.`,
      });
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [toast]);

  const handleSubscribe = async (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    // Free plan - redirect to signup
    if (plan.price === 0) {
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/signup');
      }
      return;
    }

    // Paid plans - require login
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in or sign up to subscribe to a paid plan.',
      });
      navigate('/signup');
      return;
    }

    setLoadingPlan(planId);
    createCheckout(planId);
  };

  const currentPlan = subscription?.status === 'active' ? subscription.plan_id : 'free';

  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={cn('animate-fade-in', `stagger-${index + 1}`)}
            >
              <PricingCard
                plan={plan}
                onSubscribe={handleSubscribe}
                isLoading={isCreatingCheckout && loadingPlan === plan.id}
                currentPlan={currentPlan}
                isLoggedIn={!!user}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
