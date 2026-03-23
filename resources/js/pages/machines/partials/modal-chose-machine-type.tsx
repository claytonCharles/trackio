import { Button } from "@/components/default/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/default/dialog";
import { cn } from "@/lib/utils";
import { TriangleAlertIcon } from "lucide-react";
import { useState } from "react";

type ModalChoseMachineTypeProps = {
  open: boolean;
  onChange: (template: boolean) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function ModalChoseMachineType({
  open,
  onChange,
  onClose,
  onConfirm
}: ModalChoseMachineTypeProps) {
  const [template, setTemplate] = useState(false);

  const handleChange = (option: boolean) => {
    setTemplate(option)
    onChange(option)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex flex-col items-center gap-2 text-center">
          <div
            className={cn(
              "bg-warning/10 flex size-12 items-center justify-center",
              "rounded-full"
            )}
          >
            <TriangleAlertIcon className="text-warning size-6" />
          </div>
          <DialogTitle>Escolher o modelo de cadastro</DialogTitle>
          <DialogDescription>
            Você está cadastrando uma nova máquina no sistema,
            deseja cadastra-la como?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center gap-3">
          <span
            className={cn(
              "border p-3 rounded-md cursor-pointer hover:bg-accent min-w-25",
              "text-center",
              !template && "ring-1 ring-offset-1"
            )}
            onClick={() => handleChange(false)}
          >
            Avulsa
          </span>
          <span
            className={cn(
              "border p-3 rounded-md cursor-pointer hover:bg-accent min-w-25",
              "text-center",
              template && "ring-1 ring-offset-1"
            )}
            onClick={() => handleChange(true)}
          >
            Template
          </span>
        </div>
        <div className="text-sm border p-3 rounded-md">
          {
            template ? (
              <p>
                Templates podem ser clonadas para adição em grandes quantidades
                no sistema.
              </p>
            ) : (
              <p>Avulsas são máquinas normais no sistema.</p>
            )
          }
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onClose()}>
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={() => onConfirm()}
            tabIndex={5}
          >
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}