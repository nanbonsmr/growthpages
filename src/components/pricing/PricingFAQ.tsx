import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Can I change my plan later?',
    answer:
      'Absolutely! You can upgrade or downgrade your plan at any time. When you upgrade, you\'ll get immediate access to new features. When you downgrade, changes take effect at the end of your current billing period.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment partner Dodo. All transactions are encrypted and PCI-compliant.',
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer:
      'Yes! Start with our Free plan to explore the platform. When you\'re ready to upgrade, you\'ll get full access to Pro or Business features immediately.',
  },
  {
    question: 'What happens if I exceed my subscriber limit?',
    answer:
      'We\'ll notify you as you approach your limit. You can upgrade your plan anytime to get more subscribers. Existing subscribers will not be deleted if you exceed your limit.',
  },
  {
    question: 'Can I get a refund?',
    answer:
      'We offer a 14-day money-back guarantee on all paid plans. If you\'re not satisfied, contact our support team for a full refund, no questions asked.',
  },
  {
    question: 'Do you offer annual billing?',
    answer:
      'Yes! Annual billing is coming soon with a 20% discount. Contact us if you\'d like to be notified when it becomes available.',
  },
];

export function PricingFAQ() {
  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about our pricing
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border/50 rounded-xl px-6 data-[state=open]:shadow-lg transition-all duration-200"
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
        </div>
      </div>
    </section>
  );
}
