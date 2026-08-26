export interface NavItem {
  title: string
  href: string
  disabled?: boolean
}

export interface Feature {
  title: string
  description: string
  icon: string
}

export interface Server {
  id: string
  name: string
  icon: string | null
  memberCount: number
}

export interface User {
  id: string
  name: string
  avatar: string | null
  discriminator: string
}

export type ServiceStatus = 'operational' | 'degraded' | 'outage' | 'maintenance'

export type InsightType = 'warning' | 'success' | 'danger' | 'info'

export type Severity = 'low' | 'medium' | 'high' | 'critical'

export type AutomationStatus = 'active' | 'paused' | 'error'

export type TicketStatus = 'open' | 'in_progress' | 'closed'

export type SuggestionStatus = 'pending' | 'under_review' | 'approved' | 'denied' | 'implemented'
