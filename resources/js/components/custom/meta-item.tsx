export function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="bg-muted/50 flex flex-col gap-0.5 rounded-lg px-3 py-2">
      <div className="text-muted-foreground flex items-center gap-1">
        {icon}
        <span>{label}</span>
      </div>
      <span className="truncate font-medium">{value ?? "—"}</span>
    </div>
  );
}