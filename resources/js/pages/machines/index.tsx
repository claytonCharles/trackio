import { MetaItem } from "@/components/custom/meta-item";
import Pagination from "@/components/custom/pagination";
import { Button } from "@/components/default/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/default/dropdown-menu";
import { Input } from "@/components/default/input";
import InputError from "@/components/default/input-error";
import { Label } from "@/components/default/label";
import AppLayout from "@/layouts/app-layout";
import machineClone from "@/routes/machine-clone";
import machines from "@/routes/machines";
import { BreadcrumbItem, PaginationProps, SimpleIdentifier } from "@/types";
import { Form, Head, Link, router } from "@inertiajs/react";
import {
  CpuIcon,
  Ellipsis,
  Eye,
  HashIcon,
  Pen,
  PlusIcon,
  ServerIcon,
  Trash2Icon,
} from "lucide-react";
import { useRef } from "react";


type Machine = {
  id: number;
  name: string;
  serial_number: string | null;
  inventory_number: string | null;
  manufacturer: SimpleIdentifier;
  status: SimpleIdentifier;
  machine_hardwares_count?: number;
};

type Props = {
  listMachines: Machine[];
  pagination: PaginationProps;
  filters: { search: string };
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Máquinas", href: machines.index().url },
];
export default function MachinesIndex({
  listMachines,
  pagination,
  filters
}: Props) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Máquinas" />

      <div className="mt-5 flex w-full flex-col gap-6 px-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-foreground text-2xl font-bold tracking-tight">
              Máquinas
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {pagination.totalItems ?? listMachines.length} máquina(s) cadastrada(s)
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href={machineClone.index().url}>
              <Button className="gap-2">
                <PlusIcon className="size-4" />
                Espelhar em Lote
              </Button>
            </Link>
            <Link href={machines.create().url}>
              <Button className="gap-2">
                <PlusIcon className="size-4" />
                Adicionar
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <Form
          {...machines.index.form()}
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

        {/* Cards grid */}
        {listMachines.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
            <ServerIcon className="text-muted-foreground/40 mb-4 size-12" />
            <p className="text-muted-foreground font-medium">
              Nenhuma máquina encontrada
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Tente ajustar o filtro ou cadastre uma nova máquina.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {listMachines.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>
        )}

        {/* Paginação */}
        <Pagination pagination={pagination} />
      </div>
    </AppLayout>
  );
}

function MachineCard({ machine }: { machine: Machine }) {
  function handleDelete() {
    if (!confirm("Tem certeza que deseja remover esta máquina?")) return;
    router.delete(machines.destroy(machine.id).url);
  }

  return (
    <div className="group relative flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Topo — nome + dropdown */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
            <ServerIcon className="text-muted-foreground size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold leading-tight">
              {machine.name}
            </p>
            <p className="text-muted-foreground truncate text-xs">
              {machine.manufacturer.name}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 opacity-60 group-hover:opacity-100"
            >
              <Ellipsis className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                className="flex items-center gap-2"
                href={machines.show(machine.id).url}>
                <Eye className="size-4" /> Visualizar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                className="flex items-center gap-2"
                href={machines.edit(machine.id).url}>
                <Pen className="size-4" /> Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" asChild>
              <span
                className="flex items-center gap-2"
                onClick={handleDelete}
              >
                <Trash2Icon className="mr-2 size-4" />
                Desativar
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Metadados */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <MetaItem
          icon={<HashIcon className="size-3" />}
          label="Tombamento"
          value={machine.inventory_number}
        />
        <MetaItem
          icon={<HashIcon className="size-3" />}
          label="Serial"
          value={machine.serial_number}
        />
        {machine.machine_hardwares_count !== undefined && (
          <MetaItem
            icon={<CpuIcon className="size-3" />}
            label="Hardwares"
            value={String(machine.machine_hardwares_count)}
          />
        )}
      </div>

      {/* Rodapé — status */}
      <div className="flex items-center justify-between border-t pt-3">
        <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
          {machine.status.name}
        </span>
        <Link
          href={machines.show(machine.id).url}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
        >
          Ver detalhes →
        </Link>
      </div>
    </div>
  );
}