import { useEffect } from "react"
import { router, usePage } from "@inertiajs/react"
import { useToast } from "@/hooks/use-toast"
import type { ToastVariant } from "@/components/custom/toast"
import { useMachineCloneChannel } from "@/hooks/use-machine-clone-channel";

export function useFlashToast() {
  const { toast } = useToast()
  const { flashMsg } = usePage().props as any

  useMachineCloneChannel();

  useEffect(() => {
    if (flashMsg?.message) {
      toast(flashMsg.message, flashMsg.type ?? "default");
    }
  }, [flashMsg]);
}