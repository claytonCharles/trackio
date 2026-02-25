import AppLayout from "@/layouts/app-layout";
import hardwares from "@/routes/hardwares";
import { BreadcrumbItem } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { useEffect } from "react";

type Hardware = {
  name: string,
  serial_number: string | null,
  inventory_number: string | null,
  description: string

}

type Props = {
  hardware: Hardware
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Hardwares",
    href: hardwares.index().url,
  },
];

export default function ShowHardware({ hardware }: Props) {
  const props = usePage().props

  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Hardwares" />

      <div>
        <p>Nome</p>
        <p>{hardware.name}</p>
        <p>Descrição</p>
      </div>
    </AppLayout>
  );
}
