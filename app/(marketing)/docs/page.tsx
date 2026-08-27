import { Metadata } from 'next'
import Link from 'next/link'
import {
  BookOpen,
  Bot,
  Zap,
  Shield,
  FileText,
  Lightbulb,
  BarChart3,
  Puzzle,
  Code,
  HelpCircle,
  Rocket,
  Settings,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Learn how to set up and use Wembo for your Discord community.',
}

const docsSections = [
  {
    icon: Rocket,
    title: 'Getting Started',
    description: 'Set up Wembo in your Discord server in under 5 minutes.',
    href: '/docs#getting-started',
    articles: ['Quick Start Guide', 'Adding Wembo to Discord', 'Initial Configuration', 'Permissions Setup'],
  },
  {
    icon: Settings,
    title: 'Dashboard',
    description: 'Navigate the Wembo dashboard and configure your server.',
    href: '/docs#dashboard',
    articles: ['Dashboard Overview', 'Server Settings', 'Staff Permissions', 'Notification Preferences'],
  },
  {
    icon: Bot,
    title: 'AI',
    description: 'Configure Wembo AI to understand and assist your community.',
    href: '/docs#ai',
    articles: ['Setting Up Knowledge Sources', 'AI Personality', 'Permission Controls', 'Channel Configuration'],
  },
  {
    icon: Zap,
    title: 'Automations',
    description: 'Build powerful workflows with the visual automation builder.',
    href: '/docs#automations',
    articles: ['Creating Your First Automation', 'Triggers & Conditions', 'Actions & Variables', 'Best Practices'],
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Configure smart security to protect your community.',
    href: '/docs#security',
    articles: ['Security Overview', 'Anti-Raid Setup', 'Threat Scoring', 'Lockdown Configuration'],
  },
  {
    icon: FileText,
    title: 'Forms',
    description: 'Build custom forms for applications, appeals, and more.',
    href: '/docs#forms',
    articles: ['Creating Forms', 'Form Fields', 'Submission Workflow', 'Review Interface'],
  },
  {
    icon: Lightbulb,
    title: 'Knowledge',
    description: 'Turn your Discord into a searchable knowledge base.',
    href: '/docs#knowledge',
    articles: ['Adding Knowledge Sources', 'Managing FAQs', 'Approval Workflow', 'AI Integration'],
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Understand your community with data and insights.',
    href: '/docs#analytics',
    articles: ['Analytics Dashboard', 'Growth Metrics', 'Engagement Data', 'Custom Reports'],
  },
  {
    icon: Puzzle,
    title: 'Integrations',
    description: 'Connect external services to your Discord server.',
    href: '/docs#integrations',
    articles: ['YouTube Integration', 'Twitch Integration', 'GitHub & Webhooks', 'Custom Integrations'],
  },
  {
    icon: Code,
    title: 'API',
    description: 'Programmatic access to Wembo features for developers.',
    href: '/docs#api',
    articles: ['API Overview', 'Authentication', 'Endpoints Reference', 'Rate Limits'],
  },
  {
    icon: HelpCircle,
    title: 'Troubleshooting',
    description: 'Common issues and how to resolve them.',
    href: '/docs#troubleshooting',
    articles: ['Common Issues', 'Permission Problems', 'Bot Not Responding', 'Contact Support'],
  },
]

export default function DocsPage() {
  return (
    <div className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Badge variant="secondary" className="mb-4">
              <BookOpen className="h-3 w-3 mr-1" /> Documentation
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Wembo Documentation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Everything you need to set up, configure, and get the most out of Wembo for your Discord community.
            </p>
          </div>

          {/* Search */}
          <div className="mb-12">
            <div className="relative max-w-xl">
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full h-12 rounded-xl border border-border bg-card px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                readOnly
              />
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Doc Sections */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {docsSections.map((section) => (
              <Card
                key={section.title}
                className="p-6 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                    <section.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold">{section.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                <ul className="space-y-1.5">
                  {section.articles.map((article) => (
                    <li key={article}>
                      <Link
                        href={section.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                      >
                        <div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                        {article}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          {/* Help */}
          <Card className="mt-12 p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Need help?</h3>
            <p className="text-muted-foreground mb-4">
              Can&apos;t find what you&apos;re looking for? Join our Discord for support.
            </p>
            <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer">
              <button className="inline-flex items-center gap-2 rounded-lg bg-[#5865F2] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4752C4] transition-colors">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Join Discord
              </button>
            </a>
          </Card>
        </div>
      </div>
    </div>
  )
}
