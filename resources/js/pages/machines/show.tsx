import { CardMoveHistory } from "@/components/custom/card-move-history";
import { Button } from "@/components/default/button";
import useSafeBack from "@/hooks/use-safe-back";
import AppLayout from "@/layouts/app-layout";
import hardwares from "@/routes/hardwares";
import machines from "@/routes/machines";
import { BreadcrumbItem, SimpleIdentifier } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
  ArrowLeftIcon,
  ClockIcon,
  PencilIcon,
  Trash2Icon
} from "lucide-react";
import { useEffect } from "react";
import {
  HardwareMoveHistory
} from "@/pages/hardwares/types/hardware-move-history";
import { cn } from "@/lib/utils";

type HardwareItem = {
  id: number;
  name: string;
  serial_number: string | null;
  inventory_number: string | null;
  category: SimpleIdentifier;
  manufacturer: SimpleIdentifier;
  status: SimpleIdentifier;
};

type MachineHardware = {
  id: number;
  hardware: HardwareItem;
};

type Machine = {
  id: number;
  name: string;
  serial_number: string | null;
  inventory_number: string | null;
  category: SimpleIdentifier;
  manufacturer: SimpleIdentifier;
  status: SimpleIdentifier;
  created_by: SimpleIdentifier;
  updated_by: SimpleIdentifier;
  created_at: string;
  updated_at: string;
  machine_hardwares: MachineHardware[];
  hardware_histories: HardwareMoveHistory[];
};

type Props = { machine: Machine };

export default function ShowMachine({ machine }: Props) {
  const props = usePage().props;
  useEffect(() => {
    console.log(props);
  }, []);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Máquinas", href: machines.index().url },
    { title: "Visualizar", href: "#" },
    { title: machine.name, href: "#" },
  ];

  function handleDelete() {
    if (!confirm("Tem certeza que deseja remover esta máquina?")) return;
    router.delete(machines.destroy(machine.id).url);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={machine.name} />

      <div className="mt-5 flex w-full flex-col gap-6 px-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => useSafeBack(machines.index().url)}
            >
              <ArrowLeftIcon className="size-4" />
            </Button>
            <div>
              <h2 className="text-foreground text-2xl font-bold">
                {machine.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                Criado por {machine.created_by.name}
                · Última atualização por{" "}
                {machine.updated_by.name} em {machine.updated_at}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={machines.edit(machine.id).url}>
              <Button variant="outline" size="sm">
                <PencilIcon className="mr-2 size-4" />
                Editar
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2Icon className="mr-2 size-4" />
              Remover
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-lg border p-5">
              <h3 className="mb-4 font-semibold">Informações</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Categoria</dt>
                  <dd className="font-medium">{machine.category.name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>
                    <span className={cn(
                      "bg-secondary text-secondary-foreground rounded-full",
                      "px-2 py-0.5 text-xs font-medium"
                    )}>
                      {machine.status.name}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Fabricante</dt>
                  <dd className="font-medium">{machine.manufacturer.name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Número de Série</dt>
                  <dd>{machine.serial_number ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Tombamento</dt>
                  <dd>{machine.inventory_number ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Criado em</dt>
                  <dd>
                    {machine.created_at}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Atualizado em</dt>
                  <dd>
                    {machine.updated_at}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg border p-5">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                Hardwares Vinculados
                <span
                  className={cn(
                    "bg-secondary text-secondary-foreground rounded-full px-2",
                    "py-0.5 text-xs font-medium"
                  )}
                >
                  {machine.machine_hardwares.length}
                </span>
              </h3>

              {machine.machine_hardwares.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhum hardware vinculado.
                </p>
              ) : (
                <div className="space-y-2">
                  {machine.machine_hardwares.map(({ hardware }) => (
                    <Link
                      key={hardware.id}
                      href={hardwares.show(hardware.id).url}
                      className={cn(
                        "flex items-start justify-between rounded-md border",
                        "p-3 hover:bg-muted/40"
                      )}
                    >
                      <div>
                        <p className="text-sm font-medium">{hardware.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {hardware.category.name}
                          · {hardware.manufacturer.name}
                          {hardware.serial_number &&
                            ` · S/N: ${hardware.serial_number}`}
                          {hardware.inventory_number &&
                            ` · Tomb.: ${hardware.inventory_number}`}
                        </p>
                      </div>
                      <span className={cn(
                        "bg-secondary text-secondary-foreground rounded-full",
                        "px-2 py-0.5 text-xs font-medium"
                      )}>
                        {hardware.status.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border p-5">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <ClockIcon className="size-4" />
                Histórico de Movimentações
              </h3>

              {machine.hardware_histories.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhuma movimentação registrada.
                </p>
              ) : (
                <ol className="space-y-3">
                  {
                    machine.hardware_histories.map((h) => (
                      <li key={h.id}>
                        <CardMoveHistory
                          hwId={h.hardware.id}
                          date={h.modified_at}
                          title={
                            ` ← ${h.previous_machine?.name ?? h.machine?.name}`
                          }
                          userName={h.created_by.name}
                          notes={h.notes}
                          action={h.action}
                        />
                      </li>
                    ))
                  }
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}