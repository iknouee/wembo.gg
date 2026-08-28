import {
  Gavel,
  Home,
  Shield,
  UserPlus,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export interface NavSubItem {
  title: string
  href: string
}

export interface NavGroup {
  title: string
  icon: LucideIcon
  href: string
  children: NavSubItem[]
}

export interface NavSection {
  label: string
  groups: NavGroup[]
}

// Standalone top-level items (no section header, no expand)
export interface NavTopItem {
  title: string
  href: string
  icon: LucideIcon
}

export const dashboardTopItems: NavTopItem[] = [
  { title: 'Overview', href: '/dashboard', icon: Home },
]

export const dashboardSections: NavSection[] = [
  {
    label: 'SECURITY',
    groups: [
      {
        title: 'Security',
        icon: Shield,
        href: '/dashboard/security',
        children: [
          { title: 'Overview', href: '/dashboard/security' },
          { title: 'Anti-Raid', href: '/dashboard/security/anti-raid' },
          { title: 'Anti-Spam', href: '/dashboard/security/anti-spam' },
          { title: 'Anti-Nuke', href: '/dashboard/security/anti-nuke' },
          { title: 'Link Blocker', href: '/dashboard/security/link-blocker' },
          { title: 'Impersonation', href: '/dashboard/security/impersonation' },
          { title: 'Bot Guard', href: '/dashboard/security/bot-guard' },
          { title: 'Verification', href: '/dashboard/security/verification' },
          { title: 'Alt Detection', href: '/dashboard/security/alt-detection' },
          { title: 'Security Logs', href: '/dashboard/security/logs' },
        ],
      },
    ],
  },
  {
    label: 'MODERATION',
    groups: [
      {
        title: 'Moderation',
        icon: Gavel,
        href: '/dashboard/moderation',
        children: [
          { title: 'Warnings', href: '/dashboard/moderation/warnings' },
          { title: 'Mod Logs', href: '/dashboard/moderation/mod-logs' },
        ],
      },
    ],
  },
  {
    label: 'AUTOMATION',
    groups: [
      {
        title: 'Automations',
        icon: Zap,
        href: '/dashboard/automations',
        children: [
          { title: 'Welcome & Goodbye', href: '/dashboard/welcome' },
        ],
      },
    ],
  },
]

export interface MockServer {
  id: string
  name: string
  icon: string | null
  memberCount: number
}

export const mockServers: MockServer[] = [
  { id: '1', name: 'Wembo Community', icon: null, memberCount: 12482 },
  { id: '2', name: 'Gaming Hub', icon: null, memberCount: 8341 },
  { id: '3', name: 'Dev Collective', icon: null, memberCount: 3219 },
]
