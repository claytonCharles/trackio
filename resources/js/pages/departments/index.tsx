import Pagination from "@/components/custom/pagination";
import { Button } from "@/components/default/button";
import { Input } from "@/components/default/input";
import InputError from "@/components/default/input-error";
import { Label } from "@/components/default/label";
import AppLayout from "@/layouts/app-layout";
import departments from "@/routes/departments";
import { BreadcrumbItem, PaginationProps } from "@/types";
import { Form, Head, usePage } from "@inertiajs/react";
import {
  Building2,
  PlusIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { DepartmentCard } from "./partials/department-card";
import { ModalDepartmentSave } from "./partials/modal-department-save";
import { cn } from "@/lib/utils";
import { Department } from "./types/department";

type Props = {
  listDepartments: Department[];
  pagination: PaginationProps;
  filters: { search: string };
}

export default function DepartmentsIndex({
  listDepartments,
  pagination,
  filters
}: Props) {
  const [save, setSave] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Departamentos", href: departments.index().url },
  ];

  const handlerShow = (department: Department | null) => {
    setEditing(department)
    setSave(true)
  }

  const handlerClose = () => {
    setEditing(null)
    setSave(false)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Departamentos" />

      <div className="mt-5 flex w-full flex-col gap-6 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-foreground text-2xl font-bold tracking-tight">
              Departamentos
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {(pagination.totalItems ?? listDepartments.length) + " "} 
              departamento(s) cadastrado(s)
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              className="gap-2"
              onClick={() => handlerShow(null)}
            >
              <PlusIcon className="size-4" />
              Adicionar
            </Button>
          </div>
        </div>

        <Form
          {...departments.index.form()}
          className="w-full max-w-sm"
          options={{
            preserveState: true,
            preserveScroll: true,
            replace: true
          }}
        >
          {({ errors }) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Label htmlFor="search">Pesquisar</Label>
                <InputError message={errors.search} />
              </div>
              <Input
                id="search"
                name="search"
                type="text"
                defaultValue={filters.search}
                placeholder="Nome, serial ou tombamento..."
                onChange={(e) => {
                  const form = e.currentTarget.form;
                  if (timeout.current) clearTimeout(timeout.current);

                  timeout.current = setTimeout(() => {
                    form?.requestSubmit();
                  }, 300);
                }}
              />
            </div>
          )}
        </Form>

        {listDepartments.length === 0 ? (
          <div className={cn(
            "flex flex-col items-center justify-center rounded-xl border",
            "border-dashed py-20 text-center"
          )}>
            <Building2 className="text-muted-foreground/40 mb-4 size-12" />
            <p className="text-muted-foreground font-medium">
              Nenhum departamento encontrado
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Tente ajustar o filtro ou cadastre um novo departamento.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {listDepartments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                onEditing={(dp) => handlerShow(dp)}
              />
            ))}
          </div>
        )}

        <Pagination pagination={pagination} />

        <ModalDepartmentSave
          open={save}
          department={editing}
          onClose={handlerClose}
        />
      </div>
    </AppLayout>
  )
}