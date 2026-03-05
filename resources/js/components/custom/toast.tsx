import * as ToastPrimitive from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

export const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border p-4 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
  {
    variants: {
      variant: {
        success: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
        error: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100",
        default: "border bg-background text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

const icons = {
  success: <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-600  dark:text-green-400" />,
  error: <XCircle className="mt-0.5 size-5 shrink-0 text-red-600    dark:text-red-400" />,
  warning: <AlertTriangle className="mt-0.5 size-5 shrink-0 text-yellow-600 dark:text-yellow-400" />,
  default: <Info className="mt-0.5 size-5 shrink-0 text-muted-foreground" />,
}

export type ToastVariant = keyof typeof icons

export interface ToastProps extends VariantProps<typeof toastVariants> {
  id: string
  message: string
  variant?: ToastVariant
}

export function Toast({ id, message, variant = "default" }: ToastProps) {
  return (
    <ToastPrimitive.Root
      className={cn(toastVariants({ variant }))}
      duration={4000}
    >
      {icons[variant]}
      <div className="flex-1">
        <ToastPrimitive.Description className="text-sm font-medium leading-snug">
          {message}
        </ToastPrimitive.Description>
      </div>
      <ToastPrimitive.Close className="text-current opacity-50 transition-opacity hover:opacity-100">
        <X className="size-4" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  )
}

export function ToastViewport() {
  return (
    <ToastPrimitive.Viewport className="fixed top-4 right-4 z-100 flex w-90 max-w-[100vw] flex-col gap-2 outline-none" />
  )
}