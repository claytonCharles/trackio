import { Button } from "@/components/default/button";
import AppLayout from "@/layouts/app-layout";
import hardwares from "@/routes/hardwares";
import { BreadcrumbItem } from "@/types";
import { Link, router, usePage } from "@inertiajs/react";
import {
  ArrowLeftIcon,
  ClockIcon,
  CpuIcon,
  PencilIcon,
  Trash2Icon
} from "lucide-react";
import { Hardware } from "./types/hardware";
import { CardMoveHistory } from "@/components/custom/card-move-history";
import { ShowHeader, ShowToolbox } from "@/components/custom/show-header";
import { cn } from "@/lib/utils";
import machines from "@/routes/machines";

type Props = {
  hardware: Hardware;
  linked: boolean;
};

export default function ShowHardware({ hardware, linked }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Hardwares", href: hardwares.index().url },
    { title: "Visualização", href: "#" },
    { title: hardware.name, href: "#" }
  ];

  function handleDelete() {
    if (!confirm("Tem certeza que deseja remover este hardware?")) return;
    router.delete(hardwares.destroy(hardware.id).url);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>

      <div className="mt-5 flex w-full flex-col gap-6 px-6">
        <ShowHeader
          title={hardware.name}
          created_user_name={hardware.created_by.name}
          created_date={hardware.created_at}
          fallback_url={hardwares.index().url}
        >
          <ShowToolbox>
            {
              linked ? (
                <span
                  title="Hardwares em uso não podem ser modificados!"
                  className={cn(
                    "hover:bg-muted/40 flex items-center justify-between",
                    "rounded-md border p-3 transition-colors cursor-help"
                  )}
                >
                  Hardware em uso
                </span>
              ) : (
                <>
                  <Link href={hardwares.edit(hardware.id).url}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      <PencilIcon className="mr-2 size-4" />
                      Editar
                    </Button>
                  </Link>
                  <Button
                    className="cursor-pointer"
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                  >
                    <Trash2Icon className="mr-2 size-4" />
                    Deletar
                  </Button>
                </>
              )
            }
          </ShowToolbox>
        </ShowHeader>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-lg border p-5">
              <h3 className="mb-4 font-semibold">Informações</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>
                    <span
                      className={cn(
                        "bg-secondary text-secondary-foreground rounded-full",
                        "px-2 py-0.5 text-xs font-medium"
                      )}
                    >
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
                  <dt className="text-muted-foreground">
                    Última atualização
                  </dt>
                  <dd>
                    <span className="mr-1">{hardware.updated_at}</span>
                    <span>por {hardware.updated_by.name}</span>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border p-5">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <CpuIcon className="size-4" />
                Máquina Vinculada
              </h3>
              {hardware.machine_hardware ? (
                <Link
                  href={machines.show(hardware.machine_hardware.machine)}
                  className={cn(
                    "hover:bg-muted/40 flex items-center justify-between",
                    "rounded-md border p-3 transition-colors"
                  )}
                >
                  <span className="text-sm font-medium">
                    {hardware.machine_hardware.machine.name}
                  </span>
                  <ArrowLeftIcon
                    className="text-muted-foreground size-4 rotate-180"
                  />
                </Link>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Nenhuma máquina vinculada.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg border p-5">
              <h3 className="mb-4 font-semibold">Detalhes</h3>
              {
                hardware.description
                  ? (
                    <div
                      className={cn(
                        "prose dark:prose-invert max-h-125 overflow-y-auto",
                        "text-foreground max-w-none text-sm"
                      )}
                      dangerouslySetInnerHTML={{ __html: hardware.description }}
                    />
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Nenhum detalhe registrado.
                    </p>
                  )
              }
            </div>

            <div className="rounded-lg border p-5">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <ClockIcon className="size-4" />
                Histórico de Movimentações
              </h3>
              {hardware.move_histories.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhuma movimentação registrada.
                </p>
              ) : (
                <ol className="space-y-3">
                  {hardware.move_histories.map((h) => (
                    <li key={h.id}>
                      <CardMoveHistory
                        action={h.action}
                        date={h.modified_at}
                        notes={h.notes}
                        title={
                          h.machine?.name ?? h.previous_machine?.name ?? ''
                        }
                        userName={h.created_by.name}
                      />
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div className="rounded-lg border p-5">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <ClockIcon className="size-4" />
                Histórico de Alterações
                <span
                  className={cn(
                    "bg-secondary text-secondary-foreground rounded-full",
                    "px-2 py-0.5 text-xs font-medium"
                  )}
                >
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
                        <summary
                          className={cn(
                            "hover:bg-muted/40 flex cursor-pointer list-none",
                            "items-center justify-between rounded-md p-3",
                            "transition-colors"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                "bg-secondary text-secondary-foreground",
                                "rounded-full px-2 py-0.5 text-xs font-medium"
                              )}
                            >
                              v{hardware.histories.length - index}
                            </span>
                            <div>
                              <p className="font-medium">{h.name}</p>
                              <p className="text-muted-foreground text-xs">
                                {h.modified_at} · por {h.updated_by.name}
                              </p>
                            </div>
                          </div>
                          <span
                            className={cn(
                              "text-muted-foreground text-xs",
                              "transition-transform group-open:rotate-180"
                            )}
                          >
                            ▼
                          </span>
                        </summary>

                        <div className="border-t p-3">
                          <dl
                            className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs"
                          >
                            <div>
                              <dt className="text-muted-foreground">
                                Status
                              </dt>
                              <dd className="font-medium">
                                {h.status.name}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">
                                Categoria
                              </dt>
                              <dd className="font-medium">
                                {h.category.name
                                }</dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">
                                Fabricante
                              </dt>
                              <dd className="font-medium">
                                {h.manufacturer.name}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">
                                Tombamento
                              </dt>
                              <dd>{h.inventory_number ?? "—"}

                              </dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">
                                Número de Série
                              </dt>
                              <dd>
                                {h.serial_number ?? "—"}

                              </dd>
                            </div>
                          </dl>
                          {h.description && (
                            <div className="mt-3 border-t pt-3">
                              <p className="text-muted-foreground mb-1 text-xs">
                                Descrição
                              </p>
                              <div
                                className={cn(
                                  "prose dark:prose-invert text-foreground",
                                  "max-w-none text-xs"
                                )}
                                dangerouslySetInnerHTML={{
                                  __html: h.description
                                }}
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
    </AppLayout >
  );
}
