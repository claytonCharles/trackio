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
import { RichTextEditor } from "@/components/rich-text-editor";
import AppLayout from "@/layouts/app-layout";
import hardwares from "@/routes/hardwares";
import { BreadcrumbItem } from "@/types";
import { Form, Head,} from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Hardwares",
    href: hardwares.index().url,
  },
  {
    title: "Create",
    href: hardwares.create().url,
  },
];

type HardwareCategory = {
  id: number;
  name: string;
};

type Props = {
  listCategories: HardwareCategory[];
};

export default function SaveHardware({ listCategories }: Props) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Hardwares Create" />
      <div className="mt-5 flex w-full flex-col items-center justify-center">
        <h2 className="text-foreground mb-6 text-center text-2xl font-bold">
          Formulário de Cadastro
        </h2>
        <Form
          {...hardwares.store.form()}
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
                      placeholder="Nome do Hardware"
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="category_id">Categoria</Label>
                      <InputError message={errors.category_id} />
                    </div>
                    <Select name="category_id">
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
                <div className="grid gap-2">
                  <Label htmlFor="serial_number">Tombamento</Label>
                  <Input
                    id="inventory_number"
                    type="text"
                    name="inventory_number"
                    tabIndex={1}
                    placeholder="Tombamento do Hardware"
                  />
                  <InputError message={errors.inventory_number} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="serial_number">Número de Serie</Label>
                  <Input
                    id="serial_number"
                    type="text"
                    name="serial_number"
                    tabIndex={1}
                    placeholder="Nome do Hardware"
                  />
                  <InputError message={errors.serial_number} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <RichTextEditor
                    name="description"
                    label="Conteúdo"
                    defaultValue={""}
                    placeholder="Escreva algo..."
                  />
                  <InputError message={errors.description} />
                </div>

                <Button
                  type="submit"
                  className="mt-4 w-full"
                  tabIndex={4}
                  disabled={processing}
                  data-test="login-button"
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
