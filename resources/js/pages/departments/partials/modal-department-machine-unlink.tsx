import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/default/dialog";
import { Department } from "../types/department";
import { MachineItem } from "../types/machine-item";
import { Form } from "@inertiajs/react";
import departmentMachines from "@/routes/department-machines";
import { Button } from "@/components/default/button";
import { Spinner } from "@/components/default/spinner";

type Props = {
  open: boolean,
  department: Department;
  machine: MachineItem | null;
  onClose: Function;
}

export function ModalDepartmentMachineUnlink({
  open,
  department,
  machine,
  onClose
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Desvincular máquina</DialogTitle>
          <DialogDescription>
            Remover{" "}
            <span className="text-foreground font-semibold">
              {machine?.name}
            </span>{" "}
            do departamento?
          </DialogDescription>
        </DialogHeader>
        <Form
          action={
            departmentMachines.destroy({
              department: department.id,
              machine: machine?.id ?? 0
            }).url
          }
          method="DELETE"
          onSuccess={() => onClose()}
        >
          {({ processing }) => (
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose()}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={processing}
              >
                {processing && <Spinner />}
                Desvincular
              </Button>
            </div>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  )
}