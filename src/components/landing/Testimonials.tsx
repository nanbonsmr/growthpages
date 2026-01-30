import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "LeadCapture helped us grow our newsletter from 0 to 10,000 subscribers in just 3 months. The templates are gorgeous and the analytics are incredibly insightful.",
    author: "Sarah Chen",
    role: "Creator, The Daily Spark",
    avatar: "SC",
    rating: 5,
  },
  {
    quote: "We used LeadCapture for our product launch waitlist and collected 5,000 signups before we even had a product. Absolute game changer for validating ideas.",
    author: "Michael Torres",
    role: "Founder, Launchpad",
    avatar: "MT",
    rating: 5,
  },
  {
    quote: "The simplicity is what sold me. I had my first signup page live in under 5 minutes. Now I use it for all my courses and workshops.",
    author: "Emma Williams",
    role: "Course Creator",
    avatar: "EW",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="section-padding bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium mb-4">
            <Star className="h-4 w-4 fill-warning" />
            Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Loved by{' '}
            <span className="text-gradient">thousands of creators</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            See what our users have to say about growing their audience with LeadCapture.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.author}
              className="group relative p-8 rounded-2xl border border-border/50 bg-card hover:border-border transition-all duration-300 card-hover"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 -left-2 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Quote className="h-5 w-5 text-primary" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-foreground mb-8 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold shadow-lg shadow-primary/20">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
