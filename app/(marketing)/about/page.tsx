import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about Wembo and our mission to make Discord communities smarter.',
}

export default function AboutPage() {
  return (
    <div className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight mb-6">About Wembo</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg">
            Wembo is the operating system for Discord communities. We help server owners
            and moderators manage, grow, and protect their communities with powerful
            automation, AI, analytics, and security tools.
          </p>
          <p>
            Our mission is to give every community the tools they need to thrive — whether
            you&apos;re running a small hobby server or managing a community of tens of
            thousands.
          </p>
          <p>
            Built by community managers, for community managers. We understand the
            challenges of running a Discord server because we&apos;ve been there ourselves.
          </p>
        </div>
      </div>
    </div>
  )
}
