"use client";

import type { PatientDTO } from "@doctrac/shared/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { DoctorForm } from "@/components/doctors/doctor-form";
import { createPatientColumns } from "@/components/patients/columns";
import { PatientForm } from "@/components/patients/patient-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteDoctorMutation, useDoctorQuery } from "@/lib/queries/doctors";
import { useDeletePatientFromDoctorMutation, useDoctorPatientsQuery } from "@/lib/queries/patients";
import { ApiError } from "@/lib/api-client";

export default function DoctorDetailPage() {
  const params = useParams<{ id: string }>();
  const doctorId = params.id;
  const router = useRouter();

  const [pageIndex, setPageIndex] = useState(0);
  const [editDoctorOpen, setEditDoctorOpen] = useState(false);
  const [deleteDoctorOpen, setDeleteDoctorOpen] = useState(false);
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientDTO | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<PatientDTO | null>(null);

  const doctorQuery = useDoctorQuery(doctorId);
  const patientsQuery = useDoctorPatientsQuery(doctorId, pageIndex + 1);
  const deleteDoctor = useDeleteDoctorMutation();
  const deletePatient = useDeletePatientFromDoctorMutation();

  const columns = createPatientColumns({
    onEdit: setEditingPatient,
    onDelete: setDeletingPatient,
  });

  if (doctorQuery.error instanceof ApiError && doctorQuery.error.status === 404) {
    return (
      <div className="flex flex-col items-start gap-2">
        <p className="text-muted-foreground text-sm">Doctor not found.</p>
        <Link href="/doctors" className="text-primary text-sm hover:underline">
          Back to Doctors
        </Link>
      </div>
    );
  }

  const doctor = doctorQuery.data;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link href="/doctors" className="text-muted-foreground text-sm hover:underline">
          Doctors
        </Link>
        <span className="text-muted-foreground text-sm"> / {doctor?.name ?? "..."}</span>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{doctorQuery.isPending ? <Skeleton className="h-5 w-40" /> : doctor?.name}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditDoctorOpen(true)} disabled={!doctor}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setDeleteDoctorOpen(true)} disabled={!doctor}>
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {doctorQuery.isPending ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          ) : (
            doctor && (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-muted-foreground">Specialization</dt>
                  <dd className="capitalize">{doctor.specialization}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Hospital</dt>
                  <dd>{doctor.hospital}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd>{doctor.phone}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>{doctor.email}</dd>
                </div>
              </dl>
            )
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Patients</h2>
        <Button onClick={() => setAddPatientOpen(true)} disabled={!doctor}>
          Add Patient
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={patientsQuery.data?.patients ?? []}
        pageIndex={pageIndex}
        pageCount={patientsQuery.data?.pagination.totalPages ?? 1}
        onPageChange={setPageIndex}
        isLoading={patientsQuery.isPending}
        emptyMessage="No patients yet. Add one to get started."
      />

      <Dialog open={editDoctorOpen} onOpenChange={setEditDoctorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Doctor</DialogTitle>
          </DialogHeader>
          {doctor && <DoctorForm doctor={doctor} onSuccess={() => setEditDoctorOpen(false)} />}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deleteDoctorOpen}
        onOpenChange={setDeleteDoctorOpen}
        title="Delete doctor?"
        description={`This will permanently delete ${doctor?.name ?? "this doctor"} and cannot be undone.`}
        isPending={deleteDoctor.isPending}
        onConfirm={() => {
          deleteDoctor.mutate(doctorId, {
            onSuccess: () => router.push("/doctors"),
          });
        }}
      />

      <Dialog open={addPatientOpen} onOpenChange={setAddPatientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Patient</DialogTitle>
          </DialogHeader>
          {doctor && <PatientForm fixedDoctor={doctor} onSuccess={() => setAddPatientOpen(false)} />}
        </DialogContent>
      </Dialog>

      <Dialog open={editingPatient !== null} onOpenChange={(open) => !open && setEditingPatient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          {editingPatient && doctor && (
            <PatientForm patient={editingPatient} fixedDoctor={doctor} onSuccess={() => setEditingPatient(null)} />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deletingPatient !== null}
        onOpenChange={(open) => !open && setDeletingPatient(null)}
        title="Delete patient?"
        description={`This will permanently delete ${deletingPatient?.name ?? "this patient"}. This can't be undone.`}
        isPending={deletePatient.isPending}
        onConfirm={() => {
          if (!deletingPatient) return;
          deletePatient.mutate(
            { doctorId, patientId: deletingPatient._id },
            { onSuccess: () => setDeletingPatient(null) }
          );
        }}
      />
    </div>
  );
}
