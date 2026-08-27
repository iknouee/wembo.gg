'use client'

import { Loader2 } from 'lucide-react'

interface SaveBarProps {
  show: boolean
  saving?: boolean
  onSave: () => void
  onReset: () => void
}

export function SaveBar({ show, saving, onSave, onReset }: SaveBarProps) {
  if (!show) return null

  return (
    <div className="save-bar lg:pl-[260px]">
      <div className="max-w-dash mx-auto w-full flex items-center justify-between">
        <p className="text-body-sm text-white/50">
          <span className="inline-block h-2 w-2 rounded-full bg-[#FFD600] mr-2 animate-pulse-dot" />
          Unsaved changes
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg text-caption font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg text-caption font-semibold bg-[#FFD600] text-black hover:bg-[#FFD600]/90 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
