'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, ArrowRight, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if already logged in — redirect to dashboard
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          router.replace('/dashboard')
        } else {
          setChecking(false)
          setIsVisible(true)
        }
      })
      .catch(() => {
        setChecking(false)
        setIsVisible(true)
      })
  }, [router])

  if (checking) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-[#FFD600] animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FFD600]/[0.03] rounded-full blur-[120px]" />

      <div className={`relative w-full max-w-md transition-all duration-700 ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0b0d] p-8 shadow-2xl shadow-black/30">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-14 w-14 rounded-xl bg-[#FFD600] flex items-center justify-center mb-5 shadow-lg shadow-[#FFD600]/20">
              <span className="text-black font-bold text-2xl">W</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-sm text-[#9A9CA3] mt-1.5">
              Sign in to access your Wembo dashboard
            </p>
          </div>

          {/* Discord Login Button */}
          <Link href="/api/auth/login">
            <button className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#5865F2] px-6 py-4 text-sm font-medium text-white hover:bg-[#4752C4] transition-all duration-300 hover:shadow-xl hover:shadow-[#5865F2]/25 hover:-translate-y-0.5 group/discord">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Continue with Discord
              <ArrowRight className="h-4 w-4 transition-transform group-hover/discord:translate-x-0.5" />
            </button>
          </Link>

          {/* Security note */}
          <div className="mt-6 flex items-start gap-2.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <Shield className="h-4 w-4 text-[#9A9CA3]/50 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#9A9CA3]/70 leading-relaxed">
              We only request access to your Discord identity and server list. We never read your messages or access private data.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#9A9CA3]/50">
              Don&apos;t have Wembo yet?{' '}
              <Link href="#" className="text-[#FFD600] hover:text-[#FFD600]/80 transition-colors">
                Add Wembo to your server
              </Link>
            </p>
          </div>
        </div>

        <p className="text-xs text-center text-[#9A9CA3]/30 mt-5">
          By signing in, you agree to our{' '}
          <Link href="#" className="underline hover:text-white/50 transition-colors">Terms</Link>
          {' '}and{' '}
          <Link href="#" className="underline hover:text-white/50 transition-colors">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
