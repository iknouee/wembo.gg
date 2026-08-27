export interface PricingPlan {
  name: string
  description: string
  price: string
  period?: string
  features: string[]
  cta: string
  href: string
  highlighted?: boolean
}

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Free',
    description: 'For growing communities.',
    price: '$0',
    period: '/month',
    features: [
      'Core server tools',
      'Basic automation (5 workflows)',
      'Basic analytics',
      'Basic forms (3 forms)',
      'Basic security',
      'Up to 1,000 members',
      'Community support',
    ],
    cta: 'Get Started',
    href: '/api/auth/login',
  },
  {
    name: 'Pro',
    description: 'For serious communities.',
    price: '$12',
    period: '/month',
    features: [
      'Advanced AI assistant',
      'Unlimited automations',
      'Smart security with threat scoring',
      'Advanced analytics & insights',
      'Knowledge base',
      'Advanced forms & workflows',
      'All integrations',
      'Up to 50,000 members',
      'Priority support',
    ],
    cta: 'Start Pro',
    href: '/api/auth/login',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    description: 'For large communities.',
    price: 'Custom',
    features: [
      'Everything in Pro',
      'Advanced security suite',
      'Higher rate limits',
      'Priority support & SLA',
      'Custom requirements',
      'Advanced analytics & reporting',
      'Unlimited members',
      'Dedicated account manager',
    ],
    cta: 'Contact Us',
    href: '/contact',
  },
]
