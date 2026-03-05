import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import * as ToastPrimitive from "@radix-ui/react-toast"
import { Toast, ToastViewport, type ToastProps, type ToastVariant } from "@/components/custom/toast"

type ToastEntry = Omit<ToastProps, never>

type ToastContextType = {
  toast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([])

  const toast = useCallback((message: string, variant: ToastVariant = "default") => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4500)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((t) => (
          <Toast key={t.id} {...t} />
        ))}
        <ToastViewport />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast deve ser usado dentro de <ToastProvider>")
  return ctx
}