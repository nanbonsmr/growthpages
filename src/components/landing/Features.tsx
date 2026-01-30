import { 
  Palette, 
  Zap, 
  BarChart3, 
  Users, 
  Globe, 
  Shield,
  Layers,
  Download
} from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'Beautiful Templates',
    description: 'Start with stunning pre-built templates designed to convert visitors into subscribers.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Create and publish signup pages in under 2 minutes with our intuitive drag-and-drop builder.',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Track signups, conversion rates, and audience growth with beautiful dashboards.',
  },
  {
    icon: Users,
    title: 'Subscriber Management',
    description: 'Organize your audience with tags, filters, segments, and easy CSV exports.',
  },
  {
    icon: Globe,
    title: 'Custom Domains',
    description: 'Use your own domain for a fully branded experience that builds trust.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption and GDPR compliance to protect your data.',
  },
];

export function Features() {
  return (
    <section id="features" className="section-padding bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 dot-pattern opacity-50" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Layers className="h-4 w-4" />
            Features
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Everything you need to{' '}
            <span className="text-gradient">grow your audience</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Powerful features designed for creators, businesses, and startups who want to capture leads effortlessly.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group p-8 rounded-2xl border border-border/50 bg-card hover:bg-card/80 hover:border-border transition-all duration-300 card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
