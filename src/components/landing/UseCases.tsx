import { Newspaper, Rocket, Calendar, Package } from 'lucide-react';

const useCases = [
  {
    icon: Newspaper,
    title: 'Newsletter Creators',
    description: 'Build your email list with beautiful opt-in pages that convert visitors into subscribers.',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Rocket,
    title: 'Startup Founders',
    description: 'Launch waitlists for your next product and gauge interest before you build.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Calendar,
    title: 'Event Organizers',
    description: 'Collect RSVPs and registrations for webinars, workshops, and live events.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Package,
    title: 'Product Launches',
    description: 'Create buzz for your upcoming product with exclusive early access signups.',
    color: 'from-green-500 to-teal-500',
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Built for{' '}
            <span className="gradient-text">every use case</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Whether you're a solo creator or a growing business, LeadCapture adapts to your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {useCases.map((useCase, index) => (
            <div 
              key={useCase.title}
              className="relative group p-8 rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-soft-lg transition-all duration-300"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${useCase.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${useCase.color} flex items-center justify-center mb-6`}>
                <useCase.icon className="h-7 w-7 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
              <p className="text-muted-foreground">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
