import { useEffect } from "react"
import { router, usePage } from "@inertiajs/react"
import { useToast } from "@/hooks/use-toast"
import type { ToastVariant } from "@/components/custom/toast"


type Notification = { id: string; type: ToastVariant; message: string }

export function useFlashToast() {
  const { toast } = useToast()
  const { flashMsg, notifications } = usePage().props as any

  useEffect(() => {
    if (flashMsg?.message) {
      toast(flashMsg.message, flashMsg.type ?? "default");
    }
  }, [flashMsg]);

  useEffect(() => {
    if (!notifications?.length) return;

    notifications.forEach((n: Notification) => {
      toast(n.message, n.type ?? "default");
    });

    // Marca como lidas via request leve
    router.post("/notifications/read", {}, {
      preserveState: true,
      preserveScroll: true,
    });
  }, [notifications]);
}