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
import machines from "@/routes/machines";
import { BreadcrumbItem, PaginationProps } from "@/types";
import { Form, Head, Link } from "@inertiajs/react";
import { Ellipsis, Eye, Pen, Settings, Trash } from "lucide-react";

type Option = { id: number; name: string };

type Machine = {
  id: number;
  name: string;
  serial_number: string | null;
  inventory_number: string | null;
  manufacturer: Option;
  status: Option;
};

type Props = {
  listMachines: Machine[];
  pagination: PaginationProps;
  filters: { search: string };
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Máquinas", href: "#" },
];

export default function MachinesIndex({ listMachines, pagination, filters }: Props) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Máquinas" />

      <div className="mt-5 flex w-full flex-col items-center justify-center">
        <div className="container px-5">
          <div className="my-2 flex w-full items-center justify-between">
            <Form {...machines.index.form()} className="w-[25%]">
              {({ errors }) => (
                <div className="flex w-full flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="search">Pesquisar</Label>
                    <InputError message={errors.search} />
                  </div>
                  <Input
                    id="search"
                    name="search"
                    type="text"
                    defaultValue={filters.search}
                    placeholder="Digite aqui..."
                  />
                </div>
              )}
            </Form>
            <Link href={machines.create().url}>
              <Button>Adicionar</Button>
            </Link>
          </div>
        </div>

        <div className="container mt-3 px-5">
          <table className="min-w-full border-collapse text-center text-sm">
            <thead className="text-xs uppercase">
              <tr className="border">
                <th className="border px-3 py-4">Nome</th>
                <th className="border px-3 py-4">Tombamento</th>
                <th className="border px-3 py-4">Número de Série</th>
                <th className="border px-3 py-4">Fabricante</th>
                <th className="border px-3 py-4">Status</th>
                <th className="flex items-center justify-center py-3">
                  <Settings />
                </th>
              </tr>
            </thead>
            <tbody>
              {listMachines.length > 0 ? (
                listMachines.map((machine) => (
                  <tr key={machine.id} className="border hover:bg-muted">
                    <td className="border px-3 py-4 text-start">{machine.name}</td>
                    <td className="border px-3 py-4 text-start">
                      {machine.inventory_number ?? "—"}
                    </td>
                    <td className="border px-3 py-4 text-start">
                      {machine.serial_number ?? "—"}
                    </td>
                    <td className="border px-3 py-4">{machine.manufacturer.name}</td>
                    <td className="border px-3 py-4">{machine.status.name}</td>
                    <td className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Ellipsis className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Link
                              className="flex items-center gap-2"
                              href={machines.show(machine.id).url}
                            >
                              <Eye className="h-4 w-4" />
                              Visualizar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link
                              className="flex items-center gap-2"
                              href={machines.edit(machine.id).url}
                            >
                              <Pen className="h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive">
                            <Link
                              className="flex items-center gap-2"
                              href={machines.destroy(machine.id).url}
                            >
                              <Trash className="h-4 w-4" />
                              Deletar
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>Nenhuma Máquina encontrada!</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="h-10">
            <Pagination pagination={pagination} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}