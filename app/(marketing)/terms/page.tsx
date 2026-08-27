import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Wembo Terms of Service — the rules and guidelines for using our platform.',
}

export default function TermsPage() {
  return (
    <div className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: August 2026</p>

        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Wembo, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
            <p>
              Wembo provides Discord community management tools including automation,
              AI assistance, security monitoring, analytics, and member management features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. User Responsibilities</h2>
            <p>
              You are responsible for your use of the service and must comply with Discord&apos;s
              Terms of Service and Community Guidelines. You may not use Wembo to harass,
              spam, or harm others.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Limitation of Liability</h2>
            <p>
              Wembo is provided &ldquo;as is&rdquo; without warranty of any kind. We are not liable
              for any damages arising from your use of the service, including data loss
              or service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the
              service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@wembo.com" className="text-primary hover:text-primary/80 transition-colors">
                legal@wembo.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
