import { cn } from "@/lib/utils";

export function ActionTag({ action }: { action: string }) {
  const actionLabel: Record<string, string> = {
    attached: "Vinculado",
    detached: "Desvinculado",
    moved: "Movido",
  };

  const actionClass: Record<string, string> = {
    attached: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    detached: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    moved: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  };

  return (
    <div className="flex items-center justify-center mt-0.5 shrink-0 min-w-22">
      <span
        className={cn(
          'rounded-full px-2 py-0.5 text-xs font-medium',
          actionClass[action] ?? 'bg-secondary text-secondary-foreground'
        )}
      >
        {actionLabel[action] ?? action}
      </span>
    </div>
  )
}