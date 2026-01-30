import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-primary opacity-95" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center text-primary-foreground">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to grow your audience?
          </h2>
          <p className="text-xl opacity-90 mb-10">
            Join thousands of creators and businesses already using LeadCapture to capture more leads.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-white text-primary hover:bg-white/90 h-12 px-8 text-lg"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/pricing')}
              className="border-white/30 text-white hover:bg-white/10 h-12 px-8 text-lg"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
