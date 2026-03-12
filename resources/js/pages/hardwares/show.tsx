import { Button } from "@/components/default/button";
import useSafeBack from "@/hooks/use-safe-back";
import AppLayout from "@/layouts/app-layout";
import hardwares from "@/routes/hardwares";
import { BreadcrumbItem, SimpleIdentifier } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeftIcon, ClockIcon, CpuIcon, MessageSquareIcon, PencilIcon, Trash2Icon } from "lucide-react";

type HardwareStatus = {
  id: number;
  name: string;
  only_system: boolean;
};

type History = {
  id: number;
  name: string;
  serial_number: string | null;
  inventory_number: string | null;
  description: string;
  modified_at: string;
  category: SimpleIdentifier;
  status: SimpleIdentifier;
  manufacturer: SimpleIdentifier;
  updated_by: SimpleIdentifier;
};

type MoveHistory = {
  id: number;
  action: "attached" | "detached" | "moved";
  notes: string | null;
  created_at: string;
  hardware: SimpleIdentifier;
  machine: SimpleIdentifier | null;
  previous_machine: SimpleIdentifier | null;
  created_by: SimpleIdentifier;
};


type Hardware = {
  id: number;
  name: string;
  serial_number: string | null;
  inventory_number: string | null;
  description: string;
  updated_at_formatted: string;
  category: SimpleIdentifier;
  status: HardwareStatus;
  manufacturer: SimpleIdentifier;
  created_by: SimpleIdentifier;
  updated_by: SimpleIdentifier;
  machine: SimpleIdentifier | null;
  histories: History[];
  moveHistories: MoveHistory[];
};

type Props = {
  hardware: Hardware;
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Hardwares", href: hardwares.index().url },
  { title: "Visualização", href: "#" },
];

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

export default function ShowHardware({ hardware }: Props) {
  function handleDelete() {
    if (!confirm("Tem certeza que deseja remover este hardware?")) return;
    router.delete(hardwares.destroy(hardware.id).url);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={hardware.name} />

      <div className="mt-5 flex w-full flex-col gap-6 px-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => useSafeBack(hardwares.index().url)}
            >
              <ArrowLeftIcon className="size-4" />
            </Button>
            <div>
              <h2 className="text-foreground text-2xl font-bold">{hardware.name}</h2>
              <p className="text-muted-foreground text-sm">
                Criado por {hardware.created_by.name} · Última atualização por{" "}
                {hardware.updated_by.name} em {hardware.updated_at_formatted}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {
              hardware.status.only_system
                ? <>
                  <p>Hardware Vinculado</p>
                </>
                : <>
                  <Link href={hardwares.edit(hardware.id).url}>
                    <Button variant="outline" size="sm">
                      <PencilIcon className="mr-2 size-4" />
                      Editar
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={handleDelete}>
                    <Trash2Icon className="mr-2 size-4" />
                    Deletar
                  </Button>
                </>
            }
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
                      {hardware.status.name}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Categoria</dt>
                  <dd className="font-medium">{hardware.category.name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Fabricante</dt>
                  <dd className="font-medium">{hardware.manufacturer.name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Tombamento</dt>
                  <dd>{hardware.inventory_number ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Número de Série</dt>
                  <dd>{hardware.serial_number ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Última Atualização</dt>
                  <dd>{hardware.updated_at_formatted}</dd>
                </div>
              </dl>
            </div>

            {/* Máquina vinculada */}
            <div className="rounded-lg border p-5">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <CpuIcon className="size-4" />
                Máquina Vinculada
              </h3>
              {hardware.machine ? (
                <Link
                  href={`/machines/${hardware.machine.id}`}
                  className="hover:bg-muted/40 flex items-center justify-between rounded-md border p-3 transition-colors"
                >
                  <span className="text-sm font-medium">{hardware.machine.name}</span>
                  <ArrowLeftIcon className="text-muted-foreground size-4 rotate-180" />
                </Link>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Nenhuma máquina vinculada.
                </p>
              )}
            </div>
          </div>

          {/* Coluna direita — Descrição + Histórico */}
          <div className="space-y-6 lg:col-span-2">
            {/* Descrição */}
            <div className="rounded-lg border p-5">
              <h3 className="mb-4 font-semibold">Detalhes</h3>
              {
                hardware.description
                  ? (
                    <div
                      className="prose dark:prose-invert max-h-125 overflow-y-auto text-foreground max-w-none text-sm"
                      dangerouslySetInnerHTML={{ __html: hardware.description }}
                    />
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Nenhum detalhe registrado.
                    </p>
                  )
              }

            </div>

            {/* Histórico de movimentações */}
            <div className="rounded-lg border p-5">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <ClockIcon className="size-4" />
                Histórico de Movimentações
              </h3>

              {hardware.moveHistories.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhuma movimentação registrada.
                </p>
              ) : (
                <ol className="space-y-3">
                  {hardware.moveHistories.map((h) => (
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
                        <span>
                          → {h.machine?.name ?? h.previous_machine?.name}
                        </span>
                        <p className="text-muted-foreground text-xs">
                          {h.created_at} · por {h.created_by.name}
                          {h.notes && (
                            <span
                              title={h.notes}
                              className="border-muted-foreground/40 text-muted-foreground ml-2 inline-flex cursor-help items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs transition-colors hover:border-current"
                            >
                              <MessageSquareIcon className="size-3 shrink-0" />
                              Observação
                            </span>
                          )}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Histórico de alterações */}
            <div className="rounded-lg border p-5">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <ClockIcon className="size-4" />
                Histórico de Alterações
                <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                  {hardware.histories.length}
                </span>
              </h3>

              {hardware.histories.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhuma alteração registrada.
                </p>
              ) : (
                <ol className="space-y-3">
                  {hardware.histories.map((h, index) => (
                    <li key={h.id} className="text-sm">
                      <details className="group rounded-md border">
                        <summary className="hover:bg-muted/40 flex cursor-pointer list-none items-center justify-between rounded-md p-3 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                              v{hardware.histories.length - index}
                            </span>
                            <div>
                              <p className="font-medium">{h.name}</p>
                              <p className="text-muted-foreground text-xs">
                                {h.modified_at} · por {h.updated_by.name}
                              </p>
                            </div>
                          </div>
                          <span className="text-muted-foreground text-xs transition-transform group-open:rotate-180">
                            ▼
                          </span>
                        </summary>

                        <div className="border-t p-3">
                          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <div>
                              <dt className="text-muted-foreground">Status</dt>
                              <dd className="font-medium">{h.status.name}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Categoria</dt>
                              <dd className="font-medium">{h.category.name}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Fabricante</dt>
                              <dd className="font-medium">{h.manufacturer.name}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Tombamento</dt>
                              <dd>{h.inventory_number ?? "—"}</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Número de Série</dt>
                              <dd>{h.serial_number ?? "—"}</dd>
                            </div>
                          </dl>
                          {h.description && (
                            <div className="mt-3 border-t pt-3">
                              <p className="text-muted-foreground mb-1 text-xs">Descrição</p>
                              <div
                                className="prose dark:prose-invert text-foreground max-w-none text-xs"
                                dangerouslySetInnerHTML={{ __html: h.description }}
                              />
                            </div>
                          )}
                        </div>
                      </details>
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
