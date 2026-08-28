// ============================================
// Mock data for the Wembo dashboard
// Replace with real API calls when backend is ready
// ============================================

export const mockStats = {
  members: 12482,
  active: 3821,
  messages: 84291,
  growth: '+8.2%',
  communityHealth: 87,
}

export const mockInsights = [
  {
    id: '1',
    type: 'warning' as const,
    color: 'orange',
    message: '14 unanswered questions in the last 24 hours',
  },
  {
    id: '2',
    type: 'success' as const,
    color: 'green',
    message: 'Member retention increased 8% this week',
  },
  {
    id: '3',
    type: 'danger' as const,
    color: 'red',
    message: '2 suspicious accounts detected',
  },
]

export const mockSecurityEvents = [
  {
    id: '1',
    type: 'raid_attempt',
    description: 'Mass join attempt blocked (23 accounts)',
    timestamp: '2 minutes ago',
    severity: 'high' as const,
  },
  {
    id: '2',
    type: 'phishing',
    description: 'Phishing link detected and removed in #general',
    timestamp: '14 minutes ago',
    severity: 'medium' as const,
  },
  {
    id: '3',
    type: 'spam',
    description: 'Spam account auto-banned: suspicious_user#0001',
    timestamp: '1 hour ago',
    severity: 'low' as const,
  },
  {
    id: '4',
    type: 'impersonation',
    description: 'Potential staff impersonation detected',
    timestamp: '3 hours ago',
    severity: 'high' as const,
  },
]

export const mockActivityData = [
  { day: 'Mon', messages: 4200, members: 120 },
  { day: 'Tue', messages: 5100, members: 145 },
  { day: 'Wed', messages: 4800, members: 132 },
  { day: 'Thu', messages: 6200, members: 178 },
  { day: 'Fri', messages: 7100, members: 201 },
  { day: 'Sat', messages: 8400, members: 243 },
  { day: 'Sun', messages: 6800, members: 189 },
]

export const mockAutomations = [
  {
    id: '1',
    name: 'Welcome New Members',
    trigger: 'Member joins',
    status: 'active' as const,
    runs: 1247,
    lastRun: '2 minutes ago',
  },
  {
    id: '2',
    name: 'Anti-Raid Protection',
    trigger: 'Mass join detected',
    status: 'active' as const,
    runs: 23,
    lastRun: '2 hours ago',
  },
  {
    id: '3',
    name: 'Level Rewards',
    trigger: 'Level reached',
    status: 'active' as const,
    runs: 892,
    lastRun: '5 minutes ago',
  },
  {
    id: '4',
    name: 'YouTube Notifications',
    trigger: 'YouTube upload',
    status: 'paused' as const,
    runs: 156,
    lastRun: '2 days ago',
  },
]

export const mockMembers = [
  {
    id: '1',
    name: 'Alex',
    tag: 'Alex#1234',
    role: 'Trusted Member',
    reputation: 94,
    interests: ['Minecraft', 'Programming', 'Photography'],
    contributions: { answers: 184, guides: 31, events: 12 },
    joinedAt: '2023-03-15',
    status: 'online' as const,
  },
  {
    id: '2',
    name: 'Jamie',
    tag: 'Jamie#5678',
    role: 'Moderator',
    reputation: 98,
    interests: ['Python', 'Machine Learning', 'Gaming'],
    contributions: { answers: 312, guides: 47, events: 28 },
    joinedAt: '2022-11-02',
    status: 'online' as const,
  },
  {
    id: '3',
    name: 'Sam',
    tag: 'Sam#9012',
    role: 'Active Member',
    reputation: 76,
    interests: ['Web Development', 'Design', 'Music'],
    contributions: { answers: 89, guides: 12, events: 5 },
    joinedAt: '2024-01-20',
    status: 'idle' as const,
  },
]

export const mockForms = [
  {
    id: '1',
    name: 'Staff Application',
    submissions: 47,
    status: 'active' as const,
    lastSubmission: '1 hour ago',
  },
  {
    id: '2',
    name: 'Ban Appeal',
    submissions: 12,
    status: 'active' as const,
    lastSubmission: '3 hours ago',
  },
  {
    id: '3',
    name: 'Partner Application',
    submissions: 89,
    status: 'active' as const,
    lastSubmission: '30 minutes ago',
  },
]

