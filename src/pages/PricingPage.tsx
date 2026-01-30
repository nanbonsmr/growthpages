import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  PricingHero,
  PricingCards,
  HowPricingWorks,
  FeatureComparison,
  PricingFAQ,
  PricingCTA,
} from '@/components/pricing';

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <PricingHero />

        {/* Pricing Cards */}
        <PricingCards />

        {/* How Pricing Works */}
        <HowPricingWorks />

        {/* Feature Comparison Table */}
        <FeatureComparison />

        {/* FAQ Section */}
        <PricingFAQ />

        {/* Final CTA */}
        <PricingCTA />
      </main>
      <Footer />
    </div>
  );
}
