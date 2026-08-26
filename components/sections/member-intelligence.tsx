'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, Star, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function MemberIntelligence() {
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
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-indigo-500/[0.01] to-background" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-violet-500/[0.03] rounded-full blur-[100px]" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Know your{' '}
            <span className="text-gradient">members.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Understand who your community members are, what they contribute, and how to find the right person for anything.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Member Profile */}
          <div className={`rounded-2xl border border-white/[0.06] bg-card/50 backdrop-blur-sm p-6 lg:p-8 hover:border-white/[0.1] transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="flex items-center gap-4 mb-7">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/60 to-violet-500/30 flex items-center justify-center text-xl font-bold">
                  A
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-500 border-2 border-card" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Alex</h3>
                <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 mt-1">Trusted Member</Badge>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs text-muted-foreground/50 uppercase tracking-widest mb-3">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {['Minecraft', 'Programming', 'Photography'].map((interest) => (
                    <Badge key={interest} variant="secondary" className="bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08] transition-colors">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground/50 uppercase tracking-widest mb-3">Contributions</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: '184', label: 'Helpful answers' },
                    { value: '31', label: 'Guides' },
                    { value: '12', label: 'Events' },
                  ].map((stat, i) => (
                    <div
                      key={stat.label}
                      className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:border-primary/20 transition-all duration-300"
                    >
                      <p className={`text-lg font-bold transition-all duration-700`} style={{ transitionDelay: `${i * 150 + 600}ms`, opacity: isVisible ? 1 : 0 }}>{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground/50 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground/50 uppercase tracking-widest mb-3">Reputation</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary via-violet-400 to-green-400 rounded-full transition-all duration-1500 ease-out"
                      style={{ width: isVisible ? '94%' : '0%', transitionDelay: '800ms' }}
                    />
                  </div>
                  <span className="text-sm font-bold">94<span className="text-muted-foreground/50">/100</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Find Someone */}
          <div className={`rounded-2xl border border-white/[0.06] bg-card/50 backdrop-blur-sm p-6 lg:p-8 hover:border-white/[0.1] transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="flex items-center gap-2.5 mb-7">
              <Search className="h-5 w-5 text-muted-foreground/60" />
              <h3 className="font-semibold text-lg">Find someone</h3>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 mb-7 group hover:border-primary/20 transition-colors duration-300">
              <p className="text-sm text-foreground/70">&ldquo;Who can help with Python?&rdquo;</p>
            </div>

            <div className="space-y-3">
              <SearchResult name="Alex" expertise="Programming" reputation={94} delay={500} visible={isVisible} />
              <SearchResult name="Jamie" expertise="Python" reputation={98} delay={600} visible={isVisible} />
              <SearchResult name="Sam" expertise="Web Development" reputation={76} delay={700} visible={isVisible} />
            </div>

            <p className="text-xs text-muted-foreground/40 mt-6 leading-relaxed">
              Wembo matches your query to member expertise, contributions, and activity patterns.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function SearchResult({
  name,
  expertise,
  reputation,
  delay,
  visible,
}: {
  name: string
  expertise: string
  reputation: number
  delay: number
  visible: boolean
}) {
  return (
    <div
      className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-300 group cursor-pointer"
      style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(10px)' }}
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-sm font-medium group-hover:from-primary/40 transition-all">
          {name[0]}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground/50">{expertise}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Star className="h-3 w-3 text-yellow-500" />
        <span className="text-xs font-semibold">{reputation}</span>
        <ArrowRight className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  )
}
