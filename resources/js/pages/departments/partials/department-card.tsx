import { MetaItem } from "@/components/custom/meta-item";
import { Button } from "@/components/default/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/default/dropdown-menu";
import { cn } from "@/lib/utils";
import departments from "@/routes/departments";
import { Link, router } from "@inertiajs/react";
import {
  Building,
  Ellipsis,
  Eye,
  MapPinIcon,
  Pen,
  Server,
  Trash2Icon
} from "lucide-react";

export function DepartmentCard({
  department,
  onEditing,
}: {
  department: Department;
  onEditing: (department: Department) => void;
}) {
  function handleDelete() {
    if (!confirm("Tem certeza que deseja remover este departamento?")) return;
    router.delete(departments.destroy(department.id).url);
  }

  return (
    <div className={cn(
      "group relative flex flex-col gap-4 rounded-xl border bg-card p-5",
      "shadow-sm transition-shadow hover:shadow-md"
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className={cn(
            "bg-muted flex size-9 shrink-0 items-center",
            "justify-center rounded-lg"
          )}>
            <Building className="text-muted-foreground size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold leading-tight">
              {department.name}
            </p>
            <div className={cn(
              "text-muted-foreground mt-1 flex flex-wrap",
              "items-center gap-x-4 gap-y-1 text-sm"
            )}>
              <span className="flex items-center gap-1">
                <MapPinIcon className="size-3.5" />
                {department.location ?? 'Sem Localização'}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 opacity-60 group-hover:opacity-100"
            >
              <Ellipsis className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                className="flex items-center gap-2 cursor-pointer"
                href={departments.show(department.id).url}
              >
                <Eye className="size-4" /> Visualizar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <span
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => onEditing(department)}
              >
                <Pen className="size-4" />
                Editar
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" asChild>
              <span
                className="flex items-center gap-2 cursor-pointer"
                onClick={handleDelete}
              >
                <Trash2Icon className="mr-2 size-4" />
                Desativar
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <MetaItem
          icon={<Server className="size-3" />}
          label="Máquinas"
          value={String(department.department_machines_count ?? 0)}
        />
      </div>

      <div className="flex items-center justify-between border-t pt-3">
        <span></span>
        <Link
          href={departments.show(department.id).url}
          className={cn(
            "text-muted-foreground hover:text-foreground flex items-center",
            "gap-1 text-xs transition-colors"
          )}
        >
          Ver detalhes →
        </Link>
      </div>
    </div>
  );
}