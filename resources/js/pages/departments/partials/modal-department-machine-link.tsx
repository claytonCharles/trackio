import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/default/dialog";
import { Input } from "@/components/default/input";
import { cn } from "@/lib/utils";
import departmentMachines from "@/routes/department-machines";
import { Form } from "@inertiajs/react";
import { Loader2Icon, SearchIcon, ServerIcon } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { Department } from "../types/department";
import { SimpleIdentifier } from "@/types";
import { Button } from "@/components/default/button";
import { Spinner } from "@/components/default/spinner";

type AvailableMachine = {
  id: number;
  name: string;
  serial_number: string | null;
  category: SimpleIdentifier;
  status: SimpleIdentifier;
};

type Props = {
  open: boolean,
  department: Department;
  onClose: Function
}

export function ModalDepartmentMachineLink({
  open,
  department,
  onClose
}: Props) {

  const [machines, setMachines] = useState<AvailableMachine[]>([]);
  const [selected, setSelected] = useState<AvailableMachine | null>(null);
  const [isPending, startTransition] = useTransition();

  const handlerSearchMachines = (term: string) => {
    startTransition(async () => {
      try {
        setSelected(null);
        const urlBase = departmentMachines.index(department.id).url;
        const response = await fetch(urlBase + `?search=${term}`);
        const { machines } = await response.json();
        setMachines(machines);
      } catch (exception) {
        setMachines([]);
      }
    })
  }

  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Vincular Máquina</DialogTitle>
          <DialogDescription>
            Departamento:{" "}
            <span className="text-foreground font-semibold">
              {department.name}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <SearchIcon className={cn(
            "text-muted-foreground absolute left-3 top-1/2 size-4",
            "-translate-y-1/2"
          )}
          />
          <Input
            className="pl-9"
            name="search"
            placeholder="Buscar máquina disponível..."
            onChange={(e) => {
              if (timeout.current) clearTimeout(timeout.current);

              timeout.current = setTimeout(() => {
                handlerSearchMachines(e.target.value)
              }, 300);
            }}
          />
          {isPending && (
            <Loader2Icon
              className={cn(
                "text-muted-foreground absolute right-3 top-1/2 size-4",
                "-translate-y-1/2 animate-spin"
              )}
            />
          )}
        </div>

        <div className="max-h-60 space-y-2 overflow-y-auto">
          {!isPending && machines.length === 0 && (
            <p className="text-muted-foreground py-6 text-center text-sm">
              Nenhuma máquina disponível encontrada. <br />
              Digite para buscar máquinas disponíveis.
            </p>
          )}
          {machines.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                selected?.id === m.id ? setSelected(null) : setSelected(m)
              }}
              className={cn(
                "w-full rounded-lg border p-3 text-left transition-colors",
                "hover:bg-muted/40 cursor-pointer",
                selected?.id === m.id && "border-primary/40 bg-primary/5"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "bg-muted flex size-8 shrink-0 items-center",
                  "justify-center rounded-md"
                )}>
                  <ServerIcon className="text-muted-foreground size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {m.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {m.category.name}
                  </p>
                </div>
                <span className={cn(
                  "bg-secondary text-secondary-foreground",
                  "shrink-0 rounded-full px-2 py-0.5 text-xs"
                )}>
                  {m.status.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        {selected && (
          <Form
            action={departmentMachines.store(department.id).url}
            method="POST"
            onSuccess={() => onClose()}
          >
            {({ processing }) => (
              <>
                <input type="hidden" name="machine_id" value={selected.id} />
                <div className="bg-muted/50 rounded-lg border p-3 text-sm">
                  <p className="text-muted-foreground mb-0.5 text-xs">
                    Selecionada
                  </p>
                  <p className="font-medium">{selected.name}</p>
                </div>
                <div className="flex justify-end pt-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onClose()}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={processing}>
                    {processing && <Spinner />}
                    Vincular
                  </Button>
                </div>
              </>
            )}
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}