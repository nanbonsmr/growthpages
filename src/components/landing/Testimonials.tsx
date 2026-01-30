import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "LeadCapture helped us grow our newsletter from 0 to 10,000 subscribers in just 3 months. The templates are gorgeous!",
    author: "Sarah Chen",
    role: "Creator, The Daily Spark",
    avatar: "SC",
  },
  {
    quote: "We used LeadCapture for our product launch waitlist and collected 5,000 signups before we even had a product. Game changer.",
    author: "Michael Torres",
    role: "Founder, Launchpad",
    avatar: "MT",
  },
  {
    quote: "The analytics dashboard is incredibly insightful. I can see exactly which channels drive the most signups.",
    author: "Emma Williams",
    role: "Marketing Lead, TechFlow",
    avatar: "EW",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Loved by{' '}
            <span className="gradient-text">thousands of creators</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            See what our users have to say about growing their audience with LeadCapture.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.author}
              className="p-6 rounded-xl border border-border/50 bg-card"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground mb-6">"{testimonial.quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.author}</p>
                  <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
