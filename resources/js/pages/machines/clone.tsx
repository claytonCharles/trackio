import { Button } from "@/components/default/button";
import { Input } from "@/components/default/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/default/dialog";
import { Spinner } from "@/components/default/spinner";
import AppLayout from "@/layouts/app-layout";
import machines from "@/routes/machines";
import machineClone from "@/routes/machine-clone";
import { BreadcrumbItem, SimpleIdentifier } from "@/types";
import { Form, Head, router } from "@inertiajs/react";
import { useRef, useState } from "react";
import {
  CpuIcon,
  Loader2Icon,
  SearchIcon,
  ServerIcon,
  CopyIcon,
} from "lucide-react";
import { UnsavedChangesDialog } from "@/components/custom/unsaved-changes-dialog";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { Label } from "@/components/default/label";
import InputError from "@/components/default/input-error";

type MachineItem = {
  id: number;
  name: string;
  serial_number: string | null;
  inventory_number: string | null;
  category: SimpleIdentifier;
  manufacturer: SimpleIdentifier;
  status: SimpleIdentifier;
  machine_hardwares_count: number;
};

type Props = {
  listMachines: MachineItem[];
  pagination: { currentPage: number; lastPage: number; perPage: number; totalItems: number };
  filters: { search?: string };
};

export default function MachineTemplate({ listMachines, pagination, filters }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Máquinas", href: machines.index().url },
    { title: "Clonar Máquina", href: "#" },
  ];

  const [search, setSearch] = useState(filters.search ?? "");
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<MachineItem | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [copies, setCopies] = useState(1);
  const max = 200;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const term = e.target.value;
    setSearch(term);
    setSearching(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.get(
        machineClone.index().url,
        { search: term },
        { preserveState: true, preserveScroll: true, replace: true, onFinish: () => setSearching(false) },
      );
    }, 350);
  }

  function handleSelect(machine: MachineItem) {
    setSelected(machine);
    setShowConfirm(false);
  }

  function handleConfirmOpen() {
    if (!selected) return;
    setShowConfirm(true);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Clonar Máquina" />

      {/* Modal de confirmação */}
      {selected && (
        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader className="flex flex-col items-center gap-2 text-center">
              <div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
                <CopyIcon className="text-primary size-6" />
              </div>
              <DialogTitle>Confirmar clonagem</DialogTitle>
              <DialogDescription>
                Será criada uma nova máquina baseada em{" "}
                <span className="text-foreground font-semibold">{selected.name}</span>,
                copiando todos os {selected.machine_hardwares_count} hardware(s) vinculado(s).
                Serial e tombamento não serão copiados.
              </DialogDescription>
            </DialogHeader>

            {/* Resumo da máquina selecionada */}
            <div className="bg-muted/50 rounded-lg border p-4 text-sm">
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Categoria</dt>
                  <dd className="font-medium">{selected.category.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Fabricante</dt>
                  <dd className="font-medium">{selected.manufacturer.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="font-medium">{selected.status.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Hardwares</dt>
                  <dd className="font-medium">{selected.machine_hardwares_count}</dd>
                </div>
              </dl>
            </div>

            <Form
              action={machineClone.store(selected.id).url}
              method="POST"
            >
              {({ processing, errors }) => (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="copies">Número de cópias</Label>
                    <Input
                      id="copies"
                      name="copies"
                      type="number"
                      min={1}
                      max={max}
                      value={copies}
                      onChange={(e) => setCopies(Number(e.target.value))}
                    />
                    <p className="text-muted-foreground text-xs">
                      Máximo de {max} cópias por vez.
                    </p>
                    {errors.copies && <InputError message={errors.copies} />}
                  </div>

                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button type="button" variant="outline" onClick={() => setShowConfirm(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={processing}>
                      {processing && <Spinner />}
                      Clonar {copies > 1 ? `${copies} cópias` : "1 cópia"}
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </DialogContent>
        </Dialog>
      )}

      <div className="mt-5 flex w-full flex-col gap-6 px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
            <CopyIcon className="text-muted-foreground size-5" />
          </div>
          <div>
            <h2 className="text-foreground text-2xl font-bold tracking-tight">
              Clonar Máquina
            </h2>
            <p className="text-muted-foreground text-sm">
              Selecione uma máquina modelo para criar uma cópia com os mesmos hardwares.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Lista de máquinas */}
          <div className="lg:col-span-2">
            <div className="relative mb-4">
              <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                className="pl-9"
                placeholder="Buscar por nome, serial ou tombamento..."
                value={search}
                onChange={handleSearch}
              />
              {searching && (
                <Loader2Icon className="text-muted-foreground absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin" />
              )}
            </div>

            <div className="space-y-2">
              {listMachines.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                  <ServerIcon className="text-muted-foreground/40 mb-2 size-8" />
                  <p className="text-muted-foreground text-sm">Nenhuma máquina encontrada.</p>
                </div>
              ) : (
                listMachines.map((machine) => (
                  <button
                    key={machine.id}
                    type="button"
                    onClick={() => handleSelect(machine)}
                    className={`w-full rounded-lg border p-4 text-left transition-colors hover:bg-muted/40 ${selected?.id === machine.id
                      ? "border-primary/40 bg-primary/5"
                      : ""
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-muted mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md">
                          <ServerIcon className="text-muted-foreground size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{machine.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {machine.category.name} · {machine.manufacturer.name}
                          </p>
                          <p className="text-muted-foreground mt-1 text-xs">
                            {machine.machine_hardwares_count} hardware(s) vinculado(s)
                          </p>
                        </div>
                      </div>
                      <span className="bg-secondary text-secondary-foreground shrink-0 rounded-full px-2 py-0.5 text-xs font-medium">
                        {machine.status.name}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Painel lateral — máquina selecionada */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-lg border p-5">
              {!selected ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CpuIcon className="text-muted-foreground/40 mb-3 size-8" />
                  <p className="text-muted-foreground text-sm">
                    Selecione uma máquina ao lado para ver os detalhes.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="mb-4 font-semibold">{selected.name}</h3>
                  <dl className="mb-6 space-y-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Categoria</dt>
                      <dd className="font-medium">{selected.category.name}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Fabricante</dt>
                      <dd className="font-medium">{selected.manufacturer.name}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Status</dt>
                      <dd>
                        <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                          {selected.status.name}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Hardwares que serão copiados</dt>
                      <dd className="font-medium">{selected.machine_hardwares_count}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Serial / Tombamento</dt>
                      <dd className="text-muted-foreground italic">Não serão copiados</dd>
                    </div>
                  </dl>

                  <Button className="w-full" onClick={handleConfirmOpen}>
                    <CopyIcon className="mr-2 size-4" />
                    Clonar esta máquina
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}