import { useState } from "react"
import { ActionTag } from "./action-tag"
import { MessageSquareIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/default/dialog";

type Props = {
  action: 'attached' | 'detached' | 'moved';
  title: string;
  date: string;
  userName: string;
  notes: string | null;
}

export function CardMoveHistory({
  action,
  title,
  date,
  userName,
  notes
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