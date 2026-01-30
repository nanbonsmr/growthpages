import { 
  Palette, 
  Zap, 
  BarChart3, 
  Users, 
  Globe, 
  Shield,
  Smartphone,
  Download
} from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'Beautiful Templates',
    description: 'Choose from stunning pre-built templates for newsletters, waitlists, events, and more.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Create and publish signup pages in under 2 minutes with our intuitive builder.',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Track signups, conversion rates, and growth with detailed analytics dashboards.',
  },
  {
    icon: Users,
    title: 'Subscriber Management',
    description: 'Manage your growing audience with tags, filters, and easy CSV exports.',
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
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Every page looks perfect on any device, automatically responsive.',
  },
  {
    icon: Download,
    title: 'Easy Exports',
    description: 'Export your subscribers anytime to CSV or integrate with your favorite tools.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything you need to{' '}
            <span className="gradient-text">grow your audience</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features designed to help creators, businesses, and startups capture leads effortlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group p-6 rounded-xl border border-border/50 bg-card hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
