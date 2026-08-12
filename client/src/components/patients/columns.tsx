"use client";

import type { PatientDTO } from "@doctrac/shared/types";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function createPatientColumns({
  onEdit,
  onDelete,
  showDoctorColumn = false,
}: {
  onEdit: (patient: PatientDTO) => void;
  onDelete: (patient: PatientDTO) => void;
  /** Off for a doctor-scoped list (M10) where every row is already the same doctor. */
  showDoctorColumn?: boolean;
}): ColumnDef<PatientDTO>[] {
  const columns: ColumnDef<PatientDTO>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    { accessorKey: "age", header: "Age" },
    { accessorKey: "gender", header: "Gender" },
    { accessorKey: "condition", header: "Condition" },
  ];

  if (showDoctorColumn) {
    columns.push({
      id: "doctor",
      header: "Doctor",
      cell: ({ row }) => {
        const { doctor } = row.original;
        return typeof doctor === "object" ? `${doctor.name} (${doctor.specialization})` : "-";
      },
    });
  }

  columns.push(
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "email", header: "Email" },
    {
      id: "actions",
      cell: ({ row }) => {
        const patient = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Open actions">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEdit(patient)}>Edit</DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={() => onDelete(patient)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }
  );

  return columns;
}
