import { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Zap,
  UserPlus,
  Clock,
  MessageSquare,
  Star,
  Bell,
  Shield,
  Hash,
  Webhook,
  Heart,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Automations',
  description: 'If you can imagine it, Wembo can automate it. Visual workflow builder for Discord communities.',
}

const triggers = [
  'Member joins', 'Member leaves', 'Message sent', 'Reaction added',
  'Role added', 'Role removed', 'Level reached', 'Form submitted',
  'Ticket opened', 'Ticket closed', 'Scheduled event', 'YouTube upload', 'Webhook',
]

const conditions = [
  'Account age', 'Roles', 'Channels', 'Permissions',
  'Message content', 'Time', 'Member activity', 'Reputation',
  'Warnings', 'Custom variables',
]

const actions = [
  'Give role', 'Remove role', 'Send message', 'DM member',
  'Timeout', 'Kick', 'Ban', 'Create channel',
  'Open ticket', 'Notify staff', 'Run webhook', 'Start automation',
]

export default function AutomationsPage() {
  return (
    <div className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge variant="secondary" className="mb-4">
            <Zap className="h-3 w-3 mr-1" /> Automations
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            If you can imagine it,{' '}
            <span className="text-gradient">Wembo can automate it.</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Build powerful workflows with a visual builder. Triggers, conditions, and actions — no coding required.
          </p>
        </div>

        {/* Workflow Builder Visual */}
        <div className="max-w-xl mx-auto mb-24">
          <div className="relative">
            {/* Workflow Nodes */}
            <WorkflowNode
              type="trigger"
              label="WHEN"
              content="Member joins"
              icon={UserPlus}
              color="bg-blue-500/10 border-blue-500/30 text-blue-400"
            />
            <WorkflowConnector />
            <WorkflowNode
              type="condition"
              label="IF"
              content="Account age < 7 days"
              icon={Clock}
              color="bg-orange-500/10 border-orange-500/30 text-orange-400"
            />
            <WorkflowConnector />
            <WorkflowNode
              type="action"
              label="THEN"
              content="Send verification message"
              icon={MessageSquare}
              color="bg-green-500/10 border-green-500/30 text-green-400"
            />
            <WorkflowConnector />
            <WorkflowNode
              type="action"
              label="THEN"
              content="Assign New Member role"
              icon={Star}
              color="bg-purple-500/10 border-purple-500/30 text-purple-400"
            />
            <WorkflowConnector />
            <WorkflowNode
              type="action"
              label="THEN"
              content="Notify moderators"
              icon={Bell}
              color="bg-pink-500/10 border-pink-500/30 text-pink-400"
            />
          </div>
        </div>

        {/* Triggers, Conditions, Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <h3 className="font-semibold">Triggers</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Events that start your automation.
            </p>
            <div className="flex flex-wrap gap-2">
              {triggers.map((t) => (
                <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              <h3 className="font-semibold">Conditions</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Logic that decides what happens next.
            </p>
            <div className="flex flex-wrap gap-2">
              {conditions.map((c) => (
                <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <h3 className="font-semibold">Actions</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              What Wembo does when conditions are met.
            </p>
            <div className="flex flex-wrap gap-2">
              {actions.map((a) => (
                <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Example Automations */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-center mb-8">Example workflows</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <ExampleWorkflow
              title="Welcome New Members"
              trigger="Member joins"
              actions={['Send welcome DM', 'Assign role', 'Log to #joins']}
            />
            <ExampleWorkflow
              title="Anti-Raid Protection"
              trigger="5+ joins in 10 seconds"
              actions={['Lock server', 'Ban accounts', 'Alert staff']}
            />
            <ExampleWorkflow
              title="Level Rewards"
              trigger="Member reaches Level 10"
              actions={['Grant VIP role', 'Send congrats', 'Unlock channels']}
            />
            <ExampleWorkflow
              title="YouTube Notifications"
              trigger="New upload detected"
              actions={['Post in #youtube', 'Ping subscribers', 'Add to feed']}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Stop doing things manually.</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Let Wembo handle the repetitive work while you focus on growing your community.
          </p>
          <Link href="#">
            <Button size="lg" className="gap-2">
              Add Wembo to Discord
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function WorkflowNode({
  type,
  label,
  content,
  icon: Icon,
  color,
}: {
  type: string
  label: string
  content: string
  icon: React.ElementType
  color: string
}) {
  return (
    <div className={`rounded-xl border p-5 ${color} transition-all hover:scale-[1.02]`}>
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-background/50 p-2">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-medium uppercase tracking-wider opacity-70">{label}</span>
          <p className="font-medium">{content}</p>
        </div>
      </div>
    </div>
  )
}

function WorkflowConnector() {
  return (
    <div className="flex justify-center py-2">
      <div className="flex flex-col items-center">
        <div className="w-px h-4 bg-border" />
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}

function ExampleWorkflow({
  title,
  trigger,
  actions,
}: {
  title: string
  trigger: string
  actions: string[]
}) {
  return (
    <Card className="p-5 hover:border-primary/30 transition-colors">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-xs text-muted-foreground mb-3">
        Trigger: <span className="text-foreground">{trigger}</span>
      </p>
      <div className="space-y-1">
        {actions.map((action, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-1 w-1 rounded-full bg-primary" />
            {action}
          </div>
        ))}
      </div>
    </Card>
  )
}
