'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-28 lg:py-36 relative">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-yellow-500/[0.03] rounded-full blur-[120px]" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-white">
            Ready to upgrade<br />your community?
          </h2>
          <p className="text-white/40 mb-10 leading-relaxed max-w-md mx-auto">
            Join thousands of servers using Wembo. Set up in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#">
              <Button size="lg" className="h-12 px-8 font-semibold bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 gap-2">
                Add Wembo to Discord
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="h-12 px-8 font-semibold border-white/10 text-white/60 hover:text-white hover:border-white/20">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
