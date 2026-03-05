import { Button } from "@/components/default/button";
import { Input } from "@/components/default/input";
import InputError from "@/components/default/input-error";
import { Label } from "@/components/default/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/default/select";
import { Spinner } from "@/components/default/spinner";
import { Checkbox } from "@/components/default/checkbox";
import AppLayout from "@/layouts/app-layout";
import machines from "@/routes/machines";
import { BreadcrumbItem, SimpleIdentifier } from "@/types";
import { Form, Head } from "@inertiajs/react";
import { useState } from "react";

type Hardware = {
  id: number;
  name: string;
  serial_number: string | null;
  inventory_number: string | null;
  category: SimpleIdentifier;
  manufacturer: SimpleIdentifier;
};

type Machine = {
  id: number;
  name: string;
  serial_number: string | null;
  inventory_number: string | null;
  manufacturer: SimpleIdentifier;
  status: SimpleIdentifier;
  machine_hardwares: { hardware_id: number }[];
};

type Props = {
  machine?: Machine;
  manufacturers: SimpleIdentifier[];
  statuses: SimpleIdentifier[];
  hardwares: Hardware[];
};

export default function SaveMachine({
  machine,
  manufacturers,
  statuses,
  hardwares,
}: Props) {
  const editing = !!machine;

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Máquinas", href: machines.index().url },
    { title: editing ? "Editando" : "Cadastrando", href: "#" },
  ];

  const currentHardwareIds = machine?.machine_hardwares.map((mh) => mh.hardware_id) ?? [];
  const [selectedIds, setSelectedIds] = useState<number[]>(currentHardwareIds);
  const [hwSearch, setHwSearch] = useState("");

  const filtered = hardwares.filter(
    (hw) =>
      hw.name.toLowerCase().includes(hwSearch.toLowerCase()) ||
      hw.serial_number?.toLowerCase().includes(hwSearch.toLowerCase()) ||
      hw.inventory_number?.toLowerCase().includes(hwSearch.toLowerCase())
  );

  function toggle(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={editing ? "Editar Máquina" : "Nova Máquina"} />

      <div className="mt-5 flex w-full flex-col items-center justify-center">
        <h2 className="text-foreground mb-6 text-center text-2xl font-bold">
          {editing ? "Atualização de Máquina" : "Cadastro de Máquina"}
        </h2>

        <Form
          action={editing ? machines.update(machine.id).url : machines.store().url}
          method={editing ? "PUT" : "POST"}
          className="flex w-[75%] flex-col gap-6"
        >
          {({ processing, errors }) => (
            <div className="grid gap-6">

              {/* Nome */}
              <div className="flex w-full items-start justify-center gap-2">
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
                    defaultValue={machine?.name ?? ""}
                    placeholder="Nome da Máquina"
                  />
                </div>

                {/* Status */}
                <div className="flex w-full flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="status_id">Status</Label>
                    <InputError message={errors.status_id} />
                  </div>
                  <Select
                    defaultValue={machine?.status.id.toString()}
                    name="status_id"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s.id} value={`${s.id}`}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Serial + Fabricante */}
              <div className="flex w-full items-start justify-center gap-2">
                <div className="flex w-full flex-col gap-2">
                  <Label htmlFor="serial_number">Número de Série</Label>
                  <Input
                    id="serial_number"
                    name="serial_number"
                    type="text"
                    tabIndex={2}
                    defaultValue={machine?.serial_number ?? ""}
                    placeholder="Número de série da máquina"
                  />
                  <InputError message={errors.serial_number} />
                </div>

                <div className="flex w-full flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="manufacturer_id">Fabricante</Label>
                    <InputError message={errors.manufacturer_id} />
                  </div>
                  <Select
                    defaultValue={machine?.manufacturer.id.toString()}
                    name="manufacturer_id"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      {manufacturers.map((m) => (
                        <SelectItem key={m.id} value={`${m.id}`}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tombamento */}
              <div className="flex w-full flex-col gap-2">
                <Label htmlFor="inventory_number">Tombamento</Label>
                <Input
                  id="inventory_number"
                  name="inventory_number"
                  type="text"
                  tabIndex={3}
                  defaultValue={machine?.inventory_number ?? ""}
                  placeholder="Número de tombamento da máquina"
                />
                <InputError message={errors.inventory_number} />
              </div>

              {/* Seleção de Hardwares */}
              <div className="flex flex-col gap-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Hardwares</Label>
                    <p className="text-muted-foreground text-xs">
                      {editing
                        ? "Hardwares já em outra máquina serão movidos automaticamente."
                        : "Selecione os hardwares disponíveis para vincular (opcional)."}
                    </p>
                  </div>
                  {selectedIds.length > 0 && (
                    <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                      {selectedIds.length} selecionado(s)
                    </span>
                  )}
                </div>

                <Input
                  placeholder="Filtrar hardwares por nome, serial ou tombamento..."
                  value={hwSearch}
                  onChange={(e) => setHwSearch(e.target.value)}
                />

                {/* hidden inputs para enviar os ids selecionados */}
                {selectedIds.map((id) => (
                  <input key={id} type="hidden" name="hardware_ids[]" value={id} />
                ))}

                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {filtered.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                      Nenhum hardware disponível.
                    </p>
                  )}
                  {filtered.map((hw) => (
                    <label
                      key={hw.id}
                      className="hover:bg-muted/40 flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors"
                    >
                      <Checkbox
                        checked={selectedIds.includes(hw.id)}
                        onCheckedChange={() => toggle(hw.id)}
                      />
                      <div className="flex-1 text-sm">
                        <p className="font-medium">{hw.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {hw.category.name} · {hw.manufacturer.name}
                          {hw.serial_number && ` · S/N: ${hw.serial_number}`}
                          {hw.inventory_number && ` · Tomb.: ${hw.inventory_number}`}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                {errors.hardware_ids && (
                  <InputError message={errors.hardware_ids} />
                )}
              </div>

              <Button
                type="submit"
                className="mt-4 w-full"
                tabIndex={5}
                disabled={processing}
              >
                {processing && <Spinner />}
                Salvar
              </Button>
            </div>
          )}
        </Form>
      </div>
    </AppLayout>
  );
}