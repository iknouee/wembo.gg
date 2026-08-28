'use client'

import { useState } from 'react'
import {
  UserPlus,
  UserMinus,
  Save,
  Send,
  Hash,
  Mail,
  Palette,
  ImageIcon,
  Type,
  AlignLeft,
  Variable,
  Eye,
  Copy,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmbedPreview } from '@/components/dashboard/embed-preview'
import {
  mockWelcomeConfig,
  mockGoodbyeConfig,
  mockChannels,
  type WelcomeGoodbyeConfig,
} from '@/lib/mock-data'

type TabType = 'welcome' | 'goodbye'

export default function DashboardWelcomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('welcome')
  const [welcomeConfig, setWelcomeConfig] = useState<WelcomeGoodbyeConfig>(mockWelcomeConfig)
  const [goodbyeConfig, setGoodbyeConfig] = useState<WelcomeGoodbyeConfig>(mockGoodbyeConfig)
  const [testSending, setTestSending] = useState(false)

  const config = activeTab === 'welcome' ? welcomeConfig : goodbyeConfig
  const setConfig = activeTab === 'welcome' ? setWelcomeConfig : setGoodbyeConfig

  const updateEmbed = (field: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      embed: { ...prev.embed, [field]: value },
    }))
  }

  const handleTestSend = async () => {
    setTestSending(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setTestSending(false)
  }

  const variables = [
    { name: '{user}', description: 'Mentions the user' },
    { name: '{server}', description: 'Server name' },
    { name: '{membercount}', description: 'Total member count' },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome & Goodbye</h1>
          <p className="text-muted-foreground mt-1">
            Customize messages sent when members join or leave your server.
          </p>
        </div>
        <Button className="gap-2">
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('welcome')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'welcome'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
          }`}
        >
          <UserPlus className="h-4 w-4" />
          Welcome Message
        </button>
        <button
          onClick={() => setActiveTab('goodbye')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'goodbye'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
          }`}
        >
          <UserMinus className="h-4 w-4" />
          Goodbye Message
        </button>
      </div>

      {/* Settings + Variables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {activeTab === 'welcome' ? (
                <UserPlus className="h-4 w-4" />
              ) : (
                <UserMinus className="h-4 w-4" />
              )}
              {activeTab === 'welcome' ? 'Welcome' : 'Goodbye'} Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Enable Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-border/50">
              <div>
                <p className="text-sm font-medium">
                  Enable {activeTab === 'welcome' ? 'Welcome' : 'Goodbye'} Messages
                </p>
                <p className="text-xs text-muted-foreground">
                  Send a message when a member {activeTab === 'welcome' ? 'joins' : 'leaves'}
                </p>
              </div>
              <button
                onClick={() => setConfig((prev) => ({ ...prev, enabled: !prev.enabled }))}
                className={`h-6 w-11 rounded-full transition-colors ${
                  config.enabled ? 'bg-primary' : 'bg-muted'
                } relative`}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    config.enabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Channel Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                Channel
              </label>
              <select
                value={config.channelId}
                onChange={(e) => {
                  const channel = mockChannels.find((c) => c.id === e.target.value)
                  setConfig((prev) => ({
                    ...prev,
                    channelId: e.target.value,
                    channelName: channel?.name || '',
                  }))
                }}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {mockChannels.map((channel) => (
                  <option key={channel.id} value={channel.id}>
                    {channel.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DM Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-border/50">
              <div>
                <p className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  DM the user on {activeTab === 'welcome' ? 'join' : 'leave'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Also send a direct message to the user
                </p>
              </div>
              <button
                onClick={() => setConfig((prev) => ({ ...prev, dmEnabled: !prev.dmEnabled }))}
                className={`h-6 w-11 rounded-full transition-colors ${
                  config.dmEnabled ? 'bg-primary' : 'bg-muted'
                } relative`}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    config.dmEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* DM Message */}
            {config.dmEnabled && (
              <div className="space-y-2">
                <label className="text-sm font-medium">DM Message</label>
                <textarea
                  value={config.dmMessage}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, dmMessage: e.target.value }))
                  }
                  className="w-full h-24 px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Message to send via DM... Use {user}, {server}, {membercount}"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Variables */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Variable className="h-4 w-4" />
              Variables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Use these variables in your messages. They&apos;ll be replaced with real values when sent.
            </p>
            <div className="space-y-2">
              {variables.map((v) => (
                <div
                  key={v.name}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20"
                >
                  <div className="flex items-center gap-3">
                    <code className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {v.name}
                    </code>
                    <span className="text-sm text-muted-foreground">{v.description}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => navigator.clipboard.writeText(v.name)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Test Button */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleTestSend}
                disabled={testSending}
              >
                <Send className="h-4 w-4" />
                {testSending
                  ? 'Sending...'
                  : `Test ${activeTab === 'welcome' ? '/testwelcome' : '/testgoodbye'}`}
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Sends a test message to the selected channel
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Embed Editor + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Embed Editor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Color */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                Embed Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.embed.color}
                  onChange={(e) => updateEmbed('color', e.target.value)}
                  className="h-10 w-14 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={config.embed.color}
                  onChange={(e) => updateEmbed('color', e.target.value)}
                  className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex gap-1">
                  {['#5865F2', '#57F287', '#FEE75C', '#ED4245', '#EB459E'].map((c) => (
                    <button
                      key={c}
                      onClick={() => updateEmbed('color', c)}
                      className="h-6 w-6 rounded-full border border-border/50 transition-transform hover:scale-110"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Type className="h-3.5 w-3.5 text-muted-foreground" />
                Title
              </label>
              <input
                type="text"
                value={config.embed.title}
                onChange={(e) => updateEmbed('title', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Embed title..."
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />
                Description
              </label>
              <textarea
                value={config.embed.description}
                onChange={(e) => updateEmbed('description', e.target.value)}
                className="w-full h-32 px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Embed description... supports **bold** and newlines"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                Image URL
              </label>
              <input
                type="url"
                value={config.embed.imageUrl}
                onChange={(e) => updateEmbed('imageUrl', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="https://example.com/image.png"
              />
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                Thumbnail URL
              </label>
              <input
                type="url"
                value={config.embed.thumbnailUrl}
                onChange={(e) => updateEmbed('thumbnailUrl', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="https://example.com/thumbnail.png"
              />
            </div>

            {/* Footer */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />
                Footer Text
              </label>
              <input
                type="text"
                value={config.embed.footerText}
                onChange={(e) => updateEmbed('footerText', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Footer text..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              This is how the embed will look in Discord.
            </p>
            <div className="rounded-lg bg-[#313338] p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#5865F2] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">W</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">Wembo</span>
                    <Badge className="bg-[#5865F2]/20 text-[#5865F2] text-[10px] px-1 py-0 border-0">
                      BOT
                    </Badge>
                    <span className="text-xs text-[#949ba4]">Today at 12:00 PM</span>
                  </div>
                </div>
              </div>
              <div className="ml-10">
                <EmbedPreview
                  title={config.embed.title}
                  description={config.embed.description}
                  color={config.embed.color}
                  imageUrl={config.embed.imageUrl}
                  thumbnailUrl={config.embed.thumbnailUrl}
                  footerText={config.embed.footerText}
                />
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg border border-border/50 bg-muted/20">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-[10px]">
                  SLASH COMMAND
                </Badge>
              </div>
              <p className="text-sm font-mono text-muted-foreground">
                /{activeTab === 'welcome' ? 'testwelcome' : 'testgoodbye'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Use this command to send a test {activeTab === 'welcome' ? 'welcome' : 'goodbye'}{' '}
                message to the configured channel.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
