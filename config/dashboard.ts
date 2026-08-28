import {
  BarChart3,
  Bell,
  Bot,
  FileText,
  Heart,
  Home,
  Lightbulb,
  Lock,
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
  children?: NavItem[]
}

export const dashboardNav: NavItem[] = [
  { title: 'Overview', href: '/dashboard', icon: Home },
  { title: 'AI', href: '/dashboard/ai', icon: Bot },
  {
    title: 'Automations',
    href: '/dashboard/automations',
    icon: Zap,
    children: [
      { title: 'Welcome & Goodbye', href: '/dashboard/welcome', icon: UserPlus },
    ],
  },
  { title: 'Security', href: '/dashboard/security', icon: Shield },
  { title: 'Members', href: '/dashboard/members', icon: Users },
  { title: 'Forms', href: '/dashboard/forms', icon: FileText },
  { title: 'Knowledge', href: '/dashboard/knowledge', icon: Lightbulb },
  { title: 'Suggestions', href: '/dashboard/suggestions', icon: Heart },
  { title: 'Tickets', href: '/dashboard/tickets', icon: Ticket },
  { title: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { title: 'Engagement', href: '/dashboard/engagement', icon: Trophy },
  { title: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { title: 'Integrations', href: '/dashboard/integrations', icon: Puzzle },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
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
