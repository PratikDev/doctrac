"use client";

import type { DoctorDTO } from "@doctrac/shared/types";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function createDoctorColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (doctor: DoctorDTO) => void;
  onDelete: (doctor: DoctorDTO) => void;
}): ColumnDef<DoctorDTO>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Link href={`/doctors/${row.original._id}`} className="font-medium hover:underline">
          {row.original.name}
        </Link>
      ),
    },
    { accessorKey: "specialization", header: "Specialization" },
    { accessorKey: "hospital", header: "Hospital" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const doctor = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Open actions">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/doctors/${doctor._id}`}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onEdit(doctor)}>Edit</DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={() => onDelete(doctor)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
