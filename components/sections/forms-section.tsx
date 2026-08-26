import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Clock, X } from 'lucide-react'

export function FormsSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Turn conversations into workflows.
          </h2>
          <p className="text-lg text-muted-foreground">
            Build applications, reports, appeals, registrations, and more — all within Discord.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Form Preview */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <h3 className="font-semibold">Staff Application</h3>
            </div>
            <div className="space-y-4">
              <FormField label="Name" placeholder="Your name" />
              <FormField label="Age" placeholder="Your age" />
              <FormField label="Timezone" placeholder="e.g. EST, GMT+1" />
              <FormField
                label="Previous experience"
                placeholder="Tell us about your moderation experience..."
                textarea
              />
              <FormField
                label="Why should we choose you?"
                placeholder="What makes you a great fit..."
                textarea
              />
              <FormField
                label="Scenario question"
                placeholder="A member is being toxic in general chat..."
                textarea
              />
              <Button className="w-full mt-2">Submit Application</Button>
            </div>
          </Card>

          {/* Admin Review */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Application Review</h3>
              <Badge variant="secondary">3 pending</Badge>
            </div>
            <div className="space-y-3">
              <ReviewItem
                name="Alex"
                time="2 hours ago"
                status="pending"
              />
              <ReviewItem
                name="Jordan"
                time="5 hours ago"
                status="approved"
              />
              <ReviewItem
                name="Casey"
                time="1 day ago"
                status="denied"
              />
            </div>
            <div className="border-t border-border mt-4 pt-4">
              <p className="text-xs text-muted-foreground mb-3">Reviewing: Alex&apos;s application</p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="ml-2">&ldquo;2 years moderating gaming communities&rdquo;</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Timezone:</span>
                  <span className="ml-2">GMT+1</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="gap-1">
                  <Check className="h-3 w-3" /> Approve
                </Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <X className="h-3 w-3" /> Deny
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

function FormField({
  label,
  placeholder,
  textarea,
}: {
  label: string
  placeholder: string
  textarea?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {textarea ? (
        <div className="w-full h-16 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          {placeholder}
        </div>
      ) : (
        <div className="w-full h-9 rounded-lg border border-border bg-muted/30 px-3 flex items-center text-xs text-muted-foreground">
          {placeholder}
        </div>
      )}
    </div>
  )
}

function ReviewItem({
  name,
  time,
  status,
}: {
  name: string
  time: string
  status: 'pending' | 'approved' | 'denied'
}) {
  const statusConfig = {
    pending: { badge: 'warning', label: 'Pending', icon: Clock },
    approved: { badge: 'success', label: 'Approved', icon: Check },
    denied: { badge: 'danger', label: 'Denied', icon: X },
  }
  const config = statusConfig[status]

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
          {name[0]}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
      <Badge variant={config.badge as any}>{config.label}</Badge>
    </div>
  )
}
