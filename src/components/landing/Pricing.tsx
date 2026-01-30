import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    period: 'per month',
    description: 'For growing creators',
    features: [
      'Unlimited signup pages',
      'Up to 10,000 subscribers',
      'All premium templates',
      'Remove LeadCapture branding',
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
    period: 'per month',
    description: 'For teams and agencies',
    features: [
      'Everything in Pro',
      'Unlimited subscribers',
      'Custom domain support',
      'Team members access',
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
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Simple,{' '}
            <span className="gradient-text">transparent pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Start free and upgrade as you grow. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative p-8 rounded-2xl border ${
                plan.popular 
                  ? 'border-primary shadow-glow' 
                  : 'border-border/50'
              } bg-card`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full text-sm font-medium gradient-primary text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${plan.popular ? 'gradient-primary' : ''}`}
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
