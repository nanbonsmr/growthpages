import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  Zap, 
  Layout, 
  BarChart3, 
  Users, 
  Palette, 
  Shield, 
  Globe, 
  Mail,
  MousePointer,
  Layers,
  Clock,
  Download
} from 'lucide-react';

const features = [
  {
    icon: Layout,
    title: 'Drag & Drop Editor',
    description: 'Build beautiful signup pages with our intuitive block-based editor. No coding required.',
  },
  {
    icon: Palette,
    title: 'Customizable Templates',
    description: 'Start with professionally designed templates and customize every detail to match your brand.',
  },
  {
    icon: MousePointer,
    title: 'High-Converting Forms',
    description: 'Optimized form designs that maximize signups with smart validation and error handling.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track page views, conversions, and subscriber growth with detailed analytics dashboards.',
  },
  {
    icon: Users,
    title: 'Subscriber Management',
    description: 'Organize subscribers with tags, filters, and export capabilities for easy list management.',
  },
  {
    icon: Mail,
    title: 'Email Integrations',
    description: 'Connect with popular email marketing tools to automatically sync your subscribers.',
  },
  {
    icon: Globe,
    title: 'Custom Domains',
    description: 'Use your own domain for a professional appearance that builds trust with visitors.',
  },
  {
    icon: Shield,
    title: 'GDPR Compliant',
    description: 'Built-in consent management and privacy features to keep you compliant with regulations.',
  },
  {
    icon: Layers,
    title: 'Multiple Pages',
    description: 'Create unlimited landing pages for different campaigns, products, or audiences.',
  },
  {
    icon: Clock,
    title: 'Countdown Timers',
    description: 'Create urgency with customizable countdown timers for launches and events.',
  },
  {
    icon: Download,
    title: 'Lead Magnets',
    description: 'Deliver digital downloads automatically when visitors subscribe to your list.',
  },
  {
    icon: Zap,
    title: 'Instant Publishing',
    description: 'Go live in seconds with one-click publishing. No technical setup required.',
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to{' '}
              <span className="text-gradient">Capture Leads</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Powerful features designed to help you build high-converting signup pages and grow your audience faster.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
