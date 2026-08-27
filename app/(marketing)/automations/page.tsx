'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Zap,
  UserPlus,
  Clock,
  MessageSquare,
  Star,
  Bell,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

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

const workflowSteps = [
  { type: 'trigger', label: 'WHEN', content: 'Member joins', icon: UserPlus, gradient: 'from-blue-500/[0.05] to-blue-600/[0.02]', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
  { type: 'condition', label: 'IF', content: 'Account age < 7 days', icon: Clock, gradient: 'from-orange-500/[0.05] to-orange-600/[0.02]', iconBg: 'bg-orange-500/10', iconColor: 'text-orange-400' },
  { type: 'action', label: 'THEN', content: 'Send verification message', icon: MessageSquare, gradient: 'from-green-500/[0.05] to-green-600/[0.02]', iconBg: 'bg-green-500/10', iconColor: 'text-green-400' },
  { type: 'action', label: 'THEN', content: 'Assign New Member role', icon: Star, gradient: 'from-purple-500/[0.05] to-purple-600/[0.02]', iconBg: 'bg-purple-500/10', iconColor: 'text-purple-400' },
  { type: 'action', label: 'THEN', content: 'Notify moderators', icon: Bell, gradient: 'from-pink-500/[0.05] to-pink-600/[0.02]', iconBg: 'bg-pink-500/10', iconColor: 'text-pink-400' },
]

export default function AutomationsPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [visibleNodes, setVisibleNodes] = useState<Set<number>>(new Set())

  useEffect(() => {
    setIsVisible(true)
    workflowSteps.forEach((_, i) => {
      setTimeout(() => {
        setVisibleNodes((prev) => new Set([...Array.from(prev), i]))
      }, 800 + i * 300)
    })
  }, [])

  return (
    <div className="relative min-h-screen bg-[#050505]">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#FFD600]/[0.02] rounded-full blur-[120px]" />

      <div className="relative py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#FFD600] uppercase tracking-wider mb-6 bg-[#FFD600]/[0.04] border border-[#FFD600]/20 rounded-full px-3 py-1.5">
              <Zap className="h-3.5 w-3.5 text-[#FFD600]" /> Automations
            </span>
            <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold text-white tracking-tight mb-6">
              If you can imagine it,{' '}
              <span className="bg-gradient-to-r from-[#FFD600] to-[#FFA800] bg-clip-text text-transparent">Wembo can automate it.</span>
            </h1>
            <p className="text-lg text-[#9A9CA3] leading-relaxed">
              Build powerful workflows with a visual builder. Triggers, conditions, and actions — no coding required.
            </p>
          </div>

          {/* Workflow Builder Visual */}
          <div className={`max-w-lg mx-auto mb-28 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="relative">
              {/* Connection line behind nodes */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 overflow-hidden">
                <div
                  className="w-full bg-gradient-to-b from-blue-500/30 via-green-500/20 to-pink-500/30 transition-all duration-[2s] ease-out"
                  style={{ height: isVisible ? '100%' : '0%' }}
                />
              </div>

              {/* Workflow Nodes */}
              <div className="space-y-4 relative">
                {workflowSteps.map((step, i) => (
                  <div key={i}>
                    <div
                      className={`relative rounded-xl bg-gradient-to-r ${step.gradient} p-5 transition-all duration-500 hover:scale-[1.02] cursor-pointer ${
                        visibleNodes.has(i) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20px]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`rounded-lg ${step.iconBg} p-2.5`}>
                          <step.icon className={`h-5 w-5 ${step.iconColor}`} />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#9A9CA3]/50">{step.label}</span>
                          <p className="font-medium text-[#F7F7F8]/90">{step.content}</p>
                        </div>
                      </div>
                    </div>
                    {/* Connector */}
                    {i < workflowSteps.length - 1 && (
                      <div className={`flex justify-center py-1.5 transition-all duration-300 ${visibleNodes.has(i) ? 'opacity-100' : 'opacity-0'}`}>
                        <ChevronDown className="h-4 w-4 text-[#9A9CA3]/30" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Triggers, Conditions, Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-24">
            <CategoryCard color="blue" title="Triggers" description="Events that start your automation." items={triggers} visible={isVisible} delay={200} />
            <CategoryCard color="orange" title="Conditions" description="Logic that decides what happens next." items={conditions} visible={isVisible} delay={400} />
            <CategoryCard color="green" title="Actions" description="What Wembo does when conditions are met." items={actions} visible={isVisible} delay={600} />
          </div>

          {/* Example Automations */}
          <div className="max-w-4xl mx-auto mb-24">
            <h2 className="text-2xl font-bold text-center mb-10 text-white">Example workflows</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <ExampleWorkflow title="Welcome New Members" trigger="Member joins" actions={['Send welcome DM', 'Assign role', 'Log to #joins']} />
              <ExampleWorkflow title="Anti-Raid Protection" trigger="5+ joins in 10 seconds" actions={['Lock server', 'Ban accounts', 'Alert staff']} />
              <ExampleWorkflow title="Level Rewards" trigger="Member reaches Level 10" actions={['Grant VIP role', 'Send congrats', 'Unlock channels']} />
              <ExampleWorkflow title="YouTube Notifications" trigger="New upload detected" actions={['Post in #youtube', 'Ping subscribers', 'Add to feed']} />
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Stop doing things manually.</h2>
            <p className="text-[#9A9CA3] mb-8 max-w-lg mx-auto leading-relaxed">
              Let Wembo handle the repetitive work while you focus on growing your community.
            </p>
            <Link href="/invite">
              <Button size="lg" className="gap-2.5 group">
                Add Wembo to Discord
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function CategoryCard({ color, title, description, items, visible, delay }: { color: string; title: string; description: string; items: string[]; visible: boolean; delay: number }) {
  const dotColors: Record<string, string> = { blue: 'bg-blue-500', orange: 'bg-orange-500', green: 'bg-green-500' }
  return (
    <div
      className="rounded-2xl bg-[#090A0C] p-6 hover:bg-[#0f1012] transition-all duration-700"
      style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`h-2.5 w-2.5 rounded-full ${dotColors[color]}`} />
        <h3 className="font-semibold text-[#F7F7F8]">{title}</h3>
      </div>
      <p className="text-sm text-[#9A9CA3]/60 mb-5">{description}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item} className="text-xs bg-[#FFD600]/[0.04] border border-[#FFD600]/20 text-[#FFD600]/80 px-2.5 py-1 rounded-full">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function ExampleWorkflow({ title, trigger, actions }: { title: string; trigger: string; actions: string[] }) {
  return (
    <div className="rounded-xl bg-[#090A0C] p-5 hover:bg-[#0f1012] transition-colors duration-300 group">
      <h4 className="font-semibold mb-2 text-[#F7F7F8] group-hover:text-[#FFD600] transition-colors">{title}</h4>
      <p className="text-xs text-[#9A9CA3]/50 mb-3">
        Trigger: <span className="text-[#F7F7F8]/70">{trigger}</span>
      </p>
      <div className="space-y-1.5">
        {actions.map((action, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-[#9A9CA3]/60">
            <div className="h-1.5 w-1.5 rounded-full bg-[#FFD600]/50" />
            {action}
          </div>
        ))}
      </div>
    </div>
  )
}
