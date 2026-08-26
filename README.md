# Wembo

**Your Discord community, running smarter.**

Wembo is a premium Discord community management platform featuring AI-powered intelligence, smart security, powerful automation, community knowledge, forms and workflows, member intelligence, analytics, and advanced server management.

![Wembo](https://wembo.com/og.png)

## Features

- 🤖 **AI Assistant** — Server-specific knowledge, Q&A, summaries, and recommendations
- 🛡️ **Smart Security** — Anti-raid, phishing detection, threat scoring, automatic lockdown
- ⚡ **Automations** — Visual workflow builder with triggers, conditions, and actions
- 📊 **Analytics** — Real-time community metrics, growth data, and AI insights
- 💡 **Knowledge Base** — Turn your Discord into a searchable knowledge base
- 📝 **Forms & Workflows** — Applications, appeals, reports, and custom forms
- 👥 **Member Intelligence** — Reputation, expertise tracking, and member search
- 🔔 **Integrations** — YouTube, Twitch, GitHub, Reddit, RSS, webhooks
- 🎫 **Tickets** — Support panels, categories, assignments, and transcripts
- ❤️ **Suggestions** — Community voting, roadmap, and status tracking
- 🏆 **Engagement** — XP, levels, achievements, leaderboards, and rewards

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) pattern
- **Icons:** [Lucide](https://lucide.dev/)
- **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/iknouee/wembo.gg.git
cd wembo.gg

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

Create a `.env.local` file from `.env.example`:

| Variable | Description | Required | Public |
|----------|-------------|----------|--------|
| `DISCORD_CLIENT_ID` | Discord OAuth2 client ID | Yes | No |
| `DISCORD_CLIENT_SECRET` | Discord OAuth2 client secret | Yes | No |
| `DISCORD_BOT_TOKEN` | Discord bot token | Yes | No |
| `DATABASE_URL` | PostgreSQL connection string | Yes | No |
| `AUTH_SECRET` | Random secret for auth sessions | Yes | No |
| `AI_API_KEY` | AI provider API key | Yes | No |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes | Yes |

> ⚠️ Never commit `.env.local` or expose secrets in client-side code.

## Project Structure

```
wembo.gg/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Public marketing pages
│   │   ├── page.tsx        # Homepage
│   │   ├── features/       # Features page
│   │   ├── ai/             # AI page
│   │   ├── security/       # Security page
│   │   ├── automations/    # Automations page
│   │   ├── pricing/        # Pricing page
│   │   ├── docs/           # Documentation page
│   │   ├── status/         # Status page
│   │   └── login/          # Login page
│   ├── dashboard/          # Authenticated dashboard
│   │   ├── page.tsx        # Dashboard overview
│   │   ├── ai/             # AI management
│   │   ├── automations/    # Automation builder
│   │   ├── security/       # Security monitor
│   │   ├── members/        # Member management
│   │   ├── forms/          # Form builder
│   │   ├── knowledge/      # Knowledge base
│   │   ├── suggestions/    # Suggestion system
│   │   ├── tickets/        # Ticket system
│   │   ├── analytics/      # Analytics dashboard
│   │   ├── engagement/     # XP & levels
│   │   ├── notifications/  # Integration alerts
│   │   ├── integrations/   # External services
│   │   └── settings/       # Server settings
│   ├── layout.tsx          # Root layout
│   ├── globals.css         # Global styles
│   ├── loading.tsx         # Global loading state
│   ├── error.tsx           # Global error state
│   └── not-found.tsx       # 404 page
├── components/             # Reusable components
│   ├── ui/                 # Base UI components (shadcn pattern)
│   ├── dashboard/          # Dashboard-specific components
│   └── sections/           # Marketing page sections
├── config/                 # Configuration files
│   ├── site.ts             # Site metadata & navigation
│   ├── pricing.ts          # Pricing plans
│   └── dashboard.ts        # Dashboard navigation & mock servers
├── lib/                    # Utility functions
│   ├── utils.ts            # Class name utility
│   └── mock-data.ts        # Mock data for dashboard
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
├── .env.example            # Environment variable template
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Deployment (Vercel)

This project is designed for seamless Vercel deployment:

1. Push to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Set custom domain to `wembo.com`
5. Deploy

### Build Command

```bash
npm run build
```

### Production URL

Set `NEXT_PUBLIC_APP_URL=https://wembo.com` in production.

## Architecture Notes

### Mock Data → Real API

The dashboard currently uses mock data from `lib/mock-data.ts`. The architecture is designed to easily swap mock data for real API calls:

1. Replace mock data imports with API fetches (e.g., `fetch('/api/stats')`)
2. Add loading states (already included)
3. Add error states (already included)
4. Connect Discord OAuth for authentication

### Authentication

The login page is prepared for Discord OAuth2. To connect:

1. Set `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`
2. Create API routes for OAuth callback (`/api/auth/callback`)
3. Implement session management (NextAuth.js recommended)
4. Add middleware to protect `/dashboard` routes

### Database

No database is required for the frontend. When ready:

1. Set `DATABASE_URL` to your PostgreSQL instance
2. Add an ORM (Prisma recommended)
3. Create schemas for servers, members, automations, etc.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

All rights reserved. © Wembo 2024.
