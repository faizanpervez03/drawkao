export const metadata = { title: "Terms of Service", description: "Draw Kao Terms of Service." };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: September 2026</p>

        <div className="prose prose-sm max-w-none text-foreground space-y-6">
          <section>
            <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Draw Kao, you agree to be bound by these Terms of Service.
              If you do not agree, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">2. Use of the Platform</h2>
            <p className="text-muted-foreground leading-relaxed">
              Draw Kao is an educational platform designed for children ages 4-8. All accounts must be created
              by a parent or legal guardian. You are responsible for monitoring your child&apos;s use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">3. Account Responsibility</h2>
            <p className="text-muted-foreground leading-relaxed">
              Parents are responsible for maintaining the confidentiality of their account credentials and for
              all activities that occur under their account. You agree to notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">4. Content & Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on Draw Kao, including text, graphics, logos, and software, is owned by Draw Kao and
              protected by copyright laws. Drawings created by children on the platform belong to the user.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">5. Subscription & Payments</h2>
            <p className="text-muted-foreground leading-relaxed">
              Some features may require a paid subscription. Subscriptions auto-renew unless canceled.
              You may cancel at any time through the Parent Dashboard. Refunds are handled on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">6. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              Draw Kao is provided &quot;as is&quot; without warranties. We are not liable for any damages arising from
              the use of our platform. Our liability is limited to the amount paid for the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">7. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the platform after changes
              constitutes acceptance of the new terms. We will notify parents of significant changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">8. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms, contact us at support@drawkao.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
