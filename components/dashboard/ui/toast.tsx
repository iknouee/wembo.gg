'use client'

import { useEffect, useState, createContext, useContext, useCallback } from 'react'
import { Check, X, AlertTriangle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning'
interface ToastData { id: number; message: string; type: ToastType }

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} })
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map(t => (
          <ToastItem key={t.id} data={t} onDismiss={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ data, onDismiss }: { data: ToastData; onDismiss: () => void }) {
  const icons = {
    success: <Check className="h-4 w-4 text-emerald-400" />,
    error: <X className="h-4 w-4 text-red-400" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-400" />,
  }
  const styles = {
    success: 'toast-success',
    error: 'toast-error',
    warning: 'border-amber-500/20 text-amber-400',
  }

  return (
    <div className={`toast ${styles[data.type]}`}>
      {icons[data.type]}
      <span className="text-white/80">{data.message}</span>
      <button onClick={onDismiss} className="ml-2 text-white/20 hover:text-white/50 transition-colors">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
