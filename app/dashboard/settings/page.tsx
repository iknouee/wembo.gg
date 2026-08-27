'use client'

import { Settings, Save, Globe, Bell, Shield, Bot, Palette } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function DashboardSettingsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure Wembo for your server.</p>
        </div>
        <Button className="gap-2">
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" /> General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingRow label="Server Name" value="Wembo Community" />
          <SettingRow label="Bot Prefix" value="!" />
          <SettingRow label="Language" value="English" />
          <SettingRow label="Timezone" value="UTC" />
        </CardContent>
      </Card>

      {/* Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4" /> Modules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ModuleToggle name="AI Assistant" description="AI-powered Q&A and summaries" enabled={true} icon={Bot} />
          <ModuleToggle name="Security" description="Anti-raid, anti-spam, threat detection" enabled={true} icon={Shield} />
          <ModuleToggle name="Notifications" description="Platform integration alerts" enabled={true} icon={Bell} />
          <ModuleToggle name="Custom Branding" description="Custom embed colors and footer" enabled={false} icon={Palette} />
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/20">
        <CardHeader>
          <CardTitle className="text-base text-red-500">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg  bg-red-500/5">
            <div>
              <p className="text-sm font-medium">Reset all settings</p>
              <p className="text-xs text-muted-foreground">This will reset all Wembo settings to defaults.</p>
            </div>
            <Button variant="destructive" size="sm">Reset</Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg  bg-red-500/5">
            <div>
              <p className="text-sm font-medium">Remove Wembo</p>
              <p className="text-xs text-muted-foreground">Remove Wembo from this server and delete all data.</p>
            </div>
            <Button variant="destructive" size="sm">Remove</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b /50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="h-9 px-3 rounded-lg  bg-muted/30 flex items-center text-sm">
        {value}
      </div>
    </div>
  )
}

function ModuleToggle({
  name,
  description,
  enabled,
  icon: Icon,
}: {
  name: string
  description: string
  enabled: boolean
  icon: React.ElementType
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg /50">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className={`h-6 w-11 rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-muted'} relative`}>
        <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </div>
    </div>
  )
}
