import {
  createContext, useContext, useState,
  useCallback, type ReactNode,
} from "react"
import { Toast, ToastViewport, type ToastProps, type ToastVariant } from "@/components/custom/toast"

type ToastEntry = Omit<ToastProps, "onDismiss">

type ToastContextType = {
  toast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((message: string, variant: ToastVariant = "default") => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, message, variant }])
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastViewport>
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={dismiss} />
        ))}
      </ToastViewport>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast deve ser usado dentro de <ToastProvider>")
  return ctx
}