import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, TrendingUp, Zap, Star, Circle, Triangle, Square } from 'lucide-react';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0 -z-10">
        {/* Primary mesh gradients */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/30 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] bg-accent/25 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-[20%] right-[10%] w-[35%] h-[35%] bg-accent/20 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
        </div>
        
        {/* Mesh grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Radial fade */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        {/* Large floating shapes */}
        <div className="absolute top-[15%] left-[10%] animate-float" style={{ animationDelay: '0s', animationDuration: '8s' }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/10 rotate-12" />
        </div>
        
        <div className="absolute top-[25%] right-[15%] animate-float" style={{ animationDelay: '1s', animationDuration: '7s' }}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/15 to-primary/15 backdrop-blur-sm border border-accent/10" />
        </div>
        
        <div className="absolute bottom-[30%] left-[8%] animate-float" style={{ animationDelay: '2s', animationDuration: '9s' }}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/25 to-transparent backdrop-blur-sm border border-primary/15 -rotate-12" />
        </div>
        
        <div className="absolute bottom-[20%] right-[12%] animate-float" style={{ animationDelay: '0.5s', animationDuration: '6s' }}>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/10 backdrop-blur-sm border border-accent/10 rotate-45" />
        </div>

        {/* Floating icons */}
        <div className="absolute top-[20%] left-[25%] animate-float" style={{ animationDelay: '1.5s', animationDuration: '10s' }}>
          <div className="p-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-soft">
            <Zap className="w-5 h-5 text-warning" />
          </div>
        </div>
        
        <div className="absolute top-[35%] right-[25%] animate-float" style={{ animationDelay: '2.5s', animationDuration: '8s' }}>
          <div className="p-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-soft">
            <Star className="w-5 h-5 text-primary" />
          </div>
        </div>
        
        <div className="absolute bottom-[35%] left-[18%] animate-float" style={{ animationDelay: '0.8s', animationDuration: '11s' }}>
          <div className="p-2.5 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-soft">
            <Circle className="w-4 h-4 text-accent" />
          </div>
        </div>
        
        <div className="absolute bottom-[25%] right-[22%] animate-float" style={{ animationDelay: '3s', animationDuration: '7s' }}>
          <div className="p-2.5 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-soft">
            <Triangle className="w-4 h-4 text-success" />
          </div>
        </div>

        {/* Small decorative dots */}
        <div className="absolute top-[40%] left-[5%] w-2 h-2 rounded-full bg-primary/40 animate-pulse-slow" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[15%] right-[30%] w-3 h-3 rounded-full bg-accent/30 animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[40%] right-[5%] w-2.5 h-2.5 rounded-full bg-primary/35 animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[15%] left-[35%] w-2 h-2 rounded-full bg-accent/40 animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-muted/50 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Trusted by 10,000+ creators worldwide</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-up">
            Capture leads with{' '}
            <span className="gradient-text">beautiful</span>{' '}
            signup pages
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Create stunning newsletter, waitlist, and event registration pages in minutes. 
            Share on social media and watch your audience grow.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              className="gradient-primary h-12 px-8 text-lg shadow-glow hover:shadow-glow-lg transition-shadow"
            >
              Start for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/pricing')}
              className="h-12 px-8 text-lg"
            >
              View Pricing
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold">
                <Users className="h-6 w-6 text-primary" />
                50K+
              </div>
              <p className="text-sm text-muted-foreground mt-1">Active Users</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold">
                <TrendingUp className="h-6 w-6 text-success" />
                2M+
              </div>
              <p className="text-sm text-muted-foreground mt-1">Leads Captured</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">99.9%</div>
              <p className="text-sm text-muted-foreground mt-1">Uptime</p>
            </div>
          </div>
        </div>

        {/* Hero Image / Preview */}
        <div className="mt-20 max-w-5xl mx-auto animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="relative rounded-xl border border-border/50 bg-card shadow-soft-lg overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-5" />
            <div className="aspect-[16/9] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
                  <Sparkles className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Dashboard Preview</h3>
                <p className="text-muted-foreground">Your beautiful analytics dashboard awaits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
