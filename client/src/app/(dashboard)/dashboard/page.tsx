"use client";

import { Stethoscope, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { PatientRegistrationsChart } from "@/components/dashboard/patient-registrations-chart";
import { PatientsPerDoctorChart } from "@/components/dashboard/patients-per-doctor-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStatsQuery } from "@/lib/queries/dashboard";

export default function DashboardPage() {
  const { data, isPending } = useDashboardStatsQuery();

  const totalDoctors = data?.totalDoctors ?? 0;
  const totalPatients = data?.totalPatients ?? 0;
  const avgPatientsPerDoctor = totalDoctors > 0 ? (totalPatients / totalDoctors).toFixed(1) : "0";

  const hasNoDoctors = !isPending && totalDoctors === 0;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Dashboard</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Doctors" value={String(totalDoctors)} icon={Stethoscope} isLoading={isPending} />
        <StatCard label="Total Patients" value={String(totalPatients)} icon={Users} isLoading={isPending} />
        <StatCard
          label="Avg. Patients / Doctor"
          value={avgPatientsPerDoctor}
          icon={TrendingUp}
          isLoading={isPending}
        />
      </div>

      {hasNoDoctors ? (
        <div className="flex flex-col items-start gap-2 rounded-md border border-dashed p-6">
          <p className="text-muted-foreground text-sm">Add your first doctor to see analytics here.</p>
          <Button asChild>
            <Link href="/doctors">Add your first doctor</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {isPending ? (
            <>
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-80 w-full" />
            </>
          ) : (
            data && (
              <>
                <PatientsPerDoctorChart data={data.patientsPerDoctor} />
                <PatientRegistrationsChart data={data.patientsByMonth} />
              </>
            )
          )}
        </div>
      )}
    </div>
  );
}
