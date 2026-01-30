import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">We use cookies for the following purposes:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Essential Cookies:</strong> Required for the operation of our website</li>
                <li><strong>Authentication:</strong> To keep you signed in to your account</li>
                <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                <li><strong>Analytics:</strong> To understand how visitors use our website</li>
                <li><strong>Performance:</strong> To improve the speed and performance of our site</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border">
                  <h3 className="font-semibold mb-2">Strictly Necessary Cookies</h3>
                  <p className="text-muted-foreground text-sm">
                    These cookies are essential for you to browse the website and use its features. Without these cookies, services like shopping carts and e-billing cannot be provided.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border">
                  <h3 className="font-semibold mb-2">Performance Cookies</h3>
                  <p className="text-muted-foreground text-sm">
                    These cookies collect information about how visitors use our website, such as which pages are visited most often. This data is used to optimize our website and make it easier to navigate.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border">
                  <h3 className="font-semibold mb-2">Functionality Cookies</h3>
                  <p className="text-muted-foreground text-sm">
                    These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, more personal features.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border">
                  <h3 className="font-semibold mb-2">Analytics Cookies</h3>
                  <p className="text-muted-foreground text-sm">
                    We use analytics cookies to help us understand how users engage with our website. This helps us improve our services and user experience.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Some cookies are placed by third-party services that appear on our pages. We do not control these cookies and recommend reviewing the privacy policies of these third parties for more information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most web browsers allow you to control cookies through their settings. You can typically find these settings in the "Options" or "Preferences" menu of your browser. You can:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Delete all cookies from your browser</li>
                <li>Block all cookies from being set</li>
                <li>Allow all cookies to be set</li>
                <li>Block third-party cookies</li>
                <li>Clear cookies when you close your browser</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Impact of Disabling Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you disable cookies, some features of our website may not function properly. For example, you may not be able to stay logged in to your account, and some personalization features may not work.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Updates to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about our use of cookies, please contact us at privacy@leadcapture.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
