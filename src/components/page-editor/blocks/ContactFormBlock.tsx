import { useState } from 'react';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, Loader2 } from 'lucide-react';

export interface ContactFormProps {
  showName: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showMessage: boolean;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  messageLabel: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  messagePlaceholder: string;
  buttonText: string;
  buttonColor: string;
  successMessage: string;
  requirePhone: boolean;
  layout: 'stacked' | 'two-column';
}

interface ContactFormBlockProps {
  props: ContactFormProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Partial<ContactFormProps>) => void;
}

const createContactSchema = (props: ContactFormProps) => {
  return z.object({
    name: props.showName
      ? z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters')
      : z.string().optional(),
    email: props.showEmail
      ? z.string().trim().email('Please enter a valid email').max(255, 'Email must be less than 255 characters')
      : z.string().optional(),
    phone: props.showPhone
      ? props.requirePhone
        ? z.string().trim().min(1, 'Phone is required').max(20, 'Phone must be less than 20 characters')
            .regex(/^[\d\s\-+()]+$/, 'Please enter a valid phone number')
        : z.string().trim().max(20, 'Phone must be less than 20 characters')
            .regex(/^[\d\s\-+()]*$/, 'Please enter a valid phone number').optional().or(z.literal(''))
      : z.string().optional(),
    message: props.showMessage
      ? z.string().trim().min(1, 'Message is required').max(2000, 'Message must be less than 2000 characters')
      : z.string().optional(),
  });
};

export function ContactFormBlock({ props, isSelected, isPreview, onUpdate }: ContactFormBlockProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isPreview) {
      // In preview mode, just show success state briefly
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
      }, 1000);
      return;
    }

    // Validate form
    const schema = createContactSchema(props);
    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission for editor preview
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div
        className={cn(
          'w-full p-8 rounded-lg text-center',
          isSelected && !isPreview && 'ring-2 ring-primary ring-offset-2'
        )}
      >
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: props.buttonColor || '#7c3aed' }}
          >
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-medium text-foreground">
            {props.successMessage || 'Thank you! We\'ll be in touch soon.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full p-6 rounded-lg',
        isSelected && !isPreview && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className={cn(
            'gap-4',
            props.layout === 'two-column' ? 'grid grid-cols-1 md:grid-cols-2' : 'space-y-4'
          )}
        >
          {props.showName && (
            <div className="space-y-2">
              <Label htmlFor="contact-name" className="text-foreground">
                {props.nameLabel || 'Name'} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact-name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder={props.namePlaceholder || 'Your name'}
                className={cn(errors.name && 'border-destructive')}
                disabled={isSubmitting}
                maxLength={100}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
          )}

          {props.showEmail && (
            <div className="space-y-2">
              <Label htmlFor="contact-email" className="text-foreground">
                {props.emailLabel || 'Email'} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder={props.emailPlaceholder || 'your@email.com'}
                className={cn(errors.email && 'border-destructive')}
                disabled={isSubmitting}
                maxLength={255}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
          )}

          {props.showPhone && (
            <div className="space-y-2">
              <Label htmlFor="contact-phone" className="text-foreground">
                {props.phoneLabel || 'Phone'}
                {props.requirePhone && <span className="text-destructive"> *</span>}
              </Label>
              <Input
                id="contact-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder={props.phonePlaceholder || '+1 (555) 000-0000'}
                className={cn(errors.phone && 'border-destructive')}
                disabled={isSubmitting}
                maxLength={20}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>
          )}
        </div>

        {props.showMessage && (
          <div className="space-y-2">
            <Label htmlFor="contact-message" className="text-foreground">
              {props.messageLabel || 'Message'} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="contact-message"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder={props.messagePlaceholder || 'How can we help you?'}
              className={cn('min-h-[120px] resize-none', errors.message && 'border-destructive')}
              disabled={isSubmitting}
              maxLength={2000}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message}</p>
            )}
            <p className="text-xs text-muted-foreground text-right">
              {formData.message.length}/2000
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full text-white font-medium"
          style={{ backgroundColor: props.buttonColor || '#7c3aed' }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            props.buttonText || 'Send Message'
          )}
        </Button>
      </form>
    </div>
  );
}
