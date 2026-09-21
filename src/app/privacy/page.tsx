export const metadata = { title: "Privacy Policy", description: "Draw Kao Privacy Policy - How we protect your child's data." };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: September 2026</p>

        <div className="prose prose-sm max-w-none text-foreground space-y-6">
          <section>
            <h2 className="text-lg font-bold text-foreground">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              Draw Kao collects minimal information to provide our educational services. We collect account information
              (name, email address) when parents sign up, and learning progress data (completed lessons, stars earned)
              when children use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use collected information to: provide and improve our educational services, track your child&apos;s
              learning progress, send optional progress reports, and ensure platform security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">3. Children&apos;s Privacy (COPPA)</h2>
            <p className="text-muted-foreground leading-relaxed">
              Draw Kao is designed for children ages 4-8. We comply with the Children&apos;s Online Privacy Protection
              Act (COPPA). We do not collect personal information directly from children. All accounts are created
              by parents or guardians. We do not display advertisements to children or share children&apos;s data with
              third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">4. Data Storage & Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              All data is stored securely using industry-standard encryption. We use Supabase for database hosting
              with Row Level Security (RLS) enabled, ensuring each user can only access their own data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">5. Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, trade, or share your personal information with third parties. We may use anonymized,
              aggregated data for platform improvement and research purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              Parents can request access to, correction of, or deletion of their child&apos;s data at any time by
              contacting us at support@drawkao.com. You can also manage data through the Parent Dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">7. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at support@drawkao.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
