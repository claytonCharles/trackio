import { Button } from "@/components/default/button";
import { Input } from "@/components/default/input";
import InputError from "@/components/default/input-error";
import { Label } from "@/components/default/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/default/select";
import { Spinner } from "@/components/default/spinner";
import { Checkbox } from "@/components/default/checkbox";
import AppLayout from "@/layouts/app-layout";
import machines from "@/routes/machines";
import { BreadcrumbItem, SimpleIdentifier } from "@/types";
import { Form, router } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";
import {
  CpuIcon,
  Loader2Icon,
  PlusIcon,
  SearchIcon,
  ServerIcon
} from "lucide-react";
import {
  ModalSaveManufacturer
} from "@/components/custom/modal-save-manufacturer";
import { SaveHeader } from "@/components/custom/save-header";
import { ModalNotesChange } from "./partials/modal-notes-change";
import { ModalChoseMachineType } from "./partials/modal-chose-machine-type";
import { HardwareAvailable } from "./types/hardware-available";
import { cn } from "@/lib/utils";

type MachineHardwares = {
  hardware_id: number;
  hardware: HardwareAvailable
}

type Machine = {
  id: number;
  name: string;
  serial_number: string | null;
  inventory_number: string | null;
  category: SimpleIdentifier;
  manufacturer: SimpleIdentifier;
  status: SimpleIdentifier;
  machine_hardwares: MachineHardwares[];
};

type Props = {
  machine?: Machine;
  categories: SimpleIdentifier[];
  manufacturers: SimpleIdentifier[];
  statuses: SimpleIdentifier[];
  hardwares: HardwareAvailable[];
  hw_total: number;
};

