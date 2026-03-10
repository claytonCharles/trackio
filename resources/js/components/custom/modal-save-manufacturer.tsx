import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/default/dialog";
import { Button } from "@/components/default/button";
import { Input } from "@/components/default/input";
import InputError from "@/components/default/input-error";
import { Label } from "@/components/default/label";
import { Spinner } from "@/components/default/spinner";
import { Form } from "@inertiajs/react";
import manufacturer from "@/routes/manufacturer";


type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalSaveManufacturer({
  isOpen,
  onClose
}: ModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle>Cadastro de Fabricante</DialogTitle>
          <DialogDescription className="text-center">
            Cadastro simplificado de fabricante.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-5">
          <Form
            {...manufacturer.store.form()}
            onSuccess={() => onClose()}
            className="flex w-full flex-col gap-4"
          >
            {({ processing, errors }) => (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="manufacturer-name">Nome</Label>
                    <InputError message={errors.name} />
                  </div>
                  <Input
                    id="manufacturer-name"
                    name="name"
                    type="text"
                    required
                    autoFocus
                    placeholder="Nome do fabricante"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
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