import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using GrowthPages's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                GrowthPages provides a platform for creating landing pages, collecting subscriber information, and managing email lists. We reserve the right to modify, suspend, or discontinue any part of the service at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">To use our services, you must:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Be at least 18 years old or have parental consent</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">You agree not to use our services to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Send spam or unsolicited communications</li>
                <li>Distribute malware or harmful content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Engage in any activity that disrupts our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Content Ownership</h2>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of all content you create using our platform. By using our services, you grant us a limited license to host, display, and distribute your content solely for the purpose of providing our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                Paid plans are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law. We reserve the right to change our pricing with 30 days notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, GrowthPages shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your account at any time for violations of these terms. Upon termination, your right to use the service will cease immediately. You may also delete your account at any time through your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our platform. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us at legal@growthpages.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
