import { Button } from "@/components/default/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/default/dialog";
import { Input } from "@/components/default/input";
import InputError from "@/components/default/input-error";
import { Label } from "@/components/default/label";
import { Spinner } from "@/components/default/spinner";
import { cn } from "@/lib/utils";
import departments from "@/routes/departments";
import { Form } from "@inertiajs/react";

type Props = {
  open: boolean,
  department: Department | null;
  onClose: Function
}

export function ModalDepartmentSave({
  open,
  department,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {department ? "Editar Departamento" : "Novo Departamento"}
          </DialogTitle>
        </DialogHeader>

        <Form
          action={department
            ? departments.update(department.id).url
            : departments.store().url}
          method={department ? "PUT" : "POST"}
          onSuccess={() => onClose()}
        >
          {({ processing, errors }) => (
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={department?.name ?? ""}
                    placeholder="Ex: TI, RH, Financeiro..."
                  />
                  <InputError message={errors.name} />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={department?.location ?? ""}
                    placeholder="Ex: Bloco A, 2º andar"
                  />
                  <InputError message={errors.location} />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    defaultValue={department?.description ?? ""}
                    placeholder="Descrição opcional..."
                    className={cn(
                      "border-input bg-background ring-offset-background",
                      "placeholder:text-muted-foreground focus:ring-ring flex",
                      "w-full rounded-md border px-3 py-2 text-sm",
                      "focus:outline-none focus:ring-2 focus:ring-offset-2"
                    )}
                  />
                  <InputError message={errors.description} />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onClose()}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing && <Spinner />}
                  {department ? "Salvar alterações" : "Criar departamento"}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  )
}