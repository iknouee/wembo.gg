'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { pricingPlans } from '@/config/pricing'

export default function PricingPage() {
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => { setIsVisible(true) }, [])

  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px]" />

      <div className="relative py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Simple, transparent{' '}
              <span className="text-gradient">pricing.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Start free. Upgrade when your community needs more power.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5 mb-24">
            {pricingPlans.map((plan, i) => (
              <div
                key={plan.name}
                className={`relative group rounded-2xl border bg-card/50 backdrop-blur-sm p-7 flex flex-col transition-all duration-700 hover:-translate-y-1 ${
                  plan.highlighted
                    ? 'border-primary/30 shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/15'
                    : 'border-white/[0.06] hover:border-white/[0.12] hover:shadow-xl hover:shadow-black/10'
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${i * 150 + 200}ms` }}
              >
                {plan.highlighted && (
                  <>
                    <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/20 via-transparent to-primary/10 -z-10" />
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 shadow-lg shadow-primary/20">
                      <Sparkles className="h-3 w-3 mr-1" /> Most Popular
                    </Badge>
                  </>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground/60">{plan.description}</p>
                </div>
                <div className="mb-7">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground/50 ml-1">{plan.period}</span>
                  )}
                </div>
                <ul className="space-y-3.5 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <div className="rounded-full bg-primary/10 p-0.5 mt-0.5 shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground/70">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button
                    className={`w-full group/btn ${plan.highlighted ? 'shadow-lg shadow-primary/20' : ''}`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    {plan.cta}
                    <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform group-hover/btn:translate-x-0.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10">Frequently asked questions</h2>
            <div className="space-y-3">
              {[
                { q: 'Can I try Pro features before upgrading?', a: 'Yes! New servers get a 14-day trial of Pro features. No credit card required.' },
                { q: 'What happens if I exceed my member limit?', a: "We won't cut you off. You'll get a notification to upgrade, and your community continues running normally." },
                { q: 'Can I switch plans anytime?', a: 'Absolutely. Upgrade or downgrade at any time. Pro features stay until the end of your billing period.' },
                { q: 'Do you offer discounts for large communities?', a: 'Yes! Contact us for Enterprise pricing with custom plans for your needs.' },
                { q: 'What payment methods do you accept?', a: 'All major credit cards, PayPal, and select cryptocurrency payments.' },
              ].map((faq, i) => (
                <div
                  key={i}
                  className={`rounded-xl border border-white/[0.06] bg-card/50 p-5 hover:border-white/[0.1] transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ transitionDelay: `${i * 100 + 600}ms` }}
                >
                  <h4 className="font-medium mb-2 text-foreground/90">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground/60 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
