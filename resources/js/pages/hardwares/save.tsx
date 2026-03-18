import { Button } from "@/components/default/button";
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
import { RichTextEditor } from "@/components/custom/rich-text-editor";
import AppLayout from "@/layouts/app-layout";
import hardwares from "@/routes/hardwares";
import { BreadcrumbItem, SimpleIdentifier } from "@/types";
import { Form, Head } from "@inertiajs/react";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { useState } from "react";
import { CpuIcon, PlusIcon } from "lucide-react";
import { ModalSaveManufacturer } from "@/components/custom/modal-save-manufacturer";
import { UnsavedChangesDialog } from "@/components/custom/unsaved-changes-dialog";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

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
  listManufacturers: SimpleIdentifier[];
};

export default function SaveHardware({
  hardware,
  listCategories,
  listManufacturers
}: Props) {
  const editing = !!hardware;
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Hardwares", href: hardwares.index().url },
    { title: editing ? "Editando" : "Cadastrando", href: "#" },
  ];

  const [showSetupManufacturer, setShowSetupManufacturer] = useState(false);
  const { showDialog, confirm, cancel } = useUnsavedChanges(true);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={editing ? "Editar Hardware" : "Novo Hardware"} />

      <div className="mt-5 flex w-full flex-col gap-6 px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
            <CpuIcon className="text-muted-foreground size-5" />
          </div>
          <div>
            <h2 className="text-foreground text-2xl font-bold tracking-tight">
              {editing ? "Atualização de Hardware" : "Cadastro de Hardware"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {editing
                ? `Editando: ${hardware.name}`
                : "Preencha os dados do novo hardware."}
            </p>
          </div>
        </div>
        <Form
          action={editing ? hardwares.update(hardware.id).url : hardwares.store().url}
          method={editing ? "PUT" : "POST"}
          className="flex flex-col gap-6"
        >
          {({ processing, errors }) => (
            <>
              {/* Card — Identificação */}
              <div className="rounded-xl border p-5 sm:p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Identificação
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Nome */}
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="name">Modelo *</Label>
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
                      placeholder="Modelo do hardware"
                    />
                  </div>

                  {/* Tombamento */}
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label htmlFor="inventory_number">Tombamento</Label>
                    <Input
                      id="inventory_number"
                      name="inventory_number"
                      type="text"
                      tabIndex={2}
                      defaultValue={hardware?.inventory_number ?? ""}
                      placeholder="Número de tombamento"
                    />
                    <InputError message={errors.inventory_number} />
                  </div>

                  {/* Número de série */}
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label htmlFor="serial_number">Número de Série</Label>
                    <Input
                      id="serial_number"
                      name="serial_number"
                      type="text"
                      tabIndex={3}
                      defaultValue={hardware?.serial_number ?? ""}
                      placeholder="Número de série"
                    />
                    <InputError message={errors.serial_number} />
                  </div>
                </div>
              </div>

              {/* Card — Classificação */}
              <div className="rounded-xl border p-5 sm:p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Classificação
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Categoria */}
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="category_id">Categoria *</Label>
                      <InputError message={errors.category_id} />
                    </div>
                    <Select
                      defaultValue={hardware?.category.id.toString()}
                      name="category_id"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {listCategories.map((category) => (
                          <SelectItem key={category.id} value={`${category.id}`}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fabricante */}
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="manufacturer_id">Fabricante *</Label>
                      <InputError message={errors.manufacturer_id} />
                    </div>
                    <Select
                      defaultValue={hardware?.manufacturer.id.toString()}
                      name="manufacturer_id"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um fabricante" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>
                            <span
                              onClick={() => setShowSetupManufacturer(true)}
                              className="text-primary flex cursor-pointer items-center gap-1.5 text-sm font-medium"
                            >
                              <PlusIcon className="size-3" />
                              Adicionar fabricante
                            </span>
                          </SelectLabel>
                        </SelectGroup>
                        <SelectSeparator />
                        {listManufacturers.map((m) => (
                          <SelectItem key={m.id} value={`${m.id}`}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Card — Descrição */}
              <div className="rounded-xl border p-5 sm:p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Detalhes
                </h3>
                <RichTextEditor
                  name="description"
                  defaultValue={hardware?.description ?? ""}
                  placeholder="Descreva o hardware, especificações, observações..."
                />
                <InputError message={errors.description} />
              </div>

              {/* Ações */}
              <div className="flex justify-end gap-3 pb-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Cancelar
                </Button>
                <Button type="submit" tabIndex={5} disabled={processing}>
                  {processing && <Spinner />}
                  Salvar
                </Button>
              </div>
            </>
          )}
        </Form>
      </div>

      <UnsavedChangesDialog
        open={showDialog}
        onConfirm={confirm}
        onCancel={cancel}
      />

      <ModalSaveManufacturer
        isOpen={showSetupManufacturer}
        onClose={() => setShowSetupManufacturer(false)}
      />
    </AppLayout >
  );
}