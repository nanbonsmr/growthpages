import { ArrowRight, FileEdit, Share2, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: FileEdit,
    title: 'Create Your Page',
    description: 'Choose a template and customize it with our intuitive drag-and-drop editor. No coding required.',
  },
  {
    number: '02',
    icon: Share2,
    title: 'Share Everywhere',
    description: 'Get a unique link to share on social media, in emails, or embed directly on your website.',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Grow Your Audience',
    description: 'Watch your subscriber list grow and track performance with real-time analytics.',
  },
];

export function HowItWorks() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            How it works
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Launch in{' '}
            <span className="text-gradient">three simple steps</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Get your signup page live in minutes, not hours. Here's how it works.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector line (hidden on mobile, last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-14 left-[60%] w-full h-px bg-gradient-to-r from-border to-transparent" />
                )}
                
                <div className="text-center">
                  {/* Step number */}
                  <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-br from-muted to-muted/50 border border-border/50 mb-8 relative group">
                    <span className="text-4xl font-bold text-gradient">{step.number}</span>
                    <div className="absolute inset-0 rounded-3xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary mb-6 shadow-lg shadow-primary/20">
                    <step.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
