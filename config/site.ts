export const siteConfig = {
  name: 'Wembo',
  description: 'Wembo is a powerful Discord community platform for AI, automation, security, analytics, and server management.',
  tagline: 'Your Discord community, running smarter.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://wembo.xyz',
  ogImage: '/og.png',
  inviteUrl: `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || ''}&permissions=8&scope=bot%20applications.commands`,
  links: {
    discord: 'https://discord.gg/Hgvs5WnZaK',
    github: 'https://github.com/iknouee/wembo.gg',
    twitter: 'https://x.com/wembo',
  },
  nav: {
    main: [
      { title: 'Features', href: '/features' },
      { title: 'AI', href: '/ai' },
      { title: 'Security', href: '/security' },
      { title: 'Automations', href: '/automations' },
      { title: 'Pricing', href: '/pricing' },
      { title: 'Docs', href: '/docs' },
    ],
  },
  footer: {
    product: [
      { title: 'Features', href: '/features' },
      { title: 'AI', href: '/ai' },
      { title: 'Automations', href: '/automations' },
      { title: 'Security', href: '/security' },
      { title: 'Pricing', href: '/pricing' },
    ],
    resources: [
      { title: 'Documentation', href: '/docs' },
      { title: 'Support', href: '/docs#support' },
      { title: 'Status', href: '/status' },
      { title: 'Changelog', href: '/docs#changelog' },
    ],
    company: [
      { title: 'About', href: '#' },
      { title: 'Contact', href: '#' },
      { title: 'Privacy', href: '#' },
      { title: 'Terms', href: '#' },
    ],
  },
}
