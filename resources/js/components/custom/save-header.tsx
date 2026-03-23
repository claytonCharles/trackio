import { cn } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import { LucideIcon } from "lucide-react";

type SaveHeaderProps = {
  title: string;
  subTitle: string;
  identifier: {
    icon?: LucideIcon | null;
  }
}

export function SaveHeader({
  title,
  subTitle,
  identifier,
}: SaveHeaderProps) {
  return (
    <>
      <Head title={title} />
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "bg-muted flex size-10 shrink-0 items-center justify-center",
            "rounded-lg"
          )}
        >
          {
            identifier.icon && (
              <identifier.icon className="text-muted-foreground size-5" />
            )
          }
        </div>
        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm">
            {subTitle}
          </p>
        </div>
      </div>
    </>
  );
}