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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/default/dialog";
import { Spinner } from "@/components/default/spinner";
import { Checkbox } from "@/components/default/checkbox";
import AppLayout from "@/layouts/app-layout";
import machines from "@/routes/machines";
import { BreadcrumbItem, SimpleIdentifier } from "@/types";
import { Form, Head, router } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";
import { CpuIcon, Loader2Icon, PlusIcon, SearchIcon, ServerIcon, TriangleAlertIcon } from "lucide-react";
import { ModalSaveManufacturer } from "@/components/custom/modal-save-manufacturer";

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
  category: SimpleIdentifier;
  manufacturer: SimpleIdentifier;
  status: SimpleIdentifier;
  machine_hardwares: { hardware_id: number }[];
};

type Props = {
  machine?: Machine;
  categories: SimpleIdentifier[];
  manufacturers: SimpleIdentifier[];
  statuses: SimpleIdentifier[];
  hardwares: Hardware[];
  hw_has_more: boolean;
  hw_total: number;
};

export default function SaveMachine({
  machine,
  categories,
  manufacturers,
  statuses,
  hardwares: initialHardwares,
  hw_has_more: initialHasMore,
  hw_total,
}: Props) {
  const editing = !!machine;

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Máquinas", href: machines.index().url },
    { title: editing ? "Editando" : "Cadastrando", href: "#" },
  ];

  const [form, setForm] = useState<HTMLFormElement | null>(null);
  const [showSetupManufacturer, setShowSetupManufacturer] = useState(false);
  const [showHardwareConfirm, setShowHardwareConfirm] = useState(false);
  const currentHardwareIds = machine?.machine_hardwares.map((mh) => mh.hardware_id) ?? [];
  const [selectedIds, setSelectedIds] = useState<number[]>(currentHardwareIds);
  const [notes, setNotes] = useState("");
  const [hwSearch, setHwSearch] = useState("");
  const [hwList, setHwList] = useState<Hardware[]>(initialHardwares);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [hwPage, setHwPage] = useState(1);
  const [searching, setSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentRoute = editing
    ? machines.edit(machine.id).url
    : machines.create().url;

  const addedHardwares = hwList.filter(
    (hw) => selectedIds.includes(hw.id) && !currentHardwareIds.includes(hw.id)
  );
  const removedHardwares = hwList.filter(
    (hw) => !selectedIds.includes(hw.id) && currentHardwareIds.includes(hw.id)
  );

  const hasHardwareChanges = editing &&
    (addedHardwares.length >= 1 || removedHardwares.length >= 1);


  // quando o Inertia atualiza os props (partial reload), sincroniza o state
  useEffect(() => {
    if (hwPage === 1) {
      // nova busca — substitui a lista
      setHwList(initialHardwares);
    } else {
      // load more — acumula, evitando duplicatas
      setHwList((prev) => {
        const existingIds = new Set(prev.map((h) => h.id));
        return [...prev, ...initialHardwares.filter((h) => !existingIds.has(h.id))];
      });
    }
    setHasMore(initialHasMore);
    setSearching(false);
    setLoadingMore(false);
  }, [initialHardwares, initialHasMore]);

  function search(term: string, page = 1) {
    if (page === 1) setSearching(true);
    else setLoadingMore(true);

    router.get(
      currentRoute,
      { hw_search: term, hw_page: page },
      {
        only: ["hardwares", "hw_has_more", "hw_total"],
        preserveState: true,
        preserveScroll: true,
        replace: true,
      },
    );
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const term = e.target.value;
    setHwSearch(term);
    setHwPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(term, 1), 350);
  }

  function handleLoadMore() {
    const nextPage = hwPage + 1;
    setHwPage(nextPage);
    search(hwSearch, nextPage);
  }

  function toggle(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  }

  function handleModalHardwareChange(e: React.MouseEvent<HTMLButtonElement>) {
    setShowHardwareConfirm(true);
    setForm(e.currentTarget.form);
  }

  function handleCancelHardwareChange() {
    setShowHardwareConfirm(false);
    setNotes("");
    setForm(null);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={editing ? "Editar Máquina" : "Nova Máquina"} />

      <div className="mt-5 flex w-full flex-col gap-6 px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
            <ServerIcon className="text-muted-foreground size-5" />
          </div>
          <div>
            <h2 className="text-foreground text-2xl font-bold tracking-tight">
              {editing ? "Atualização de Máquina" : "Cadastro de Máquina"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {editing
                ? `Editando: ${machine.name}`
                : "Preencha os dados da nova máquina."}
            </p>
          </div>
        </div>

        <Form
          action={editing ? machines.update(machine.id).url : machines.store().url}
          method={editing ? "PUT" : "POST"}
          className="flex flex-col gap-6"
        >
          {({ processing, errors }) => (
            <>
              {/* Modal de confirmação de mudança de hardwares */}
              <Dialog open={showHardwareConfirm} onOpenChange={(open) => !open && handleCancelHardwareChange()}>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader className="flex flex-col items-center gap-2 text-center">
                    <div className="bg-warning/10 flex size-12 items-center justify-center rounded-full">
                      <TriangleAlertIcon className="text-warning size-6" />
                    </div>
                    <DialogTitle>Confirmar mudanças nos hardwares</DialogTitle>
                    <DialogDescription>
                      Você está alterando os hardwares vinculados a esta máquina. Descreva o motivo (opcional).
                    </DialogDescription>
                  </DialogHeader>

                  {/* Resumo das mudanças */}
                  <div className="flex flex-col gap-3 text-sm">
                    {addedHardwares.length > 0 && (
                      <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/30">
                        <p className="mb-1.5 font-medium text-green-700 dark:text-green-400">
                          {addedHardwares.length} hardware(s) a vincular
                        </p>
                        <ul className="text-muted-foreground space-y-0.5 text-xs">
                          {addedHardwares.map((hw) => (
                            <li key={hw.id}>+ {hw.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {removedHardwares.length > 0 && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
                        <p className="mb-1.5 font-medium text-red-700 dark:text-red-400">
                          {removedHardwares.length} hardware(s) a desvincular
                        </p>
                        <ul className="text-muted-foreground space-y-0.5 text-xs">
                          {removedHardwares.map((hw) => (
                            <li key={hw.id}>− {hw.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Campo de notes */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="notes">Observação</Label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex: Hardware realocado após manutenção preventiva..."
                      className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-2"
                    />
                  </div>

                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button variant="outline" onClick={handleCancelHardwareChange}>
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      onClick={() => form?.requestSubmit()}
                      tabIndex={5}
                      disabled={processing}
                    >
                      {processing && <Spinner />}
                      Confirmar e salvar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <textarea name="notes" className="hidden" value={notes} />

              {/* Card — Identificação */}
              <div className="rounded-xl border p-5 sm:p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Identificação
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Nome */}
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="name">Modelo</Label>
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
                      placeholder="Nome da máquina"
                    />
                  </div>

                  {/* Tombamento */}
                  <div className="flex flex-col gap-2">
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

                  {/* Serial */}
                  <div className="flex flex-col gap-2">
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

              {/* Card — Classificação */}
              <div className="rounded-xl border p-5 sm:p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Classificação
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Categoria */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="category_id">Categoria</Label>
                      <InputError message={errors.category_id} />
                    </div>
                    <Select defaultValue={machine?.category.id.toString()} name="category_id">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={`${category.id}`}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Status */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="status_id">Status</Label>
                      <InputError message={errors.status_id} />
                    </div>
                    <Select defaultValue={machine?.status.id.toString()} name="status_id">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => (
                          <SelectItem key={s.id} value={`${s.id}`}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fabricante */}
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="manufacturer_id">Fabricante</Label>
                      <InputError message={errors.manufacturer_id} />
                    </div>
                    <Select defaultValue={machine?.manufacturer.id.toString()} name="manufacturer_id">
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
                        {manufacturers.map((m) => (
                          <SelectItem key={m.id} value={`${m.id}`}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Card — Hardwares */}
              <div className="rounded-xl border p-5 sm:p-6">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Hardwares
                    </h3>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {editing
                        ? "Hardwares em outra máquina serão movidos automaticamente."
                        : "Selecione os hardwares para vincular (opcional)."}
                    </p>
                  </div>
                  {selectedIds.length > 0 && (
                    <span className="bg-primary text-primary-foreground shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium">
                      {selectedIds.length} selecionado(s)
                    </span>
                  )}
                </div>

                {/* hidden inputs */}
                {selectedIds.map((id) => (
                  <input key={id} type="hidden" name="hardware_ids[]" value={id} />
                ))}

                {/* Campo de busca */}
                <div className="relative mb-3">
                  <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    className="pl-9"
                    placeholder="Buscar por nome, serial ou tombamento..."
                    value={hwSearch}
                    onChange={handleSearchChange}
                  />
                  {searching && (
                    <Loader2Icon className="text-muted-foreground absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin" />
                  )}
                </div>

                {/* Lista */}
                <div className="space-y-2">
                  {searching && hwList.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2Icon className="text-muted-foreground size-5 animate-spin" />
                    </div>
                  ) : hwList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
                      <CpuIcon className="text-muted-foreground/40 mb-2 size-8" />
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
                          className={`hover:bg-muted/40 flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${selectedIds.includes(hw.id)
                            ? "border-primary/30 bg-primary/5"
                            : ""
                            }`}
                        >
                          <Checkbox
                            checked={selectedIds.includes(hw.id)}
                            onCheckedChange={() => toggle(hw.id)}
                            className="mt-0.5"
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

                      {/* Load more */}
                      {hasMore && (
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2 w-full"
                          disabled={loadingMore}
                          onClick={handleLoadMore}
                        >
                          {loadingMore
                            ? <><Loader2Icon className="mr-2 size-4 animate-spin" />Carregando...</>
                            : `Carregar mais (${hwList.length} de ${hw_total})`
                          }
                        </Button>
                      )}
                    </>
                  )}
                </div>

                {errors.hardware_ids && (
                  <InputError message={errors.hardware_ids} />
                )}
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
                {(editing && hasHardwareChanges)
                  ? (
                    <Button
                      type="button"
                      onClick={(e) => handleModalHardwareChange(e)}
                      tabIndex={5} disabled={processing}
                    >
                      {processing && <Spinner />}
                      Salvar
                    </Button>
                  )
                  : (
                    <Button type="submit" tabIndex={5} disabled={processing}>
                      {processing && <Spinner />}
                      Salvar
                    </Button>
                  )
                }
              </div>
            </>
          )}
        </Form>
      </div>

      <ModalSaveManufacturer
        isOpen={showSetupManufacturer}
        onClose={() => setShowSetupManufacturer(false)}
      />
    </AppLayout>
  );
}