import { Head } from "@inertiajs/react";
import { Button } from "@/components/default/button";
import { ArrowLeftIcon } from "lucide-react";
import useSafeBack from "@/hooks/use-safe-back";
import { ReactNode } from "react";

type ShowHeaderProps  = {
  title: string;
  created_user_name: string;
  created_date: string;
  fallback_url: string;
  children: ReactNode;
}

type ShowToolboxProps = {
    children: ReactNode;
};

export function ShowHeader({
  title,
  created_user_name,
  created_date,
  fallback_url,
  children,
}: ShowHeaderProps ) {
  return (
    <>
      <Head title={title} />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => useSafeBack(fallback_url)}
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
          <div>
            <h2 className="text-foreground text-2xl font-bold">
              {title}
            </h2>
            <p className="text-muted-foreground text-sm">
              <span className="mr-1">Criado por {created_user_name}</span>
              <span>em {created_date}</span>
            </p>
          </div>
        </div>
        { children }
      </div>
    </>
  )
}

export function ShowToolbox({ children }: ShowToolboxProps) {
    return <div className="flex gap-2">{children}</div>;
}