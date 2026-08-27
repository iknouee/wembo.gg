'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Bot, Shield, Zap, BarChart3, FileText, Users, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ServerDashboard() {
  const { serverId } = useParams()

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Back */}
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[#9A9CA3] hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to servers
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Server Dashboard</h1>
        <p className="text-[#9A9CA3] mt-1 text-sm">
          Manage your server&apos;s Wembo configuration.
        </p>
      </div>

      {/* Coming soon grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FeatureCard icon={Bot} title="AI Assistant" description="Configure AI responses and knowledge sources" />
        <FeatureCard icon={Shield} title="Security" description="Anti-raid, threat detection, auto-moderation" />
        <FeatureCard icon={Zap} title="Automations" description="Build workflows and automated actions" />
        <FeatureCard icon={BarChart3} title="Analytics" description="Member growth, activity, and insights" />
        <FeatureCard icon={FileText} title="Forms" description="Applications, appeals, and custom forms" />
        <FeatureCard icon={Users} title="Members" description="Reputation, roles, and member management" />
      </div>

      {/* Coming soon notice */}
      <div className="rounded-xl border border-[#FFD600]/10 bg-[#FFD600]/[0.03] p-5 text-center">
        <p className="text-sm text-[#FFD600]/80 font-medium">🚧 Server management features are coming soon.</p>
        <p className="text-xs text-[#9A9CA3] mt-1">These features are currently in development.</p>
      </div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="rounded-xl bg-[#0a0b0d] border border-white/[0.04] shadow-lg shadow-black/20 p-5 hover:bg-[#0f1012] hover:border-white/[0.06] transition-colors">
      <div className="h-10 w-10 rounded-lg bg-[#141519] flex items-center justify-center mb-3">
        <Icon className="h-4 w-4 text-[#9A9CA3]" />
      </div>
      <h3 className="text-sm font-semibold text-white/80 mb-1">{title}</h3>
      <p className="text-xs text-[#9A9CA3]/70">{description}</p>
    </div>
  )
}
