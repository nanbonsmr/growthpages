import { CreditCard, RefreshCw, ArrowUpCircle, Shield } from 'lucide-react';

const steps = [
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: 'Choose Your Plan',
    description:
      'Select the plan that fits your needs. Start with Free and upgrade anytime as your audience grows.',
  },
  {
    icon: <RefreshCw className="h-6 w-6" />,
    title: 'Pay Monthly',
    description:
      'Simple monthly billing with no long-term contracts. Your subscription renews automatically each month.',
  },
  {
    icon: <ArrowUpCircle className="h-6 w-6" />,
    title: 'Upgrade Anytime',
    description:
      'Need more features? Upgrade your plan instantly and unlock more pages, subscribers, and advanced tools.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Cancel Anytime',
    description:
      'No hidden fees or penalties. Cancel your subscription with one click, and keep access until the end of your billing period.',
  },
];

export function HowPricingWorks() {
  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How pricing <span className="gradient-text">works</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            You only pay for the plan you choose. Upgrade anytime to unlock more
            pages, subscribers, and advanced features.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`relative p-6 rounded-2xl bg-card border border-border/50 transition-all duration-300 hover:border-border hover:shadow-lg animate-fade-in stagger-${index + 1}`}
            >
              {/* Step number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
