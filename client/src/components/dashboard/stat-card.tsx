import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCard({
  label,
  value,
  icon: Icon,
  isLoading,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">{label}</CardTitle>
        <Icon className="text-muted-foreground size-4" />
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-semibold">{value}</p>}
      </CardContent>
    </Card>
  );
}
