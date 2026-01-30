import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, MessageSquare, HelpCircle, Building } from 'lucide-react';
import { z } from 'zod';

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
    description: 'Get help with your account or technical issues',
    email: 'support@leadcapture.com',
  },
  {
    icon: MessageSquare,
    title: 'Sales',
    description: 'Learn more about our plans and pricing',
    email: 'sales@leadcapture.com',
  },
  {
    icon: Building,
    title: 'Partnerships',
    description: 'Explore partnership opportunities',
    email: 'partners@leadcapture.com',
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
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

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Message sent!',
      description: "We'll get back to you as soon as possible.",
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Have a question or need help? We're here for you. Reach out and we'll respond as soon as we can.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="order-2 lg:order-1">
              <div className="p-8 rounded-xl border border-border bg-card">
                <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
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
                        className={errors.name ? 'border-destructive' : ''}
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
                        className={errors.email ? 'border-destructive' : ''}
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
                      className={errors.subject ? 'border-destructive' : ''}
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
                  <Button type="submit" className="w-full gradient-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Options */}
            <div className="order-1 lg:order-2 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Contact Options</h2>
                <p className="text-muted-foreground">
                  Choose the best way to reach us based on your needs.
                </p>
              </div>

              <div className="space-y-4">
                {contactOptions.map((option, index) => (
                  <a
                    key={index}
                    href={`mailto:${option.email}`}
                    className="flex items-start gap-4 p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <option.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{option.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                      <span className="text-sm text-primary">{option.email}</span>
                    </div>
                  </a>
                ))}
              </div>

              <div className="p-6 rounded-xl border border-border bg-muted/50">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">General Inquiries</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  For all other questions, reach out to us at:
                </p>
                <a href="mailto:hello@leadcapture.com" className="text-primary hover:underline">
                  hello@leadcapture.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
