import { useState } from "react"
import { ActionTag } from "./action-tag"
import { Eye, MessageSquareIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/default/dialog";
import hardwares from "@/routes/hardwares";
import { Link } from "@inertiajs/react";
import machines from "@/routes/machines";

type Props = {
  hwId?: number;
  mnId?: number;
  title: string;
  date: string;
  userName: string;
  notes: string | null;
  action: 'attached' | 'detached' | 'moved';
}

export function CardMoveHistory({
  hwId,
  mnId,
  title,
  date,
  userName,
  notes,
  action,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 text-sm border p-2 rounded-md">
        <ActionTag action={action} />
        <div className="flex-1">
          <span>
            {title}
          </span>
          <p className="text-muted-foreground text-xs">
            {`${date} · por ${userName}`}
            {
              hwId && (
                <Link
                  href={hardwares.show(hwId)}
                  className={cn(
                    "border-muted-foreground/40 text-muted-foreground ml-2",
                    "inline-flex cursor-pointer items-center gap-1 rounded-md",
                    "border px-1.5 py-0.5 text-xs transition-colors",
                    "hover:border-current"
                  )}
                >
                  <Eye className="size-3 shrink-0" />
                  Ver Hardware
                </Link>
              )
            }
            {
              mnId && (
                <Link
                  href={machines.show(mnId)}
                  className={cn(
                    "border-muted-foreground/40 text-muted-foreground ml-2",
                    "inline-flex cursor-pointer items-center gap-1 rounded-md",
                    "border px-1.5 py-0.5 text-xs transition-colors",
                    "hover:border-current"
                  )}
                >
                  <Eye className="size-3 shrink-0" />
                  Ver Máquina
                </Link>
              )
            }
            {
              notes && (
                <span
                  onClick={() => setShow(true)}
                  className={cn(
                    "border-muted-foreground/40 text-muted-foreground ml-2",
                    "inline-flex cursor-help items-center gap-1 rounded-md",
                    "border px-1.5 py-0.5 text-xs transition-colors",
                    "hover:border-current cursor-pointer"
                  )}
                >
                  <MessageSquareIcon className="size-3 shrink-0" />
                  Observação
                </span>
              )
            }
          </p>
        </div>
      </div>
      <Dialog open={show} onOpenChange={(open) => !open && setShow(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex items-center justify-center">
            <DialogTitle>Observação</DialogTitle>
            <span className="h-px w-full bg-foreground"></span>
            <div className="text-center text-md">
              {notes}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}