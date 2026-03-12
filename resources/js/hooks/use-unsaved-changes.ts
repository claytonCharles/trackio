import { router } from "@inertiajs/react"
import { useEffect, useRef, useState } from "react"

export function useUnsavedChanges(enabled: boolean = true) {
  const [showDialog, setShowDialog] = useState(false)
  const pendingUrlRef = useRef<string | null>(null)
  const confirmedRef = useRef(false)
  const removeListenerRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Intercepta navegações do Inertia
    const removeInertia = router.on("before", (event) => {
      const visit = event.detail.visit as any

      // ignora submits (POST, PUT, PATCH, DELETE) — só bloqueia navegações GET
      if (visit.method && visit.method.toLowerCase() !== "get") return true

      if (confirmedRef.current) {
        confirmedRef.current = false
        return true
      }

      pendingUrlRef.current = visit.url?.toString() ?? null
      setShowDialog(true)
      return false
    })

    // Intercepta refresh/fechar aba
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    removeListenerRef.current = removeInertia

    return () => {
      removeInertia()
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [enabled])

  function confirm() {
    setShowDialog(false)
    confirmedRef.current = true

    // Reexecuta a navegação que foi bloqueada
    if (pendingUrlRef.current) {
      router.visit(pendingUrlRef.current)
      pendingUrlRef.current = null
    }
  }

  function cancel() {
    setShowDialog(false)
    pendingUrlRef.current = null
  }

  return { showDialog, confirm, cancel }
}