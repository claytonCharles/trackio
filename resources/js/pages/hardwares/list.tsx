import Pagination from "@/components/custom/pagination";
import { Button } from "@/components/default/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/default/dropdown-menu";
import { Input } from "@/components/default/input";
import InputError from "@/components/default/input-error";
import { Label } from "@/components/default/label";
import AppLayout from "@/layouts/app-layout";
import hardwares from "@/routes/hardwares";
import { BreadcrumbItem, PaginationProps } from "@/types";
import { Form, Head, Link } from "@inertiajs/react";
import { Ellipsis, Eye, Pen, Settings, Trash } from "lucide-react";
import { useRef } from "react";

type Hardware = {
  id: number,
  serial_number: string | null,
  inventory_number: string | null,
  name: string,
  category: {
    name: string
  }
}

type Props = {
  listHardwares: Hardware[],
  pagination: PaginationProps,
  filters: {
    search: string;
  }
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Hardwares",
    href: hardwares.index().url,
  },
];

export default function ListHardwares({
  listHardwares,
  pagination,
  filters
}: Props) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Hardwares" />

      <div className="w-full flex flex-col justify-center items-center mt-5">
        <div className="container px-5">
          <div className="flex w-full justify-between items-center my-2">
            <Form
              className="w-[25%]"
              {...hardwares.index.form()}
              options={{
                preserveState: true,
                preserveScroll: true,
                replace: true
              }}
            >
              {({ processing, errors }) => (
                <>
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="search">Pesquisar</Label>
                      <InputError message={errors.name} />
                    </div>
                    <Input
                      id="search"
                      name="search"
                      type="text"
                      autoFocus={true}
                      defaultValue={filters.search}
                      placeholder="Digite aqui..."
                      onChange={(e) => {
                        const form = e.currentTarget.form;
                        if (timeout.current) clearTimeout(timeout.current);

                        timeout.current = setTimeout(() => {
                          form?.requestSubmit();
                        }, 300);
                      }}
                    />
                  </div>
                </>
              )}
            </Form>
            <Link className="cursor-pointer" href={hardwares.create()}>
              <Button>
                Adicionar
              </Button>
            </Link>
          </div>
        </div>
        <div className="container px-5 mt-3">
          <table className="min-w-full text-sm text-center border-collapse">
            <thead className="text-xs uppercase">
              <tr className="border">
                <th className="px-3 py-4 border">Nome</th>
                <th className="px-3 py-4 border">Tombamento</th>
                <th className="px-3 py-4 border">Número de Serie</th>
                <th className="px-3 py-4 border">Categoria</th>
                <th className="py-3 flex justify-center items-center">
                  <Settings />
                </th>
              </tr>
            </thead>
            <tbody>
              {
                listHardwares.length > 0 ? (
                  listHardwares.map((hardware) => (
                    <tr key={hardware.id} className="border hover:bg-muted">
                      <td className="px-3 border py-4 text-start">
                        {hardware.name}
                      </td>
                      <td className="px-3 border py-4 text-start">
                        {hardware.inventory_number}
                      </td>
                      <td className="px-3 border py-4 text-start">
                        {hardware.serial_number}
                      </td>
                      <td className="px-3 border py-4">
                        {hardware.category.name}
                      </td>
                      <td className="py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Ellipsis className="cursor-pointer" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Link
                                className="flex gap-2 items-center"
                                href={hardwares.show(hardware.id)}
                              >
                                <Eye className="h-4 w-4" />
                                Visualizar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link
                                className="flex gap-2 items-center"
                                href={hardwares.edit(hardware.id)}
                              >
                                <Pen className="h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive">
                              <Link
                                className="flex gap-2 items-center"
                                href={hardwares.destroy(hardware.id)}
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
                    <td colSpan={4}>Nenhum Hardware encontrado!</td>
                  </tr>
                )
              }
            </tbody>
          </table>
          <div className="h-10">
            <Pagination pagination={pagination}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
