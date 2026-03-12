import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/default/dialog"
import { Button } from "@/components/default/button"
import { TriangleAlertIcon } from "lucide-react"

type Props = {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function UnsavedChangesDialog({ open, onConfirm, onCancel }: Props) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="flex flex-col items-center gap-2 text-center">
          <div className="bg-warning/10 flex size-12 items-center justify-center rounded-full">
            <TriangleAlertIcon className="text-warning size-6" />
          </div>
          <DialogTitle>Alterações não salvas</DialogTitle>
          <DialogDescription>
            Você tem alterações que ainda não foram salvas. Se sair agora, todos os dados preenchidos serão perdidos.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={onCancel}>
            Continuar editando
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Sair sem salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}