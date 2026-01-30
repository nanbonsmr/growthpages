import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  BarChart3, 
  Users, 
  Palette, 
  Shield, 
  Globe, 
  Zap,
  Download,
  Smartphone,
  Clock,
  Lock,
  Layers,
  ArrowRight,
  Check
} from 'lucide-react';

const features = [
  {
    icon: Layout,
    title: 'Drag & Drop Editor',
    description: 'Build beautiful signup pages with our intuitive block-based editor. No coding required.',
    category: 'Builder',
  },
  {
    icon: Palette,
    title: 'Premium Templates',
    description: 'Start with professionally designed templates for newsletters, waitlists, events, and more.',
    category: 'Design',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track page views, conversions, and subscriber growth with beautiful dashboards.',
    category: 'Analytics',
  },
  {
    icon: Users,
    title: 'Subscriber Management',
    description: 'Organize subscribers with tags, filters, and segments. Export anytime to CSV.',
    category: 'Management',
  },
  {
    icon: Globe,
    title: 'Custom Domains',
    description: 'Use your own domain for a professional appearance that builds trust with visitors.',
    category: 'Branding',
  },
  {
    icon: Shield,
    title: 'GDPR Compliant',
    description: 'Built-in consent management and privacy features to keep you compliant.',
    category: 'Security',
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Every page looks perfect on any device with automatic responsive design.',
    category: 'Design',
  },
  {
    icon: Clock,
    title: 'Countdown Timers',
    description: 'Create urgency with customizable countdown timers for launches and events.',
    category: 'Marketing',
  },
  {
    icon: Download,
    title: 'Lead Magnets',
    description: 'Deliver digital downloads automatically when visitors subscribe to your list.',
    category: 'Automation',
  },
  {
    icon: Zap,
    title: 'Instant Publishing',
    description: 'Go live in seconds with one-click publishing. No technical setup required.',
    category: 'Builder',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption protects your data and your subscribers.',
    category: 'Security',
  },
  {
    icon: Layers,
    title: 'Unlimited Pages',
    description: 'Create as many landing pages as you need for different campaigns.',
    category: 'Builder',
  },
];

const detailSections = [
  {
    title: 'Intuitive Page Builder',
    description: 'Create stunning signup pages without writing a single line of code. Our drag-and-drop editor makes it easy to customize every element.',
    features: ['Drag & drop interface', 'Real-time preview', '50+ UI components', 'Custom CSS support'],
    image: 'builder',
    reverse: false,
  },
  {
    title: 'Powerful Analytics Dashboard',
    description: 'Get actionable insights into your page performance. Track visitor behavior, conversion rates, and growth trends in real-time.',
    features: ['Conversion tracking', 'Traffic sources', 'Growth charts', 'A/B testing'],
    image: 'analytics',
    reverse: true,
  },
  {
    title: 'Complete Subscriber Management',
    description: 'Organize and manage your growing audience with powerful tools. Tag, segment, and export your subscribers with ease.',
    features: ['Smart tagging', 'Custom segments', 'Bulk actions', 'One-click export'],
    image: 'subscribers',
    reverse: false,
  },
];

export default function FeaturesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 gradient-mesh opacity-40" />
          <div className="absolute inset-0 grid-pattern" />
          
          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Layers className="h-4 w-4" />
                Features
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Everything you need to{' '}
                <span className="text-gradient">capture leads</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
                Powerful features designed to help you build high-converting signup pages and grow your audience faster.
              </p>
              <Button 
                size="lg"
                onClick={() => navigate('/signup')}
                className="gradient-primary h-14 px-8 text-base font-semibold btn-lift shadow-lg shadow-primary/25"
              >
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="section-padding bg-muted/30 relative">
          <div className="absolute inset-0 dot-pattern opacity-50" />
          
          <div className="container mx-auto px-4 relative">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group p-6 rounded-2xl border border-border/50 bg-card hover:border-border transition-all duration-300 card-hover"
                >
                  <div className="inline-flex px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground mb-4">
                    {feature.category}
                  </div>
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detail Sections */}
        <section className="section-padding">
          <div className="container mx-auto px-4">
            <div className="space-y-32">
              {detailSections.map((section, index) => (
                <div 
                  key={section.title}
                  className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${section.reverse ? 'lg:flex-row-reverse' : ''}`}
                >
                  {/* Content */}
                  <div className={section.reverse ? 'lg:order-2' : ''}>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                      {section.title}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                      {section.description}
                    </p>
                    <ul className="space-y-4">
                      {section.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                            <Check className="h-4 w-4 text-success" />
                          </div>
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Preview placeholder */}
                  <div className={section.reverse ? 'lg:order-1' : ''}>
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-2xl" />
                      <div className="relative rounded-2xl border border-border/50 bg-card shadow-premium-lg overflow-hidden">
                        <div className="aspect-[4/3] bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
                          <div className="text-center p-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
                              {index === 0 && <Layout className="h-8 w-8 text-primary-foreground" />}
                              {index === 1 && <BarChart3 className="h-8 w-8 text-primary-foreground" />}
                              {index === 2 && <Users className="h-8 w-8 text-primary-foreground" />}
                            </div>
                            <p className="text-muted-foreground">{section.title} Preview</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center py-16 px-8 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Ready to get started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Create your first signup page in minutes. Free forever, no credit card required.
              </p>
              <Button 
                size="lg" 
                className="gradient-primary h-14 px-8 font-semibold btn-lift shadow-lg shadow-primary/25"
                onClick={() => navigate('/signup')}
              >
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
