import { dashboard } from "@/routes"
import { router } from "@inertiajs/react"

export default function useSafeBack(fallbackUrl: string | null = null) {
  const url = fallbackUrl ?? dashboard().url;

  if (window.history.length > 1) {
    window.history.back()
  } else {
    router.visit(url)
  }
}