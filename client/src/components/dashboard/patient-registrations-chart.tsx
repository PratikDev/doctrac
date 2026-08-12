"use client";

import type { DashboardStatsDTO } from "@doctrac/shared/types";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "New patients",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  if (!year || !month) return value;
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function PatientRegistrationsChart({ data }: { data: DashboardStatsDTO["patientsByMonth"] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Registrations (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-80 w-full">
          <AreaChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tickFormatter={formatMonth} />
            <ChartTooltip content={<ChartTooltipContent labelFormatter={(value) => formatMonth(String(value))} />} />
            <Area
              type="monotone"
              dataKey="count"
              fill="var(--color-count)"
              fillOpacity={0.2}
              stroke="var(--color-count)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
