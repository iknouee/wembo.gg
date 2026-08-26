'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 surface-0" />
      <div className="divider-glow absolute top-0 left-0 right-0" />

      {/* Centered yellow radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#FFD600]/[0.015] rounded-full blur-[180px]" />

      {/* Content */}
      <div className={`relative max-w-content mx-auto px-4 lg:px-8 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h2 className="text-[clamp(2rem,4.5vw,3rem)] font-bold text-white tracking-tight leading-[1.1] mb-5">
          Your server deserves smarter tools.
        </h2>
        <p className="text-[16px] text-[#9A9CA3] mb-10 max-w-lg mx-auto leading-relaxed">
          Bring AI, automation, security and community intelligence together in one powerful Discord platform.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
          <Link href="#">
            <Button size="xl" className="gap-2.5 group glow-md">
              Add Wembo to Discord
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline">
              View Pricing
            </Button>
          </Link>
        </div>

        {/* Small text below */}
        <p className="text-[12px] text-[#9A9CA3]/60">
          Setup takes less than 2 minutes.
        </p>
      </div>
    </section>
  )
}
