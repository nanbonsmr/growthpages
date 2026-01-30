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
  Megaphone
} from 'lucide-react';

const useCases = [
  {
    icon: Mail,
    title: 'Newsletter Signups',
    description: 'Build a loyal audience with beautiful newsletter signup pages. Collect emails and grow your subscriber base with high-converting forms.',
    features: ['Custom branding', 'Double opt-in', 'Welcome emails', 'Analytics'],
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    icon: Clock,
    title: 'Waitlists',
    description: 'Generate buzz for upcoming products or services. Let customers join your waitlist and be the first to know when you launch.',
    features: ['Position tracking', 'Referral bonuses', 'Priority access', 'Launch notifications'],
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    icon: Calendar,
    title: 'Event Registration',
    description: 'Collect registrations for webinars, workshops, and live events. Manage attendees and send automated reminders.',
    features: ['Calendar integration', 'Reminder emails', 'Attendee management', 'Capacity limits'],
    color: 'bg-green-500/10 text-green-500',
  },
  {
    icon: Rocket,
    title: 'Product Launches',
    description: 'Build anticipation for your next big release. Create countdown pages that capture leads and build excitement.',
    features: ['Countdown timers', 'Early access', 'VIP lists', 'Launch day alerts'],
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    icon: BookOpen,
    title: 'Lead Magnets',
    description: 'Offer free resources in exchange for email addresses. Deliver ebooks, guides, templates, and more automatically.',
    features: ['Instant delivery', 'File hosting', 'Download tracking', 'Multiple formats'],
    color: 'bg-pink-500/10 text-pink-500',
  },
  {
    icon: Users,
    title: 'Community Building',
    description: 'Grow your community with dedicated signup pages. Collect member information and onboard new members seamlessly.',
    features: ['Member profiles', 'Interest tagging', 'Community updates', 'Engagement tracking'],
    color: 'bg-cyan-500/10 text-cyan-500',
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce Launches',
    description: 'Build hype for new product drops. Capture interested buyers and notify them the moment products go live.',
    features: ['Product previews', 'VIP access', 'Stock alerts', 'Exclusive discounts'],
    color: 'bg-amber-500/10 text-amber-500',
  },
  {
    icon: Megaphone,
    title: 'Marketing Campaigns',
    description: 'Create targeted landing pages for specific campaigns. Track performance and optimize for conversions.',
    features: ['A/B testing', 'UTM tracking', 'Campaign analytics', 'Audience segmentation'],
    color: 'bg-red-500/10 text-red-500',
  },
];

export default function UseCasesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Built for <span className="text-gradient">Every Use Case</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Whether you're launching a product, growing a newsletter, or building a community, LeadCapture has you covered.
            </p>
          </div>
        </section>

        {/* Use Cases Grid */}
        <section className="container mx-auto px-4 mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="group p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${useCase.color} mb-6`}>
                  <useCase.icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-muted-foreground mb-6">{useCase.description}</p>
                <div className="flex flex-wrap gap-2">
                  {useCase.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4">
          <div className="text-center py-16 px-8 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Create your first signup page in minutes. No credit card required.
            </p>
            <Button size="lg" className="gradient-primary" onClick={() => navigate('/signup')}>
              Start Building for Free
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
