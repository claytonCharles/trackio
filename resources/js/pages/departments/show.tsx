import { Button } from "@/components/default/button";
import AppLayout from "@/layouts/app-layout";
import departments from "@/routes/departments";
import machines from "@/routes/machines";
import { BreadcrumbItem } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import {
  ArrowLeftIcon,
  ClockIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  ServerIcon,
  UnlinkIcon,
} from "lucide-react";
import { useState } from "react";
import {
  ModalDepartmentMachineLink
} from "./partials/modal-department-machine-link";
import { Department } from "./types/department";
import { MachineItem } from "./types/machine-item";
import {
  ModalDepartmentMachineUnlink
} from "./partials/modal-department-machine-unlink";
import { ModalDepartmentSave } from "./partials/modal-department-save";
import { cn } from "@/lib/utils";
import { ActionTag } from "@/components/custom/action-tag";

type Props = {
  department: Department;
  can: { write: boolean; delete: boolean };
};


export default function DepartmentShow({ department, can }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Departamentos", href: departments.index().url },
    { title: "Visualizar", href: "#" },
    { title: department.name, href: "#" },
  ];

  const [showEdit, setShowEdit] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [unlinkTarget, setUnlinkTarget] = useState<MachineItem | null>(null);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={department.name} />

      <ModalDepartmentMachineLink
        open={showLink}
        department={department}
        onClose={() => setShowLink(false)}
      />

      <ModalDepartmentMachineUnlink
        open={!!unlinkTarget}
        department={department}
        machine={unlinkTarget}
        onClose={() => setUnlinkTarget(null)}
      />

      <ModalDepartmentSave
        open={showEdit}
        department={department}
        onClose={() => setShowEdit(false)}
      />

      <div className="mt-5 flex w-full flex-col gap-6 px-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost" size="icon"
              onClick={() => router.visit(departments.index().url)}
            >
              <ArrowLeftIcon className="size-4" />
            </Button>
            <div>
              <h2 className="text-foreground text-2xl font-bold">
                {department.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                Criado por {department.created_by.name}
                · Última atualização por{" "}
                {department.updated_by.name} em {department.updated_at}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEdit(true)}
            >
              <PencilIcon className="mr-2 size-4" />
              Editar
            </Button>

            <Button size="sm" onClick={() => setShowLink(true)}>
              <PlusIcon className="mr-2 size-4" />
              Vincular máquina
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-lg border p-5">
              <h3 className="mb-4 font-semibold">Informações</h3>
              <dl className="space-y-3 text-sm">

                <div>
                  <dt className="text-muted-foreground">Localização</dt>
                  <dd className="flex items-center gap-1 font-medium">
                    <MapPinIcon className="size-3.5" />
                    {department.location ?? "Sem Localização"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Descrição</dt>
                  <dd>{department.description ?? "Sem Descrição"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Criado em</dt>
                  <dd>{department.created_at}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Atualizado em</dt>
                  <dd>{department.updated_at}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg border p-5">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                Máquinas Vinculadas
                <span className={cn(
                  "bg-secondary text-secondary-foreground",
                  "rounded-full px-2 py-0.5 text-xs font-medium"
                )}>
                  {department.department_machines.length}
                </span>
              </h3>

              {department.department_machines.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhuma máquina vinculada.
                </p>
              ) : (
                <div className="space-y-2">
                  {department.department_machines.map(({ machine }) => (
                    <div
                      key={machine.id}
                      className={cn(
                        "flex items-center justify-between",
                        "rounded-md border p-3"
                      )}
                    >
                      <Link
                        href={machines.show(machine.id).url}
                        className={cn(
                          "hover:text-primary flex min-w-0 flex-1",
                          "items-start gap-3 transition-colors"
                        )}
                      >
                        <div className={cn(
                          "bg-muted mt-0.5 flex size-7 shrink-0 items-center",
                          "justify-center rounded-md"
                        )}>
                          <ServerIcon
                            className="text-muted-foreground size-3.5"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {machine.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {machine.category.name} ·
                            {machine.manufacturer.name}
                            {
                              machine.serial_number
                              && ` · S/N: ${machine.serial_number}`
                            }
                          </p>
                        </div>
                      </Link>
                      <div className="flex shrink-0 items-center gap-2 pl-3">
                        <span className={cn(
                          "bg-secondary text-secondary-foreground rounded-full",
                          "px-2 py-0.5 text-xs font-medium"
                        )}
                        >
                          {machine.status.name}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={
                            "text-destructive hover:text-destructive size-7"
                          }
                          onClick={() => setUnlinkTarget(machine)}
                        >
                          <UnlinkIcon className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border p-5">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <ClockIcon className="size-4" />
                Histórico de Movimentações
              </h3>

              {department.histories.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhuma movimentação registrada.
                </p>
              ) : (
                <ol className="space-y-3">
                  {department.histories.map((h) => (
                    <li key={h.id} className="flex gap-3 text-sm">
                      <ActionTag action={h.action} />

                      <div className="flex-1">
                        <p>
                          <Link
                            href={machines.show(h.machine.id).url}
                            className={cn(
                              "hover:text-primary font-medium transition-colors"
                            )}
                          >
                            {h.machine.name}
                          </Link>
                          {h.previous_department && (
                            <span className="text-muted-foreground">
                              {" "}← {h.previous_department.name}
                            </span>
                          )}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {h.modified_at} · por {h.created_by.name}
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