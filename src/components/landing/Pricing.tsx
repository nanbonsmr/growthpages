import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '1 signup page',
      'Up to 100 subscribers',
      'Basic templates',
      'Email support',
      'LeadCapture branding',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For growing creators',
    features: [
      'Unlimited signup pages',
      'Up to 30,000 subscribers',
      'All premium templates',
      'Remove branding',
      'Priority support',
      'Custom colors & fonts',
      'Advanced analytics',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Business',
    price: '$49',
    period: '/month',
    description: 'For teams and agencies',
    features: [
      'Everything in Pro',
      'Unlimited subscribers',
      'Custom domain support',
      'Team member access',
      'API access',
      'Dedicated support',
      'White-label solution',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export function Pricing() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Pricing
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Simple,{' '}
            <span className="text-gradient">transparent pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Start free and upgrade as you grow. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={cn(
                'relative p-8 rounded-2xl border bg-card transition-all duration-300',
                plan.popular 
                  ? 'border-primary shadow-lg shadow-primary/10 scale-[1.02]' 
                  : 'border-border/50 hover:border-border'
              )}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full text-sm font-semibold gradient-primary text-primary-foreground shadow-lg shadow-primary/25">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/10 flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={cn(
                  'w-full h-12 font-semibold',
                  plan.popular ? 'gradient-primary btn-lift shadow-lg shadow-primary/25' : ''
                )}
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => navigate('/signup')}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
