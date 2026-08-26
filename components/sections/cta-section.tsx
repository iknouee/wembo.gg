'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(220,16%,4%)]" />
      {/* Decorative */}
      <div className="absolute top-[20%] left-[10%] w-[200px] h-[200px] border border-yellow-500/[0.06] rounded-3xl rotate-12 animate-float" />
      <div className="absolute bottom-[10%] right-[10%] w-[150px] h-[150px] border border-yellow-500/[0.05] rounded-2xl -rotate-12 animate-float-reverse" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/[0.03] rounded-full blur-[120px]" />

      <div className="relative container mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
          Ready to level up<br />your community?
        </h2>
        <p className="text-white/35 mb-10 max-w-md mx-auto leading-relaxed">
          Join thousands of Discord servers using Wembo. Takes under 2 minutes to set up.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="#">
            <Button size="xl">Invite Wembo</Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="gap-2">
              Open Dashboard <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
