import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Wembo Privacy Policy — how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: August 2026</p>

        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p>
              When you sign in with Discord, we collect your Discord user ID, username,
              avatar, email address (if provided), and server list. We use this information
              solely to provide and improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Data</h2>
            <p>
              We use your data to authenticate your session, display your dashboard,
              and provide community management features for the servers you manage.
              We do not sell your data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Security</h2>
            <p>
              We use industry-standard encryption and security measures to protect your
              data. Sessions are secured with signed JWT tokens stored in httpOnly cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. You can request
              deletion of your data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@wembo.com" className="text-primary hover:text-primary/80 transition-colors">
                privacy@wembo.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
