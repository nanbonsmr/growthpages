import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

type FeatureValue = boolean | string;

interface Feature {
  name: string;
  free: FeatureValue;
  pro: FeatureValue;
  business: FeatureValue;
  category?: string;
}

const features: Feature[] = [
  // Pages & Subscribers
  { name: 'Signup Pages', free: '1', pro: 'Unlimited', business: 'Unlimited', category: 'Core Features' },
  { name: 'Subscribers', free: '100', pro: '30,000', business: 'Unlimited' },
  { name: 'Contact Form Submissions', free: '50/mo', pro: 'Unlimited', business: 'Unlimited' },
  
  // Templates & Design
  { name: 'Basic Templates', free: true, pro: true, business: true, category: 'Design & Branding' },
  { name: 'Premium Templates', free: false, pro: true, business: true },
  { name: 'Custom Colors & Fonts', free: false, pro: true, business: true },
  { name: 'Remove GrowthPages Branding', free: false, pro: true, business: true },
  { name: 'White-label Solution', free: false, pro: false, business: true },
  
  // Features
  { name: 'Analytics Dashboard', free: 'Basic', pro: 'Advanced', business: 'Advanced', category: 'Analytics & Insights' },
  { name: 'A/B Testing', free: false, pro: true, business: true },
  { name: 'Conversion Tracking', free: false, pro: true, business: true },
  
  // Domain & Integration
  { name: 'Custom Domain', free: false, pro: false, business: true, category: 'Domain & Integration' },
  { name: 'API Access', free: false, pro: false, business: true },
  { name: 'Webhook Integrations', free: false, pro: true, business: true },
  
  // Team & Support
  { name: 'Team Members', free: '1', pro: '3', business: 'Unlimited', category: 'Team & Support' },
  { name: 'Email Support', free: true, pro: true, business: true },
  { name: 'Priority Support', free: false, pro: true, business: true },
  { name: 'Dedicated Account Manager', free: false, pro: false, business: true },
  { name: 'SLA Guarantee', free: false, pro: false, business: true },
];

function FeatureCell({ value }: { value: FeatureValue }) {
  if (typeof value === 'boolean') {
    return value ? (
      <div className="flex justify-center">
        <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
          <Check className="h-3.5 w-3.5 text-success" />
        </div>
      </div>
    ) : (
      <div className="flex justify-center">
        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
    );
  }
  
  return (
    <span className="text-sm font-medium text-foreground">{value}</span>
  );
}

export function FeatureComparison() {
  let currentCategory = '';

  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Compare <span className="gradient-text">all features</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See exactly what's included in each plan
          </p>
        </div>

        <div className="max-w-5xl mx-auto overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-medium text-muted-foreground">
                  Features
                </th>
                <th className="text-center py-4 px-4 min-w-[100px]">
                  <div className="font-semibold">Free</div>
                  <div className="text-sm text-muted-foreground">$0</div>
                </th>
                <th className="text-center py-4 px-4 min-w-[100px] bg-primary/5 rounded-t-xl">
                  <div className="font-semibold text-primary">Pro</div>
                  <div className="text-sm text-muted-foreground">$12/mo</div>
                </th>
                <th className="text-center py-4 px-4 min-w-[100px]">
                  <div className="font-semibold">Business</div>
                  <div className="text-sm text-muted-foreground">$39/mo</div>
                </th>
              </tr>
            </thead>

            <tbody>
              {features.map((feature, index) => {
                const showCategory = feature.category && feature.category !== currentCategory;
                if (feature.category) currentCategory = feature.category;

                return (
                  <>
                    {showCategory && (
                      <tr key={`category-${feature.category}`}>
                        <td
                          colSpan={4}
                          className="pt-8 pb-3 px-4 text-sm font-semibold text-foreground uppercase tracking-wide"
                        >
                          {feature.category}
                        </td>
                      </tr>
                    )}
                    <tr
                      key={feature.name}
                      className={cn(
                        'border-b border-border/50 transition-colors hover:bg-muted/30',
                        index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
                      )}
                    >
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {feature.name}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <FeatureCell value={feature.free} />
                      </td>
                      <td className="py-4 px-4 text-center bg-primary/5">
                        <FeatureCell value={feature.pro} />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <FeatureCell value={feature.business} />
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
