import { Button } from "@/components/default/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/default/dialog";
import { Label } from "@/components/default/label";
import { Spinner } from "@/components/default/spinner";
import { cn } from "@/lib/utils";
import { TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import { HardwareAvailable } from "../types/hardware-available";

type ModalNotesChangeProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onChangeNotes: (notes: string) => void;
  addedHardwares: HardwareAvailable[];
  removedHardwares: HardwareAvailable[];
  processing: boolean;
}

export function ModalNotesChange({
  open,
  onClose,
  onConfirm,
  onChangeNotes,
  addedHardwares,
  removedHardwares,
  processing
}: ModalNotesChangeProps) {

  const [notes, setNotes] = useState("");

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
          <DialogTitle>Confirmar mudanças nos hardwares</DialogTitle>
          <DialogDescription>
            Você está alterando os hardwares vinculados a esta máquina.
            Descreva o motivo (opcional).
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 text-sm">
          {addedHardwares.length > 0 && (
            <div
              className={cn(
                "rounded-lg border border-green-200 bg-green-50 p-3",
                "dark:border-green-900 dark:bg-green-950/30"
              )}
            >
              <p
                className={cn(
                  "mb-1.5 font-medium text-green-700 dark:text-green-400"
                )}
              >
                {addedHardwares.length} hardware(s) a vincular
              </p>
              <ul className="text-muted-foreground space-y-0.5 text-xs">
                {addedHardwares.map((hw) => (
                  <li key={hw.id}>+ {hw.name}</li>
                ))}
              </ul>
            </div>
          )}
          {removedHardwares.length > 0 && (
            <div
              className={cn(
                "rounded-lg border border-red-200 bg-red-50 p-3",
                "dark:border-red-900 dark:bg-red-950/30"
              )}
            >
              <p
                className="mb-1.5 font-medium text-red-700 dark:text-red-400"
              >
                {removedHardwares.length} hardware(s) a desvincular
              </p>
              <ul className="text-muted-foreground space-y-0.5 text-xs">
                {removedHardwares.map((hw) => (
                  <li key={hw.id}>− {hw.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="notes">Observação</Label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            onChange={(e) => onChangeNotes(e.target.value)}
            placeholder="Ex: Hardware realocado após manutenção preventiva..."
            className={cn(
              "border-input bg-background placeholder:text-muted-foreground",
              "focus-visible:ring-ring w-full rounded-lg border px-3 py-2",
              "text-sm outline-none focus-visible:ring-2"
            )}
          />
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => onClose()}>
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={() => onConfirm()}
            tabIndex={5}
            disabled={processing}
          >
            {processing && <Spinner />}
            Confirmar e salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}