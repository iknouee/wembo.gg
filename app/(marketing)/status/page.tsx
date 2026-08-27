'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockStatusServices } from '@/lib/mock-data'

function getStatusConfig(status: string) {
  switch (status) {
    case 'operational': return { icon: CheckCircle2, label: 'Operational', color: 'text-emerald-500' }
    case 'degraded': return { icon: AlertTriangle, label: 'Degraded', color: 'text-yellow-500' }
    case 'outage': return { icon: XCircle, label: 'Outage', color: 'text-red-500' }
    case 'maintenance': return { icon: Clock, label: 'Maintenance', color: 'text-blue-500' }
    default: return { icon: CheckCircle2, label: 'Unknown', color: 'text-[#9A9CA3]' }
  }
}

export default function StatusPage() {
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => { setIsVisible(true) }, [])

  const allOperational = mockStatusServices.every((s) => s.status === 'operational')

  return (
    <div className="relative min-h-screen bg-[#050505] py-24 lg:py-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/[0.02] rounded-full blur-[100px]" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold text-white tracking-tight mb-4">System Status</h1>
            <p className="text-[#9A9CA3]/60">Current status of Wembo services.</p>
            <p className="text-[11px] text-[#9A9CA3]/30 mt-2">Status monitoring will be connected when services are live.</p>
          </div>

          {/* Overall Status */}
          <div className={`rounded-2xl bg-[#090A0C] p-6 mb-6 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {allOperational ? (
                  <>
                    <div className="relative">
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                      <div className="absolute inset-0 h-3 w-3 rounded-full bg-emerald-500 animate-ping opacity-40" />
                    </div>
                    <span className="font-semibold text-emerald-400">All Systems Operational</span>
                  </>
                ) : (
                  <>
                    <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="font-semibold text-yellow-400">Some Systems Degraded</span>
                  </>
                )}
              </div>
              <span className="text-xs text-[#9A9CA3]/40">Last checked: just now</span>
            </div>
          </div>

          {/* Services */}
          <div className={`rounded-2xl bg-[#090A0C] overflow-hidden divide-y divide-white/[0.03] transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {mockStatusServices.map((service, i) => {
              const config = getStatusConfig(service.status)
              const StatusIcon = config.icon
              return (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-5 hover:bg-[#0f1012] transition-all duration-500"
                  style={{ transitionDelay: `${i * 80 + 300}ms`, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-10px)' }}
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`h-5 w-5 ${config.color}`} />
                    <span className="font-medium text-[#F7F7F8]/80">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#9A9CA3]/40">{service.uptime} uptime</span>
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">{config.label}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Incident History */}
          <div className={`mt-10 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h2 className="text-xl font-bold mb-5 text-white">Recent Incidents</h2>
            <div className="rounded-2xl bg-[#090A0C] p-8">
              <div className="text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500/60 mx-auto mb-3" />
                <p className="text-sm text-[#9A9CA3]/50">No recent incidents. All systems running smoothly.</p>
              </div>
            </div>
          </div>

          {/* Subscribe */}
          <div className={`mt-8 rounded-2xl bg-[#090A0C] p-6 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h3 className="font-semibold mb-2 text-white">Get notified about incidents</h3>
            <p className="text-sm text-[#9A9CA3]/50 mb-5">Subscribe to receive updates when services are affected.</p>
            <div className="flex max-w-sm mx-auto gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 h-10 rounded-xl border border-white/[0.03] bg-[#0D0E11] px-4 text-sm text-[#F7F7F8] focus:outline-none focus:border-[#FFD600]/20 transition-all placeholder:text-[#9A9CA3]/30"
                readOnly
              />
              <Button size="sm" className="rounded-xl px-5">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