export const mockSuggestions = [
  {
    id: '284',
    title: 'Add Minecraft events',
    author: 'GameMaster',
    upvotes: 183,
    downvotes: 12,
    status: 'under_review' as const,
    createdAt: '2 days ago',
  },
  {
    id: '283',
    title: 'Weekly community movie nights',
    author: 'CinemaFan',
    upvotes: 241,
    downvotes: 8,
    status: 'approved' as const,
    createdAt: '3 days ago',
  },
  {
    id: '282',
    title: 'Add more programming channels',
    author: 'CodeWizard',
    upvotes: 156,
    downvotes: 34,
    status: 'implemented' as const,
    createdAt: '5 days ago',
  },
]

export const mockTickets = [
  {
    id: '1',
    title: 'Need help with verification',
    user: 'NewUser#4567',
    category: 'Support',
    status: 'open' as const,
    assignee: 'Jamie',
    createdAt: '10 minutes ago',
  },
  {
    id: '2',
    title: 'Report: Inappropriate behavior in #general',
    user: 'Reporter#8901',
    category: 'Report',
    status: 'in_progress' as const,
    assignee: 'Alex',
    createdAt: '1 hour ago',
  },
  {
    id: '3',
    title: 'Partnership inquiry',
    user: 'Partner#2345',
    category: 'Partnership',
    status: 'closed' as const,
    assignee: 'Sam',
    createdAt: '1 day ago',
  },
]

export const mockKnowledge = [
  {
    id: '1',
    title: 'Server Rules',
    category: 'Rules',
    source: '#rules',
    lastUpdated: '1 week ago',
  },
  {
    id: '2',
    title: 'How to Verify',
    category: 'FAQ',
    source: '#verification',
    lastUpdated: '2 days ago',
  },
  {
    id: '3',
    title: 'Staff Application Guide',
    category: 'Guide',
    source: '#staff-info',
    lastUpdated: '3 days ago',
  },
  {
    id: '4',
    title: 'Event Hosting Rules',
    category: 'Documentation',
    source: '#events',
    lastUpdated: '1 week ago',
  },
]

export const mockIntegrations = [
  {
    id: '1',
    name: 'YouTube',
    description: 'Post notifications for new uploads',
    status: 'connected' as const,
    channel: '#youtube',
  },
  {
    id: '2',
    name: 'Twitch',
    description: 'Stream go-live notifications',
    status: 'connected' as const,
    channel: '#streams',
  },
  {
    id: '3',
    name: 'GitHub',
    description: 'Repository activity feed',
    status: 'disconnected' as const,
    channel: null,
  },
  {
    id: '4',
    name: 'Reddit',
    description: 'New post notifications from subreddits',
    status: 'disconnected' as const,
    channel: null,
  },
]

export const mockStatusServices = [
  { name: 'Wembo Bot', status: 'operational' as const, uptime: '99.98%' },
  { name: 'Dashboard', status: 'operational' as const, uptime: '99.99%' },
  { name: 'API', status: 'operational' as const, uptime: '99.97%' },
  { name: 'Database', status: 'operational' as const, uptime: '99.99%' },
  { name: 'Website', status: 'operational' as const, uptime: '100%' },
]


// ============================================
// Welcome & Goodbye Message Configuration
// ============================================

export interface WelcomeGoodbyeConfig {
  enabled: boolean
  channelId: string
  channelName: string
  embed: {
    title: string
    description: string
    color: string
    imageUrl: string
    thumbnailUrl: string
    footerText: string
  }
  dmEnabled: boolean
  dmMessage: string
}

export const mockWelcomeConfig: WelcomeGoodbyeConfig = {
  enabled: true,
  channelId: '1',
  channelName: '#welcome',
  embed: {
    title: 'Welcome to {server}! 🎉',
    description: 'Hey {user}, welcome to **{server}**! You are member #{membercount}.\n\nMake sure to read the rules and have fun!',
    color: '#5865F2',
    imageUrl: '',
    thumbnailUrl: '',
    footerText: 'Enjoy your stay!',
  },
  dmEnabled: false,
  dmMessage: 'Welcome to {server}, {user}! We\'re glad to have you. Check out #rules to get started.',
}

export const mockGoodbyeConfig: WelcomeGoodbyeConfig = {
  enabled: true,
  channelId: '1',
  channelName: '#goodbye',
  embed: {
    title: 'Goodbye! 👋',
    description: '{user} has left **{server}**. We now have {membercount} members.',
    color: '#ED4245',
    imageUrl: '',
    thumbnailUrl: '',
    footerText: 'We\'ll miss you!',
  },
  dmEnabled: false,
  dmMessage: '',
}

export const mockChannels = [
  { id: '1', name: '#welcome' },
  { id: '2', name: '#goodbye' },
  { id: '3', name: '#general' },
  { id: '4', name: '#announcements' },
  { id: '5', name: '#off-topic' },
  { id: '6', name: '#introductions' },
]
