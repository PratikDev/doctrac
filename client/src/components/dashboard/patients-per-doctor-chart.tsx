"use client";

import type { DashboardStatsDTO } from "@doctrac/shared/types";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Patients",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function truncateName(name: string, max = 14): string {
  return name.length > max ? `${name.slice(0, max - 1)}…` : name;
}

export function PatientsPerDoctorChart({ data }: { data: DashboardStatsDTO["patientsPerDoctor"] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patients per Doctor</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-80 w-full">
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="doctorName"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value: string) => truncateName(value)}
              angle={-35}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
