import { useEffect } from "react"
import { usePage } from "@inertiajs/react"
import { useToast } from "@/hooks/use-toast"
import type { ToastVariant } from "@/components/custom/toast"

type FlashMsg = {
  type: ToastVariant
  message: string
} | null

export function useFlashToast() {
  const { toast } = useToast()
  const { flashMsg } = usePage().props as { flashMsg?: FlashMsg }

  useEffect(() => {
    if (!flashMsg) return
    toast(flashMsg.message, flashMsg.type ?? "default")
  }, [flashMsg])
}