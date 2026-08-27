import { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { siteConfig } from '@/config/site'
import { MessageSquare, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Wembo team for support, partnerships, or general inquiries.',
}

export default function ContactPage() {
  return (
    <div className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground mb-10">
          Have a question, partnership inquiry, or need support? Reach out to us.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="p-6">
            <MessageSquare className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Discord Community</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Join our Discord for the fastest support and community discussions.
            </p>
            <a
              href={siteConfig.links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Join Discord →
            </a>
          </Card>

          <Card className="p-6">
            <Mail className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-sm text-muted-foreground mb-4">
              For partnerships, enterprise inquiries, or formal communication.
            </p>
            <a
              href="mailto:hello@wembo.com"
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              hello@wembo.com →
            </a>
          </Card>
        </div>
      </div>
    </div>
  )
}
