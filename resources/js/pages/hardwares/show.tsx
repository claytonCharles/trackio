import AppLayout from "@/layouts/app-layout";
import hardwares from "@/routes/hardwares";
import { BreadcrumbItem } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { useEffect } from "react";

type Hardware = {
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
          <div className="flex w-full items-center gap-5">
            <div className="w-full p-2">
              <p className="text-lg">Nome</p>
              <p className="rounded border p-2">{hardware.name}</p>
            </div>
            <div className="w-full p-2">
              <p className="text-lg">Categoria</p>
              <p className="rounded border p-2">{hardware.category.name}</p>
            </div>
          </div>
          <div className="w-full p-2">
            <p className="text-lg">Descrição</p>
            <div
              className="rounded border px-5 py-2"
              dangerouslySetInnerHTML={{ __html: hardware.description }}
            />
          </div>
          <div className="mb-10 flex w-full items-center gap-5">
            <div className="w-full p-2">
              <p className="text-lg">Última Atualização</p>
              <p className="rounded border p-2">{hardware.updated_at_formatted}</p>
            </div>
            <div className="w-full p-2">
              <p className="text-lg">Atualizado Por</p>
              <p className="rounded border p-2">{hardware.user.name}</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
