'use client'

import { Settings, Save, Globe, Bell, Shield, Bot, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardSettingsPage() {
  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Configure Wembo for your server.</p>
        </div>
        <Button size="sm" className="gap-1.5 text-[12px] h-8">
          <Save className="h-3.5 w-3.5" /> Save
        </Button>
      </div>

      {/* General Settings */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60 flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
          <h3 className="text-[13px] font-medium">General</h3>
        </div>
        <div className="divide-y divide-border/40">
          <SettingRow label="Server Name" value="Wembo Community" />
          <SettingRow label="Bot Prefix" value="!" />
          <SettingRow label="Language" value="English" />
          <SettingRow label="Timezone" value="UTC" />
        </div>
      </div>

      {/* Modules */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60 flex items-center gap-2">
          <Settings className="h-3.5 w-3.5 text-muted-foreground" />
          <h3 className="text-[13px] font-medium">Modules</h3>
        </div>
        <div className="divide-y divide-border/40">
          <ModuleToggle name="AI Assistant" description="AI-powered Q&A and summaries" enabled={true} icon={Bot} />
          <ModuleToggle name="Security" description="Anti-raid, anti-spam, threat detection" enabled={true} icon={Shield} />
          <ModuleToggle name="Notifications" description="Platform integration alerts" enabled={true} icon={Bell} />
          <ModuleToggle name="Custom Branding" description="Custom embed colors and footer" enabled={false} icon={Palette} />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-500/20 bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-red-500/20">
          <h3 className="text-[13px] font-medium text-red-400">Danger Zone</h3>
        </div>
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/15 bg-red-500/5">
            <div>
              <p className="text-[13px] font-medium">Reset all settings</p>
              <p className="text-[11px] text-muted-foreground">Reset all Wembo settings to defaults.</p>
            </div>
            <Button variant="destructive" size="sm" className="h-7 text-[11px]">Reset</Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/15 bg-red-500/5">
            <div>
              <p className="text-[13px] font-medium">Remove Wembo</p>
              <p className="text-[11px] text-muted-foreground">Remove Wembo and delete all data.</p>
            </div>
            <Button variant="destructive" size="sm" className="h-7 text-[11px]">Remove</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <div className="h-7 px-2.5 rounded-md border border-border/60 bg-muted/30 flex items-center text-[12px] font-medium">
        {value}
      </div>
    </div>
  )
}

function ModuleToggle({ name, description, enabled, icon: Icon }: {
  name: string; description: string; enabled: boolean; icon: React.ElementType
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <div>
          <p className="text-[13px] font-medium">{name}</p>
          <p className="text-[11px] text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className={`h-5 w-9 rounded-full transition-colors cursor-pointer ${enabled ? 'bg-primary' : 'bg-muted'} relative`}>
        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
      </div>
    </div>
  )
}
