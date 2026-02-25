import { Button } from "@/components/default/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/default/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import hardwares from "@/routes/hardwares";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Ellipsis, Eye, Pen } from "lucide-react";

type HardwareProps = {
  id: number,
  serial_number: string | null,
  inventory_number: string | null,
  name: string,
  category: {
    name: string
  }
}

type Props = {
  listHardwares: HardwareProps[]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Hardwares",
    href: hardwares.index().url,
  },
];

export default function ListHardwares({ listHardwares }: Props) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Hardwares" />

      <div className="w-full flex flex-col justify-center items-center mt-5">
        <div className="container px-5">
          <div className="flex w-full justify-end my-2">
            <Link className="cursor-pointer" href={hardwares.create()}>
              <Button>
                Adicionar
              </Button>
            </Link>
          </div>
        </div>
        <div className="container px-5 bg-muted/50">
          <table className="min-w-full text-sm text-center">
            <thead className="text-xs uppercase">
              <tr>
                <th className="px-3 py-3">Nome</th>
                <th className="px-3 py-3">Tombamento</th>
                <th className="px-3 py-3">Número de Serie</th>
                <th className="px-3 py-3">Categoria</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody>
              {
                listHardwares.length > 0 ? (
                  listHardwares.map((hardware) => (
                    <tr key={hardware.id} className="hover:bg-muted">
                      <td className="px-3 py-4 text-start">{hardware.name}</td>
                      <td className="px-3 py-4">{hardware.inventory_number}</td>
                      <td className="px-3 py-4">{hardware.serial_number}</td>
                      <td className="px-3 py-4">{hardware.category.name}</td>
                      <td className="py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Ellipsis />
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Pen className="h-4 w-4" />
                              Editar
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

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
