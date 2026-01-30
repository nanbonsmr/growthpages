import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Check } from 'lucide-react';

const trustLogos = [
  'ProductHunt',
  'TechCrunch',
  'Forbes',
  'Wired',
  'FastCompany',
];

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient mesh */}
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern" />
        
        {/* Radial fade overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)]" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-[10%] w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/3 right-[10%] w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background/80 backdrop-blur-sm mb-8 animate-fade-in shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              Join 10,000+ creators growing their audience
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-up">
            Build landing pages that{' '}
            <span className="text-gradient">convert visitors</span>{' '}
            into subscribers
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Create beautiful signup pages for newsletters, waitlists, and events in minutes. 
            No code required. Just drag, drop, and publish.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              className="gradient-primary h-14 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all btn-lift"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/features')}
              className="h-14 px-8 text-base font-semibold bg-background/80 backdrop-blur-sm"
            >
              <Play className="mr-2 h-4 w-4" />
              View Demo
            </Button>
          </div>

          {/* Feature bullets */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: '0.3s' }}>
            {['Free forever plan', 'No credit card required', 'Setup in 2 minutes'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10">
                  <Check className="h-3 w-3 text-success" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-20 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-center text-sm text-muted-foreground mb-8">
            Trusted by innovative companies worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
            {trustLogos.map((logo) => (
              <div
                key={logo}
                className="text-lg font-semibold text-muted-foreground/80 tracking-tight"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>

        {/* Hero Preview */}
        <div className="mt-20 max-w-5xl mx-auto animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-50" />
            
            {/* Preview card */}
            <div className="relative rounded-2xl border border-border/50 bg-card shadow-premium-lg overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-background text-xs text-muted-foreground">
                    app.leadcapture.com/dashboard
                  </div>
                </div>
              </div>
              
              {/* Preview content */}
              <div className="aspect-[16/9] bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-6 shadow-lg shadow-primary/25">
                    <svg className="w-10 h-10 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Your Dashboard</h3>
                  <p className="text-muted-foreground">Track subscribers, analyze performance, and grow your audience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
