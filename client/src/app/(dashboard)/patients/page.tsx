"use client";

import type { PatientDTO } from "@doctrac/shared/types";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { DateRangeFilter } from "@/components/filters/date-range-filter";
import { SearchInput } from "@/components/filters/search-input";
import { createPatientColumns } from "@/components/patients/columns";
import { PatientForm } from "@/components/patients/patient-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { useDeletePatientMutation, usePatientsQuery } from "@/lib/queries/patients";

export default function PatientsPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const debouncedSearch = useDebouncedValue(search);
  const debouncedCondition = useDebouncedValue(condition);

  const [createOpen, setCreateOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientDTO | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<PatientDTO | null>(null);

  const hasFilters = Boolean(search || condition || dateRange?.from);

  const patientsQuery = usePatientsQuery({
    page: pageIndex + 1,
    search: debouncedSearch || undefined,
    condition: debouncedCondition || undefined,
    startDate: dateRange?.from?.toISOString(),
    endDate: dateRange?.to?.toISOString(),
  });
  const deletePatient = useDeletePatientMutation();

  function resetToFirstPage() {
    setPageIndex(0);
  }

  function clearFilters() {
    setSearch("");
    setCondition("");
    setDateRange(undefined);
    resetToFirstPage();
  }

  const columns = createPatientColumns({
    onEdit: setEditingPatient,
    onDelete: setDeletingPatient,
    showDoctorColumn: true,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Patients</h2>
        <Button onClick={() => setCreateOpen(true)}>Add Patient</Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            resetToFirstPage();
          }}
          placeholder="Search patients..."
        />
        <Input
          value={condition}
          onChange={(e) => {
            setCondition(e.target.value);
            resetToFirstPage();
          }}
          placeholder="Condition"
          className="w-full max-w-xs"
        />
        <DateRangeFilter
          value={dateRange}
          onChange={(range) => {
            setDateRange(range);
            resetToFirstPage();
          }}
        />
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={patientsQuery.data?.patients ?? []}
        pageIndex={pageIndex}
        pageCount={patientsQuery.data?.pagination.totalPages ?? 1}
        onPageChange={setPageIndex}
        isLoading={patientsQuery.isPending}
        emptyMessage={hasFilters ? "No patients match your filters." : "No patients yet."}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Patient</DialogTitle>
          </DialogHeader>
          <PatientForm onSuccess={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={editingPatient !== null} onOpenChange={(open) => !open && setEditingPatient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          {editingPatient && <PatientForm patient={editingPatient} onSuccess={() => setEditingPatient(null)} />}
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
          deletePatient.mutate(deletingPatient._id, {
            onSuccess: () => setDeletingPatient(null),
          });
        }}
      />
    </div>
  );
}
