import { Button } from "@/components/default/button";
import AppLayout from "@/layouts/app-layout";
import hardwares from "@/routes/hardwares";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Hardwares",
    href: hardwares.index().url,
  },
];

export default function ListHardwares() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Hardwares" />
      <div className="mt-5 flex w-full justify-center">
        <div className="flex w-full flex-col">
          <div className="flex w-full self-end">
            <Link className="bg-green-400 p-2" href={hardwares.create()}>
              Adicionar
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <th>Name</th>
              <th>user</th>
            </thead>
            <tbody>
              <td>Nada</td>
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
