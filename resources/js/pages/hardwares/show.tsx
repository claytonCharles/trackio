import { Button } from "@/components/default/button";
import AppLayout from "@/layouts/app-layout";
import hardwares from "@/routes/hardwares";
import { BreadcrumbItem } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { Pen, Trash } from "lucide-react";
import { useEffect } from "react";

type Hardware = {
  id: number;
  name: string;
  serial_number: string | null;
  inventory_number: string | null;
  description: string;
  updated_at_formatted: string;
  category: {
    name: string;
  };
  user: {
    name: string;
  };
};

type Props = {
  hardware: Hardware;
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Hardwares",
    href: hardwares.index().url,
  },
  {
    title: "Visualização",
    href: "",
  },
];

export default function ShowHardware({ hardware }: Props) {
  const props = usePage().props;

  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Hardwares" />

      <div className="flex flex-col items-center justify-center">
        <div className="container px-5">
          <div className="mt-10 w-full flex justify-end items-center gap-4">
            <Button>
              <Link
                className="flex gap-2 items-center"
                href={hardwares.edit(hardware.id)}
              >
                <Pen className="h-4 w-4" />
                Editar
              </Link>
            </Button>
            <Button variant="destructive">
              <Link
                className="flex gap-2 items-center"
                href={hardwares.destroy(hardware.id)}
              >
                <Trash className="h-4 w-4" />
                Deletar
              </Link>
            </Button>
          </div>
          <div className="mt-5">
            <table className="table-auto border">
              <tbody>
                <tr className="border">
                  <td className="p-4 border">Nome:</td>
                  <td className="px-4">{hardware.name}</td>
                </tr>
                <tr className="border">
                  <td className="p-4 border">Categoria:</td>
                  <td className="px-4">{hardware.category.name}</td>
                </tr>
                <tr className="border">
                  <td className="p-4 border">Tombamento:</td>
                  <td className="px-4">{hardware.inventory_number ?? 'Sem Tombamento!'}</td>
                </tr>
                <tr className="border">
                  <td className="p-4 border">Número de Serie:</td>
                  <td className="px-4">{hardware.serial_number ?? 'Sem Número de serie!'}</td>
                </tr>
                <tr className="border">
                  <td className="p-4 border">Última Atualização:</td>
                  <td className="px-4">{hardware.updated_at_formatted} feita por {hardware.user.name}</td>
                </tr>
              </tbody>
            </table>
            <div>
              <p className="pt-4 pb-2 px-2">Descrição</p>
              <div
                className="border px-5 py-2 mb-10 "
                dangerouslySetInnerHTML={{ __html: hardware.description }}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
