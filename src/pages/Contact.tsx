import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  MessageSquare, 
  HelpCircle, 
  Building, 
  Send,
  Clock,
  ChevronDown
} from 'lucide-react';
import { z } from 'zod';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  subject: z.string().trim().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters'),
});

const contactOptions = [
  {
    icon: HelpCircle,
    title: 'Support',
    description: 'Get help with your account',
    email: 'support@growthpages.com',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: MessageSquare,
    title: 'Sales',
    description: 'Learn about our plans',
    email: 'sales@growthpages.com',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Building,
    title: 'Partnerships',
    description: 'Explore opportunities',
    email: 'partners@growthpages.com',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

const faqs = [
  {
    question: "How quickly can I get started?",
    answer: "You can create your first signup page in under 2 minutes. Just sign up, choose a template, customize it, and publish. No technical skills required."
  },
  {
    question: "Can I use my own domain?",
    answer: "Yes! Pro and Business plans include custom domain support. You can connect your own domain for a fully branded experience."
  },
  {
    question: "What happens if I exceed my subscriber limit?",
    answer: "We'll notify you when you're approaching your limit. You can upgrade your plan anytime to accommodate more subscribers without losing any data."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund."
  },
  {
    question: "Can I export my subscribers?",
    answer: "Absolutely! You can export your subscriber list to CSV anytime. Your data is always yours."
  },
];

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Message sent!',
      description: "We'll get back to you as soon as possible.",
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 gradient-mesh opacity-40" />
          <div className="absolute inset-0 grid-pattern" />
          
          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Mail className="h-4 w-4" />
                Contact Us
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Get in <span className="text-gradient">touch</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Have a question or need help? We're here for you. Reach out and we'll respond as soon as we can.
              </p>
            </div>

            {/* Contact Options */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
              {contactOptions.map((option) => (
                <a
                  key={option.title}
                  href={`mailto:${option.email}`}
                  className="group p-6 rounded-2xl border border-border/50 bg-card hover:border-border transition-all duration-300 card-hover text-center"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${option.gradient} mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <option.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                  <span className="text-sm text-primary font-medium">{option.email}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="section-padding bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div>
                <div className="p-8 md:p-10 rounded-2xl border border-border/50 bg-card shadow-premium">
                  <h2 className="text-2xl font-bold mb-2">Send us a message</h2>
                  <p className="text-muted-foreground mb-8">Fill out the form and we'll get back to you within 24 hours.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          className={`h-12 ${errors.name ? 'border-destructive' : ''}`}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={`h-12 ${errors.email ? 'border-destructive' : ''}`}
                        />
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className={`h-12 ${errors.subject ? 'border-destructive' : ''}`}
                      />
                      {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        className={errors.message ? 'border-destructive' : ''}
                      />
                      {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 gradient-primary font-semibold btn-lift" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>

              {/* FAQ Section */}
              <div>
                <h2 className="text-2xl font-bold mb-2">Frequently asked questions</h2>
                <p className="text-muted-foreground mb-8">Find quick answers to common questions.</p>
                
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${index}`}
                      className="rounded-xl border border-border/50 bg-card px-6 data-[state=open]:border-border"
                    >
                      <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {/* Response time badge */}
                <div className="mt-8 p-6 rounded-xl border border-border/50 bg-card">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-success/10">
                      <Clock className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="font-semibold">Quick response time</p>
                      <p className="text-sm text-muted-foreground">We typically respond within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
