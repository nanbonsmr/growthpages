import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Clock, 
  Calendar, 
  Rocket, 
  BookOpen,
  Users,
  ShoppingBag,
  Megaphone,
  Briefcase,
  ArrowRight,
  Quote,
  Star
} from 'lucide-react';

const useCases = [
  {
    icon: Mail,
    title: 'Newsletter Signups',
    description: 'Build a loyal audience with beautiful newsletter signup pages. Collect emails and grow your subscriber base with high-converting forms.',
    features: ['Custom branding', 'Double opt-in', 'Welcome emails', 'Subscriber analytics'],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Clock,
    title: 'Waitlists',
    description: 'Generate buzz for upcoming products or services. Let customers join your waitlist and be the first to know when you launch.',
    features: ['Position tracking', 'Referral bonuses', 'Priority access', 'Launch notifications'],
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Calendar,
    title: 'Event Registration',
    description: 'Collect registrations for webinars, workshops, and live events. Manage attendees and send automated reminders.',
    features: ['Calendar integration', 'Reminder emails', 'Attendee management', 'Capacity limits'],
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Rocket,
    title: 'Product Launches',
    description: 'Build anticipation for your next big release. Create countdown pages that capture leads and build excitement.',
    features: ['Countdown timers', 'Early access', 'VIP lists', 'Launch alerts'],
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: BookOpen,
    title: 'Lead Magnets',
    description: 'Offer free resources in exchange for email addresses. Deliver ebooks, guides, templates, and more automatically.',
    features: ['Instant delivery', 'File hosting', 'Download tracking', 'Multiple formats'],
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Users,
    title: 'Community Building',
    description: 'Grow your community with dedicated signup pages. Collect member information and onboard new members seamlessly.',
    features: ['Member profiles', 'Interest tagging', 'Community updates', 'Engagement tracking'],
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce Launches',
    description: 'Build hype for new product drops. Capture interested buyers and notify them the moment products go live.',
    features: ['Product previews', 'VIP access', 'Stock alerts', 'Exclusive discounts'],
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Megaphone,
    title: 'Marketing Campaigns',
    description: 'Create targeted landing pages for specific campaigns. Track performance and optimize for conversions.',
    features: ['A/B testing', 'UTM tracking', 'Campaign analytics', 'Audience segmentation'],
    gradient: 'from-red-500 to-pink-500',
  },
];

const successStories = [
  {
    quote: "We collected 15,000 waitlist signups in just 2 weeks before our launch. LeadCapture made it effortless.",
    author: "Alex Rivera",
    role: "Founder, TechStart",
    metric: "15,000",
    metricLabel: "Signups in 2 weeks",
  },
  {
    quote: "Our newsletter grew from 500 to 25,000 subscribers using LeadCapture's beautiful templates.",
    author: "Jamie Chen",
    role: "Creator, Daily Insights",
    metric: "50x",
    metricLabel: "Growth in 6 months",
  },
  {
    quote: "Event registration became so much easier. We now manage all our webinar signups through LeadCapture.",
    author: "Morgan Blake",
    role: "Events Lead, GrowthCo",
    metric: "200+",
    metricLabel: "Events hosted",
  },
];

export default function UseCasesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 gradient-mesh opacity-40" />
          <div className="absolute inset-0 grid-pattern" />
          
          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-6">
                <Briefcase className="h-4 w-4" />
                Use Cases
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Built for{' '}
                <span className="text-gradient">creators, startups, and businesses</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Whether you're launching a product, growing a newsletter, or building a community, LeadCapture has you covered.
              </p>
            </div>
          </div>
        </section>

        {/* Use Cases Grid */}
        <section className="section-padding bg-muted/30 relative">
          <div className="absolute inset-0 dot-pattern opacity-50" />
          
          <div className="container mx-auto px-4 relative">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {useCases.map((useCase, index) => (
                <div
                  key={useCase.title}
                  className="group relative p-8 rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300 card-hover"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${useCase.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <useCase.icon className="h-7 w-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-3">{useCase.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{useCase.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {useCase.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1.5 text-sm rounded-full bg-muted text-muted-foreground font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="section-padding relative">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning text-sm font-medium mb-6">
                <Star className="h-4 w-4 fill-warning" />
                Success Stories
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Real results from{' '}
                <span className="text-gradient">real users</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                See how businesses and creators are growing with LeadCapture.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {successStories.map((story) => (
                <div
                  key={story.author}
                  className="relative p-8 rounded-2xl border border-border/50 bg-card card-hover"
                >
                  {/* Metric */}
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-gradient mb-1">{story.metric}</div>
                    <div className="text-sm text-muted-foreground">{story.metricLabel}</div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-foreground mb-6 leading-relaxed">
                    "{story.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                      {story.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{story.author}</p>
                      <p className="text-muted-foreground text-sm">{story.role}</p>
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
