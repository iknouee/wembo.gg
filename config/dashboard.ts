import {
  BarChart3,
  Bell,
  Bot,
  FileText,
  Gavel,
  Heart,
  Home,
  Lightbulb,
  Puzzle,
  Settings,
  Shield,
  Ticket,
  Trophy,
  UserPlus,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

export interface NavSection {
  label: string
  items: NavItem[]
}

export const dashboardNav: NavSection[] = [
  {
    label: 'MAIN',
    items: [
      { title: 'Overview', href: '/dashboard', icon: Home },
    ],
  },
  {
    label: 'AUTOMATION',
    items: [
      { title: 'Automations', href: '/dashboard/automations', icon: Zap },
      { title: 'Welcome & Goodbye', href: '/dashboard/welcome', icon: UserPlus },
    ],
  },
  {
    label: 'MODERATION',
    items: [
      { title: 'Security', href: '/dashboard/security', icon: Shield },
      { title: 'Tickets', href: '/dashboard/tickets', icon: Ticket },
    ],
  },
  {
    label: 'COMMUNITY',
    items: [
      { title: 'Members', href: '/dashboard/members', icon: Users },
      { title: 'Engagement', href: '/dashboard/engagement', icon: Trophy },
      { title: 'Suggestions', href: '/dashboard/suggestions', icon: Heart },
      { title: 'Forms', href: '/dashboard/forms', icon: FileText },
    ],
  },
  {
    label: 'INTELLIGENCE',
    items: [
      { title: 'AI', href: '/dashboard/ai', icon: Bot },
      { title: 'Knowledge', href: '/dashboard/knowledge', icon: Lightbulb },
      { title: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'CONFIGURATION',
    items: [
      { title: 'Notifications', href: '/dashboard/notifications', icon: Bell },
      { title: 'Integrations', href: '/dashboard/integrations', icon: Puzzle },
      { title: 'Settings', href: '/dashboard/settings', icon: Settings },
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
