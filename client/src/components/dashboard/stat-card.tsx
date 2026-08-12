import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const TONES = {
  primary: "bg-primary/10 text-primary",
  amber: "bg-[var(--chart-2)]/15 text-[var(--chart-2)]",
  violet: "bg-[var(--chart-3)]/15 text-[var(--chart-3)]",
} as const;

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  isLoading,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: keyof typeof TONES;
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", TONES[tone])}>
            <Icon className="size-4.5" />
          </span>
        </div>
        {isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-semibold">{value}</p>}
      </CardContent>
    </Card>
  );
}
