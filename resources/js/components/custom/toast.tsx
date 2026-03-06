import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ReactNode, useEffect, useRef, useState } from "react"

export type ToastVariant = "success" | "error" | "warning" | "default"

export interface ToastProps {
  id: string
  message: string
  variant?: ToastVariant
  duration?: number
  onDismiss: (id: string) => void
}

const DURATION = 4000

const config: Record<ToastVariant, {
  icon: React.ReactNode
  bar: string
  container: string
  iconWrapper: string
  closeBtn: string
}> = {
  success: {
    icon: <CheckCircle className="size-5" />,
    bar: "bg-green-500",
    container: "border-green-200 bg-green-50 text-green-900 dark:border-green-800/60 dark:bg-green-950/90 dark:text-green-100",
    iconWrapper: "text-green-600 dark:text-green-400",
    closeBtn: "hover:bg-green-100 dark:hover:bg-green-900",
  },
  error: {
    icon: <XCircle className="size-5" />,
    bar: "bg-red-500",
    container: "border-red-200 bg-red-50 text-red-900 dark:border-red-800/60 dark:bg-red-950/90 dark:text-red-100",
    iconWrapper: "text-red-600 dark:text-red-400",
    closeBtn: "hover:bg-red-100 dark:hover:bg-red-900",
  },
  warning: {
    icon: <AlertTriangle className="size-5" />,
    bar: "bg-yellow-500",
    container: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800/60 dark:bg-yellow-950/90 dark:text-yellow-100",
    iconWrapper: "text-yellow-600 dark:text-yellow-400",
    closeBtn: "hover:bg-yellow-100 dark:hover:bg-yellow-900",
  },
  default: {
    icon: <Info className="size-5" />,
    bar: "bg-foreground/40",
    container: "border bg-background text-foreground",
    iconWrapper: "text-muted-foreground",
    closeBtn: "hover:bg-muted",
  },
}

export function Toast({
  id,
  message,
  variant = "default",
  duration = DURATION,
  onDismiss,
}: ToastProps) {
  const { icon, bar, container, iconWrapper, closeBtn } = config[variant]

  // "visible" controla entrada/saída via CSS
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(100)

  const pausedRef = useRef(false)
  const remaining = useRef(duration)
  const lastTickRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  // dispara animação de entrada no próximo frame
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // fecha com animação: tira visible, espera transição acabar, remove do DOM
  function dismiss() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setVisible(false)
    setTimeout(() => onDismiss(id), 300) // mesmo tempo da transition de saída
  }

  // loop do timer — 100% no nosso controle
  useEffect(() => {
    const tick = (now: number) => {
      if (!pausedRef.current) {
        if (lastTickRef.current !== null) {
          const delta = now - lastTickRef.current
          remaining.current = Math.max(0, remaining.current - delta)
          setProgress((remaining.current / duration) * 100)

          if (remaining.current <= 0) {
            dismiss()
            return
          }
        }
        lastTickRef.current = now
      } else {
        // pausado: zera lastTick para não acumular delta ao retomar
        lastTickRef.current = null
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [duration])

  return (
    <div
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
      className={cn(
        // base
        "group pointer-events-auto relative flex w-full flex-col overflow-hidden rounded-xl border shadow-lg backdrop-blur-sm",
        // transição CSS — entrada e saída
        "transition-all duration-300 ease-out",
        visible
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0",
        container,
      )}
    >
      {/* Corpo */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-3">
        <div className="flex justify-start items-center gap-3">
          <span className={cn("mt-px shrink-0", iconWrapper)}>
            {icon}
          </span>

          <p className="flex-1 text-sm font-medium leading-snug">
            {message}
          </p>
        </div>
        <button
          onClick={dismiss}
          className={cn(
            "ml-1 shrink-0 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100",
            closeBtn,
          )}
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Barra de progresso */}
      <div className="h-1 w-full bg-black/10 dark:bg-white/10">
        <div
          className={cn("h-full", bar)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export function ToastViewport({ children }: { children: ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-100 flex w-95 max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none">
      {children}
    </div>
  )
}