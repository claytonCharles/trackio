import { Button } from "@/components/default/button";
import useSafeBack from "@/hooks/use-safe-back";
import AppLayout from "@/layouts/app-layout";
import hardwares from "@/routes/hardwares";
import machines from "@/routes/machines";
import { BreadcrumbItem, SimpleIdentifier } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { ArrowLeftIcon, ClockIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useEffect } from "react";

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

type History = {
  id: number;
  action: "attached" | "detached" | "moved";
  notes: string | null;
  created_at: string;
  hardware: SimpleIdentifier;
  previous_machine: SimpleIdentifier | null;
  created_by: SimpleIdentifier;
};

type Machine = {
  id: number;
  name: string;
  serial_number: string | null;
  inventory_number: string | null;
  manufacturer: SimpleIdentifier;
  status: SimpleIdentifier;
  created_by: SimpleIdentifier;
  updated_by: SimpleIdentifier;
  created_at: string;
  updated_at: string;
  machine_hardwares: MachineHardware[];
  hardware_histories: History[];
};

type Props = { machine: Machine };

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
        {/* Header */}
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
                Criado por {machine.created_by.name} · Última atualização por{" "}
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
          {/* Coluna esquerda — Informações */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-lg border p-5">
              <h3 className="mb-4 font-semibold">Informações</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>
                    <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
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

          {/* Coluna direita — Hardwares + Histórico */}
          <div className="space-y-6 lg:col-span-2">
            {/* Hardwares vinculados */}
            <div className="rounded-lg border p-5">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                Hardwares Vinculados
                <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
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
                      className="flex items-start justify-between rounded-md border p-3 hover:bg-muted/40"
                    >
                      <div>
                        <p className="text-sm font-medium">{hardware.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {hardware.category.name} · {hardware.manufacturer.name}
                          {hardware.serial_number &&
                            ` · S/N: ${hardware.serial_number}`}
                          {hardware.inventory_number &&
                            ` · Tomb.: ${hardware.inventory_number}`}
                        </p>
                      </div>
                      <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                        {hardware.status.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Histórico de movimentações */}
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
                  {machine.hardware_histories.map((h) => (
                    <li key={h.id} className="flex gap-3 text-sm">
                      <div className="mt-0.5 shrink-0">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${actionClass[h.action] ?? "bg-secondary text-secondary-foreground"
                            }`}
                        >
                          {actionLabel[h.action] ?? h.action}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p>
                          <span className="font-medium">{h.hardware.name}</span>
                          {h.previous_machine && (
                            <span className="text-muted-foreground">
                              {" "}
                              ← {h.previous_machine.name}
                            </span>
                          )}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {h.created_at} ·
                          por {h.created_by.name}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}