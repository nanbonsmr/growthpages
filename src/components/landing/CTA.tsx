import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CTA() {
  const navigate = useNavigate();

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-primary" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--primary)/0.3)_100%)]" />
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }}
      />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center text-primary-foreground">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-8">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Join 10,000+ creators</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Ready to grow your audience?
          </h2>
          <p className="text-xl opacity-90 mb-10 leading-relaxed">
            Start building beautiful signup pages today. Free forever, no credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-white text-primary hover:bg-white/90 h-14 px-8 text-base font-semibold shadow-xl"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/contact')}
              className="border-white/30 text-white hover:bg-white/10 h-14 px-8 text-base font-semibold"
            >
              Talk to Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
