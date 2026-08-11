"use client";

import type { DoctorDTO } from "@doctrac/shared/types";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { createDoctorColumns } from "@/components/doctors/columns";
import { DoctorForm } from "@/components/doctors/doctor-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DateRangeFilter } from "@/components/filters/date-range-filter";
import { SearchInput } from "@/components/filters/search-input";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { useDeleteDoctorMutation, useDoctorsQuery } from "@/lib/queries/doctors";

export default function DoctorsPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const debouncedSearch = useDebouncedValue(search);
  const debouncedSpecialization = useDebouncedValue(specialization);

  const [createOpen, setCreateOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorDTO | null>(null);
  const [deletingDoctor, setDeletingDoctor] = useState<DoctorDTO | null>(null);

  const hasFilters = Boolean(search || specialization || dateRange?.from);

  const doctorsQuery = useDoctorsQuery({
    page: pageIndex + 1,
    search: debouncedSearch || undefined,
    specialization: debouncedSpecialization || undefined,
    startDate: dateRange?.from?.toISOString(),
    endDate: dateRange?.to?.toISOString(),
  });
  const deleteDoctor = useDeleteDoctorMutation();

  function resetToFirstPage() {
    setPageIndex(0);
  }

  function clearFilters() {
    setSearch("");
    setSpecialization("");
    setDateRange(undefined);
    resetToFirstPage();
  }

  const columns = createDoctorColumns({
    onEdit: setEditingDoctor,
    onDelete: setDeletingDoctor,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Doctors</h2>
        <Button onClick={() => setCreateOpen(true)}>Add Doctor</Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            resetToFirstPage();
          }}
          placeholder="Search doctors..."
        />
        <Input
          value={specialization}
          onChange={(e) => {
            setSpecialization(e.target.value);
            resetToFirstPage();
          }}
          placeholder="Specialization"
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
        data={doctorsQuery.data?.doctors ?? []}
        pageIndex={pageIndex}
        pageCount={doctorsQuery.data?.pagination.totalPages ?? 1}
        onPageChange={setPageIndex}
        isLoading={doctorsQuery.isPending}
        emptyMessage={hasFilters ? "No doctors match your filters." : "No doctors yet. Add one to get started."}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Doctor</DialogTitle>
          </DialogHeader>
          <DoctorForm onSuccess={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={editingDoctor !== null} onOpenChange={(open) => !open && setEditingDoctor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Doctor</DialogTitle>
          </DialogHeader>
          {editingDoctor && <DoctorForm doctor={editingDoctor} onSuccess={() => setEditingDoctor(null)} />}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deletingDoctor !== null}
        onOpenChange={(open) => !open && setDeletingDoctor(null)}
        title="Delete doctor?"
        description={`This will permanently delete ${deletingDoctor?.name ?? "this doctor"}. This can't be undone.`}
        isPending={deleteDoctor.isPending}
        onConfirm={() => {
          if (!deletingDoctor) return;
          deleteDoctor.mutate(deletingDoctor._id, {
            onSuccess: () => setDeletingDoctor(null),
          });
        }}
      />
    </div>
  );
}
