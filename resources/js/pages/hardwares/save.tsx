import { Button } from "@/components/default/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/default/dialog";
import { Input } from "@/components/default/input";
import InputError from "@/components/default/input-error";
import { Label } from "@/components/default/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/default/select";
import { Spinner } from "@/components/default/spinner";
import { RichTextEditor } from "@/components/rich-text-editor";
import AppLayout from "@/layouts/app-layout";
import hardwares from "@/routes/hardwares";
import manufacturer from "@/routes/manufacturer";
import { BreadcrumbItem, SimpleIdentifier } from "@/types";
import { Form, Head, usePage, } from "@inertiajs/react";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { useEffect, useState } from "react";

type HardwareStatus = {
  id: number;
  name: string;
  only_system: boolean;
};

type Hardware = {
  id: number;
  name: string;
  serial_number: string | null;
  inventory_number: string | null;
  description: string;
  category: SimpleIdentifier,
  status: HardwareStatus,
  manufacturer: SimpleIdentifier;
}

type Props = {
  hardware?: Hardware;
  listCategories: SimpleIdentifier[];
  listStatus: HardwareStatus[];
  listManufacturers: SimpleIdentifier[];
};

export default function SaveHardware({
  hardware,
  listCategories,
  listStatus,
  listManufacturers
}: Props) {
  const editing = !!hardware;
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Hardwares",
      href: hardwares.index().url,
    },
    {
      title: editing ? "Editando" : "Cadastrando",
      href: "#",
    },
  ];

  const [showSetupManufacturer, setShowSetupManufacturer] = useState(false);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Hardwares Create" />
      <div className="mt-5 flex w-full flex-col items-center justify-center">
        <h2 className="text-foreground mb-6 text-center text-2xl font-bold">
          {editing ? "Atualização de Hardware" : "Cadastro de Hardware"}
        </h2>
        <Form
          action={editing
            ? hardwares.update(hardware.id).url
            : hardwares.store().url
          }
          method={editing ? 'PUT' : 'POST'}
          className="flex w-[75%] flex-col gap-6"
        >
          {({ processing, errors }) => (
            <>
              <div className="grid gap-6">
                <div className="flex w-full items-center justify-center gap-2">
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="name">Nome</Label>
                      <InputError message={errors.name} />
                    </div>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoFocus
                      tabIndex={1}
                      defaultValue={hardware?.name ?? ""}
                      placeholder="Nome do Hardware"
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="category_id">Categoria</Label>
                      <InputError message={errors.category_id} />
                    </div>
                    <Select
                      defaultValue={hardware?.category.id.toString()}
                      name="category_id"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent>
                        {listCategories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={`${category.id}`}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex w-full items-center justify-center gap-2">
                  <div className="flex w-full flex-col gap-2">
                    <Label htmlFor="serial_number">Tombamento</Label>
                    <Input
                      id="inventory_number"
                      type="text"
                      name="inventory_number"
                      tabIndex={1}
                      defaultValue={hardware?.inventory_number ?? ""}
                      placeholder="Tombamento do Hardware"
                    />
                    <InputError message={errors.inventory_number} />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="status_id">Status</Label>
                      <InputError message={errors.status_id} />
                    </div>
                    <Select
                      defaultValue={hardware?.status.id.toString()}
                      name="status_id"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent>
                        {listStatus.flatMap((status) => {
                          if (status.only_system) return null;
                          return (
                            <SelectItem
                              key={status.id}
                              value={`${status.id}`}
                            >
                              {status.name}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex w-full items-center justify-center gap-2">
                  <div className="flex w-full flex-col gap-2">
                    <Label htmlFor="serial_number">Número de Serie</Label>
                    <Input
                      id="serial_number"
                      type="text"
                      name="serial_number"
                      tabIndex={1}
                      defaultValue={hardware?.serial_number ?? ""}
                      placeholder="Nome do Hardware"
                    />
                    <InputError message={errors.serial_number} />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="manufacturer_id">Fabricantes</Label>
                      <InputError message={errors.manufacturer_id} />
                    </div>
                    <Select
                      defaultValue={hardware?.manufacturer.id.toString()}
                      name="manufacturer_id"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>
                            <span
                              onClick={() => setShowSetupManufacturer(true)}
                              className="border p-1 bg-green-400 cursor-pointer"
                            >
                              Adicionar
                            </span>
                          </SelectLabel>
                        </SelectGroup>
                        <SelectSeparator />
                        {listManufacturers.map((manufacturer) => (
                          <SelectItem
                            key={manufacturer.id}
                            value={`${manufacturer.id}`}
                          >
                            {manufacturer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <RichTextEditor
                    name="description"
                    label="Descrição"
                    defaultValue={hardware?.description ?? ""}
                    placeholder="Escreva algo..."
                  />
                  <InputError message={errors.description} />
                </div>

                <Button
                  type="submit"
                  className="mt-4 w-full"
                  tabIndex={4}
                  disabled={processing}
                >
                  {processing && <Spinner />}
                  Salvar
                </Button>
              </div>
            </>
          )}
        </Form>
      </div>

      <ModalSaveManufacturer
        isOpen={showSetupManufacturer}
        onClose={() => setShowSetupManufacturer(false)}
      />
    </AppLayout >
  );
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

function ModalSaveManufacturer({
  isOpen,
  onClose
}: ModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle>Cadastro de Fabricante</DialogTitle>
          <DialogDescription className="text-center">
            Cadastro simplificado de Fabricante.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-5">
          <Form
            {...manufacturer.store.form()}
            onSuccess={() => onClose()}
            className="flex w-full flex-col gap-6"
          >
            {({ processing, errors }) => (
              <div className="flex flex-col">
                <div className="flex w-full flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="name">Nome</Label>
                    <InputError message={errors.name} />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoFocus
                    tabIndex={1}
                    placeholder="Nome do Fabriante"
                  />
                </div>
                <Button
                  type="submit"
                  className="mt-4 w-[50%] self-center"
                  tabIndex={4}
                  disabled={processing}
                >
                  {processing && <Spinner />}
                  Salvar
                </Button>
              </div>
            )}
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}