import {
  Bot,
  Shield,
  Zap,
  BarChart3,
  FileText,
  Users,
  Lightbulb,
  Bell,
  Trophy,
  Ticket,
  Heart,
  Search,
} from 'lucide-react'
import { Card } from '@/components/ui/card'

const features = [
  {
    icon: Bot,
    title: 'AI Assistant',
    description:
      'An AI that actually understands your community. Answers questions, summarizes channels, and provides insights.',
  },
  {
    icon: Shield,
    title: 'Smart Security',
    description:
      'Detect threats before they happen. Anti-raid, phishing detection, threat scoring, and automatic lockdown.',
  },
  {
    icon: Zap,
    title: 'Automations',
    description:
      'Visual workflow builder for any scenario. Triggers, conditions, and actions — no coding required.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description:
      'Understand your community with real-time analytics, growth metrics, and engagement insights.',
  },
  {
    icon: Lightbulb,
    title: 'Knowledge Base',
    description:
      'Turn your Discord into a searchable knowledge base. AI-powered answers from approved sources.',
  },
  {
    icon: FileText,
    title: 'Forms & Workflows',
    description:
      'Build applications, appeals, and custom forms. Turn conversations into structured workflows.',
  },
  {
    icon: Users,
    title: 'Member Intelligence',
    description:
      'Know your members. Track reputation, interests, contributions, and find experts in your community.',
  },
  {
    icon: Bell,
    title: 'Integrations',
    description:
      'Connect YouTube, Twitch, GitHub, Reddit, and more. Deliver notifications right where they belong.',
  },
  {
    icon: Ticket,
    title: 'Tickets',
    description:
      'Manage support with panels, categories, forms, assignments, transcripts, and AI summaries.',
  },
  {
    icon: Heart,
    title: 'Suggestions',
    description:
      'Collect community feedback with voting, categories, statuses, and a public roadmap.',
  },
  {
    icon: Trophy,
    title: 'Engagement',
    description:
      'XP, levels, achievements, streaks, leaderboards, and custom rewards to keep your community active.',
  },
  {
    icon: Search,
    title: 'Server Search',
    description:
      'Search anything across your server. Messages, members, knowledge, and more — instantly.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Everything your community needs.{' '}
            <span className="text-muted-foreground">Nothing it doesn&apos;t.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Wembo combines powerful server tools with intelligence and automation so your
            staff can spend less time managing Discord and more time building the community.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <Card
              key={feature.title}
              className="p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
            >
              <div className="rounded-lg bg-primary/10 w-10 h-10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
