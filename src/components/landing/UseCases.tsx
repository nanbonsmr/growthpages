import { Newspaper, Rocket, Calendar, Package, Briefcase, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const useCases = [
  {
    icon: Newspaper,
    title: 'Newsletter Creators',
    description: 'Build your email list with beautiful opt-in pages that convert visitors into loyal subscribers.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Rocket,
    title: 'Startup Founders',
    description: 'Launch waitlists for your next product and validate ideas before writing a single line of code.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Calendar,
    title: 'Event Organizers',
    description: 'Collect RSVPs and registrations for webinars, workshops, conferences, and live events.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Package,
    title: 'Product Launches',
    description: 'Create buzz for your upcoming product with exclusive early access and VIP signups.',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

export function UseCases() {
  const navigate = useNavigate();

  return (
    <section id="use-cases" className="section-padding relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
            <Briefcase className="h-4 w-4" />
            Use Cases
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Built for{' '}
            <span className="text-gradient">every use case</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Whether you're a solo creator or a growing business, LeadCapture adapts to your unique needs.
          </p>
        </div>

        {/* Use cases grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
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
              
              <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{useCase.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/use-cases')}
            className="font-semibold"
          >
            Explore all use cases
          </Button>
        </div>
      </div>
    </section>
  );
}
