import { Metadata } from 'next'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { pricingPlans } from '@/config/pricing'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for communities of any size. Start free, upgrade when you need more.',
}

export default function PricingPage() {
  return (
    <div className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Simple, transparent pricing.
          </h1>
          <p className="text-lg text-muted-foreground">
            Start free. Upgrade when your community needs more power.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-20">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                'p-6 flex flex-col relative',
                plan.highlighted && 'border-primary/50 shadow-lg shadow-primary/10'
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground">{plan.period}</span>
                )}
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.href}>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-4">
            <FAQItem
              question="Can I try Pro features before upgrading?"
              answer="Yes! New servers get a 14-day trial of Pro features. No credit card required."
            />
            <FAQItem
              question="What happens if I exceed my member limit?"
              answer="We won't cut you off. You'll get a notification to upgrade, and your community continues running normally while you decide."
            />
            <FAQItem
              question="Can I switch plans anytime?"
              answer="Absolutely. Upgrade or downgrade at any time. If you downgrade, you keep Pro features until the end of your billing period."
            />
            <FAQItem
              question="Do you offer discounts for large communities?"
              answer="Yes! Contact us for Enterprise pricing. We offer custom plans for communities with specific needs."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards, PayPal, and select cryptocurrency payments."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <Card className="p-5">
      <h4 className="font-medium mb-2">{question}</h4>
      <p className="text-sm text-muted-foreground">{answer}</p>
    </Card>
  )
}
