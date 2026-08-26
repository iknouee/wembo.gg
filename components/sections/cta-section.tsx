'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-40 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`relative max-w-4xl mx-auto text-center rounded-3xl overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-violet-500/[0.04] to-indigo-500/[0.08]" />
          <div className="absolute inset-0 border border-white/[0.06] rounded-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/[0.06] rounded-full blur-[80px]" />

          {/* Floating elements */}
          <div className="absolute top-[20%] left-[10%] w-1.5 h-1.5 rounded-full bg-primary/30 animate-float" />
          <div className="absolute bottom-[30%] right-[15%] w-2 h-2 rounded-full bg-violet-400/20 animate-float-slow" />
          <div className="absolute top-[60%] left-[80%] w-1 h-1 rounded-full bg-indigo-400/30 animate-float" style={{ animationDelay: '1s' }} />

          <div className="relative p-12 lg:p-20">
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <Sparkles className="h-6 w-6 text-primary mx-auto mb-6 animate-pulse-glow" />
            </div>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Ready to run your community<br className="hidden sm:block" /> smarter?
            </h2>
            <p className={`text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Join thousands of Discord communities using Wembo for AI, automation, security, and more.
            </p>
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <Link href="#">
                <Button size="xl" className="gap-2.5 group shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-300">
                  Add Wembo to Discord
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline" className="border-white/10 hover:border-white/20 hover:bg-white/[0.03]">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
