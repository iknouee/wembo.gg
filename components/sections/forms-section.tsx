'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Clock, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function FormsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Turn conversations into{' '}
            <span className="text-gradient">workflows.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Build applications, reports, appeals, registrations, and more — all within Discord.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Form Preview */}
          <div className={`rounded-2xl border border-white/[0.06] bg-card/50 backdrop-blur-sm p-6 lg:p-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="flex items-center gap-3 mb-7">
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse-glow" />
              <h3 className="font-semibold text-lg">Staff Application</h3>
            </div>
            <div className="space-y-4">
              <FormField label="Name" placeholder="Your name" delay={300} visible={isVisible} />
              <FormField label="Age" placeholder="Your age" delay={400} visible={isVisible} />
              <FormField label="Timezone" placeholder="e.g. EST, GMT+1" delay={500} visible={isVisible} />
              <FormField label="Previous experience" placeholder="Tell us about your moderation experience..." textarea delay={600} visible={isVisible} />
              <FormField label="Why should we choose you?" placeholder="What makes you a great fit..." textarea delay={700} visible={isVisible} />
              <div className={`pt-2 transition-all duration-500`} style={{ transitionDelay: '800ms', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(10px)' }}>
                <Button className="w-full group">
                  Submit Application
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Admin Review */}
          <div className={`rounded-2xl border border-white/[0.06] bg-card/50 backdrop-blur-sm p-6 lg:p-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="flex items-center justify-between mb-7">
              <h3 className="font-semibold text-lg">Application Review</h3>
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/20">3 pending</Badge>
            </div>
            <div className="space-y-3 mb-6">
              <ReviewItem name="Alex" time="2 hours ago" status="pending" />
              <ReviewItem name="Jordan" time="5 hours ago" status="approved" />
              <ReviewItem name="Casey" time="1 day ago" status="denied" />
            </div>
            <div className="border-t border-white/[0.06] pt-5">
              <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-3">Reviewing: Alex&apos;s application</p>
              <div className="space-y-2.5 text-sm mb-5">
                <div className="flex gap-2">
                  <span className="text-muted-foreground/60 shrink-0">Experience:</span>
                  <span className="text-foreground/80">&ldquo;2 years moderating gaming communities&rdquo;</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground/60">Timezone:</span>
                  <span className="text-foreground/80">GMT+1</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="gap-1.5 shadow-lg shadow-primary/20">
                  <Check className="h-3.5 w-3.5" /> Approve
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 border-white/10">
                  <X className="h-3.5 w-3.5" /> Deny
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FormField({
  label,
  placeholder,
  textarea,
  delay,
  visible,
}: {
  label: string
  placeholder: string
  textarea?: boolean
  delay: number
  visible: boolean
}) {
  return (
    <div
      className="space-y-2 transition-all duration-500"
      style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)' }}
    >
      <label className="text-sm font-medium text-foreground/80">{label}</label>
      {textarea ? (
        <div className="w-full h-16 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs text-muted-foreground/50 hover:border-white/[0.1] transition-colors">
          {placeholder}
        </div>
      ) : (
        <div className="w-full h-10 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 flex items-center text-xs text-muted-foreground/50 hover:border-white/[0.1] transition-colors">
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
    pending: { variant: 'warning' as const, label: 'Pending', icon: Clock },
    approved: { variant: 'success' as const, label: 'Approved', icon: Check },
    denied: { variant: 'danger' as const, label: 'Denied', icon: X },
  }
  const config = statusConfig[status]

  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] transition-all duration-300 group">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-xs font-medium group-hover:from-primary/40 transition-all">
          {name[0]}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground/50">{time}</p>
        </div>
      </div>
      <Badge variant={config.variant}>{config.label}</Badge>
    </div>
  )
}
