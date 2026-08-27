'use client'

import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  variant?: 'danger' | 'default'
  loading?: boolean
}

export function ConfirmModal({ open, onClose, onConfirm, title, description, confirmLabel = 'Confirm', variant = 'default', loading }: ConfirmModalProps) {
  if (!open) return null

  const isDanger = variant === 'danger'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md dash-card-elevated p-6 animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/20 hover:text-white/50 transition-colors">
          <X className="h-4 w-4" />
        </button>

        <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${isDanger ? 'bg-red-500/10 text-red-400' : 'bg-[#FFD600]/10 text-[#FFD600]'}`}>
          <AlertTriangle className="h-5 w-5" />
        </div>

        <h3 className="text-[17px] font-bold text-white mb-2">{title}</h3>
        <p className="text-body-sm text-white/40 leading-relaxed">{description}</p>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg text-caption font-medium text-white/50 bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-lg text-caption font-semibold transition-colors ${isDanger ? 'bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/20' : 'bg-[#FFD600] text-black hover:bg-[#FFD600]/90'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