export default function SaveMachine({
  machine,
  categories,
  manufacturers,
  hardwares: initialHardwares,
  hw_total,
}: Props) {
  const editing = !!machine;

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Máquinas", href: machines.index().url },
    { title: editing ? "Editando" : "Cadastrando", href: "#" },
  ];

  const currentHardwares = machine?.machine_hardwares.map((hw) => {
    return hw.hardware
  }) ?? [];

  const [selectedHardwares, setSelectedHardwares] = useState(currentHardwares);


  const [form, setForm] = useState<HTMLFormElement | null>(null);
  const [notes, setNotes] = useState("");
  const [template, setTemplate] = useState(false);

  const [showHardwareConfirm, setShowHardwareConfirm] = useState(false);
  const [showSetupManufacturer, setShowSetupManufacturer] = useState(false);
  const [showChoseMachineType, setShowChoseMachineType] = useState(false);


  const [hwSearch, setHwSearch] = useState("");
  const [hwList, setHwList] = useState<HardwareAvailable[]>(initialHardwares);
  const addedHardwares = selectedHardwares.filter(
    (hw) => !currentHardwares.some(h => h.id === hw.id)
  );

  const removedHardwares = currentHardwares.filter(
    (hw) => !selectedHardwares.some(h => h.id === hw.id)
  );

  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentRoute = editing
    ? machines.edit(machine.id).url
    : machines.create().url;

  const handleSaveMachine = (e: React.MouseEvent<HTMLButtonElement>) => {
    setForm(e.currentTarget.form)
    if (editing) {
      if (addedHardwares.length >= 1 || removedHardwares.length >= 1) {
        setShowHardwareConfirm(true)
        return
      }

      form?.requestSubmit()
      return
    }

    setShowChoseMachineType(true)
  }

  const selectedHwHas = (hardware: HardwareAvailable): boolean => {
    return selectedHardwares.some(h => h.id === hardware.id)
  }

  useEffect(() => {
    setHwList(initialHardwares);
    setSearching(false);
  }, [initialHardwares]);

  function search(term: string) {
    router.get(
      currentRoute,
      { hw_search: term },
      {
        only: ["hardwares"],
        preserveState: true,
        preserveScroll: true,
        replace: true,
      },
    );
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const term = e.target.value;
    setHwSearch(term);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(term), 350);
  }

  function toggle(hardware: HardwareAvailable) {
    setSelectedHardwares((prev) =>
      selectedHwHas(hardware)
        ? prev.filter((h) => h.id !== hardware.id)
        : [...prev, hardware]
    )
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <ModalSaveManufacturer
        isOpen={showSetupManufacturer}
        onClose={() => setShowSetupManufacturer(false)}
      />

      <ModalChoseMachineType
        open={showChoseMachineType}
        onChange={(template) => setTemplate(template)}
        onClose={() => setShowChoseMachineType(false)}
        onConfirm={() => {
          setShowChoseMachineType(false)
          form?.requestSubmit()
        }}
      />


      <div className="mt-5 flex w-full flex-col gap-6 px-4 sm:px-6">
        <SaveHeader
          identifier={{ icon: ServerIcon }}
          title={editing ? "Atualização de Máquina" : "Cadastro de Máquina"}
          subTitle={editing
            ? `Editando: ${machine.name}`
            : "Preencha os dados da nova máquina."
          }
        />

        <Form
          action={editing
            ? machines.update(machine.id).url
            : machines.store().url
          }
          method={editing ? "PUT" : "POST"}
          className="flex flex-col gap-6"
        >
          {({ processing, errors }) => (
            <>
              <ModalNotesChange
                open={showHardwareConfirm}
                addedHardwares={addedHardwares}
                removedHardwares={removedHardwares}
                onChangeNotes={(note) => setNotes(note)}
                onClose={() => {
                  setShowHardwareConfirm(false);
                  setForm(null);
                }}
                onConfirm={() => form?.requestSubmit()}
                processing={processing}
              />

              <div className="rounded-xl border p-5 sm:p-6">
                <h3
                  className={cn(
                    "mb-4 text-sm font-semibold uppercase tracking-wide",
                    "text-muted-foreground"
                  )}
                >
                  Identificação
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="name">Modelo</Label>
                      <InputError message={errors.name} />
                    </div>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      autoFocus
                      tabIndex={1}
                      defaultValue={machine?.name ?? ""}
                      placeholder="Nome da máquina"
                    />
                  </div>

                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label htmlFor="inventory_number">Tombamento</Label>
                    <Input
                      id="inventory_number"
                      name="inventory_number"
                      type="text"
                      tabIndex={2}
                      defaultValue={machine?.inventory_number ?? ""}
                      placeholder="Número de tombamento"
                    />
                    <InputError message={errors.inventory_number} />
                  </div>

                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label htmlFor="serial_number">Número de Série</Label>
                    <Input
                      id="serial_number"
                      name="serial_number"
                      type="text"
                      tabIndex={3}
                      defaultValue={machine?.serial_number ?? ""}
                      placeholder="Número de série"
                    />
                    <InputError message={errors.serial_number} />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-5 sm:p-6">
                <h3 className={cn(
                  "mb-4 text-sm font-semibold uppercase tracking-wide",
                  "text-muted-foreground"
                )}>
                  Classificação
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="category_id">Categoria</Label>
                      <InputError message={errors.category_id} />
                    </div>
                    <Select
                      defaultValue={machine?.category.id.toString()}
                      name="category_id"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
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

                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="manufacturer_id">Fabricante</Label>
                      <InputError message={errors.manufacturer_id} />
                    </div>
                    <Select
                      defaultValue={machine?.manufacturer.id.toString()}
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
                              className={cn(
                                "text-primary flex cursor-pointer items-center",
                                "gap-1.5 text-sm font-medium"
                              )}
                            >
                              <PlusIcon className="size-3" />
                              Adicionar fabricante
                            </span>
                          </SelectLabel>
                        </SelectGroup>
                        <SelectSeparator />
                        {manufacturers.map((m) => (
                          <SelectItem key={m.id} value={`${m.id}`}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-5 sm:p-6">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div>
                    <h3 className={cn(
                      "text-sm font-semibold uppercase tracking-wide",
                      "text-muted-foreground",
                    )}>
                      Hardwares
                    </h3>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {
                        editing
                          ? `Hardwares em outra máquina serão movidos 
                          automaticamente.`
                          : "Selecione os hardwares para vincular (opcional)."
                      }
                    </p>
                  </div>
                  {selectedHardwares.length > 0 && (
                    <span className={cn(
                      "bg-primary text-primary-foreground shrink-0",
                      "rounded-full px-2.5 py-0.5 text-xs font-medium"
                    )}>
                      {selectedHardwares.length} selecionado(s)
                    </span>
                  )}
                </div>

                {selectedHardwares.map((hw) => (
                  <input
                    key={hw.id}
                    type="hidden"
                    name="hardware_ids[]"
                    value={hw.id}
                  />
                ))}

                <div className="relative mb-3">
                  <SearchIcon className={cn(
                    "text-muted-foreground absolute left-3 top-1/2 size-4",
                    "-translate-y-1/2"
                  )} />
                  <Input
                    className="pl-9"
                    placeholder="Buscar por nome, serial ou tombamento..."
                    value={hwSearch}
                    onChange={handleSearchChange}
                  />
                  {searching && (
                    <Loader2Icon className={cn(
                      "text-muted-foreground absolute right-3 top-1/2 size-4",
                      "-translate-y-1/2 animate-spin"
                    )} />
                  )}
                </div>

                <div className="space-y-2">
                  {searching && hwList.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2Icon
                        className="text-muted-foreground size-5 animate-spin"
                      />
                    </div>
                  ) : hwList.length === 0 ? (
                    <div className={cn(
                      "flex flex-col items-center justify-center rounded-lg",
                      "border border-dashed py-8 text-center"
                    )}>
                      <CpuIcon
                        className="text-muted-foreground/40 mb-2 size-8"
                      />
                      <p className="text-muted-foreground text-sm">
                        Nenhum hardware disponível.
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-muted-foreground mb-2 text-xs">
                        {hw_total} hardware(s) encontrado(s)
                      </p>
                      {hwList.map((hw) => (
                        <label
                          key={hw.id}
                          className={cn(
                            "hover:bg-muted/40 flex cursor-pointer items-start",
                            "gap-3 rounded-lg border p-3 transition-colors",
                            selectedHwHas(hw) &&
                            "border-primary/30 bg-primary/5"
                          )}
                        >
                          <Checkbox
                            checked={selectedHwHas(hw)}
                            onCheckedChange={() => toggle(hw)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 text-sm">
                            <p className="font-medium">{hw.name}</p>
                            <p className="text-muted-foreground text-xs">
                              {hw.category.name} · {hw.manufacturer.name}
                              {
                                hw.serial_number &&
                                ` · Número de Série: ${hw.serial_number}`
                              }
                              {
                                hw.inventory_number &&
                                ` · Tombamento: ${hw.inventory_number}`
                              }
                            </p>
                          </div>
                        </label>
                      )
                      )}
                    </>
                  )}
                </div>

                {errors.hardware_ids && (
                  <InputError message={errors.hardware_ids} />
                )}
              </div>

              <textarea name="notes" className="hidden" value={notes} />
              <input
                name="template"
                type="hidden"
                value={template ? '1' : '0'}
              />

              <div className="flex justify-end gap-3 pb-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Cancelar
                </Button>

                <Button
                  type="button"
                  onClick={(e) => handleSaveMachine(e)}
                  tabIndex={5} disabled={processing}
                >
                  {processing && <Spinner />}
                  Salvar
                </Button>
              </div>
            </>
          )}
        </Form>
      </div>
    </AppLayout>
  );
}