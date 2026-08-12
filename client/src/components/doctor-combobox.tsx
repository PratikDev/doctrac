"use client";

import type { PatientDoctorRefDTO } from "@doctrac/shared/types";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { useDoctorOptionsQuery } from "@/lib/queries/doctors";
import { cn } from "@/lib/utils";

function optionLabel(doctor: PatientDoctorRefDTO): string {
  return `${doctor.name} (${doctor.specialization})`;
}

export function DoctorCombobox({
  value,
  initialLabel,
  onSelect,
}: {
  value: string | undefined;
  initialLabel?: string;
  onSelect: (doctor: PatientDoctorRefDTO) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [label, setLabel] = useState(initialLabel);

  const debouncedSearch = useDebouncedValue(search, 300);
  const optionsQuery = useDoctorOptionsQuery(debouncedSearch);

  function handleSelect(doctor: PatientDoctorRefDTO) {
    setLabel(optionLabel(doctor));
    onSelect(doctor);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {label ?? "Select a doctor..."}
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search doctors..." value={search} onValueChange={setSearch} />
          <CommandList>
            {search.length === 0 ? (
              <div className="text-muted-foreground p-4 text-center text-sm">Type to search doctors...</div>
            ) : (
              <>
                <CommandEmpty>{optionsQuery.isFetching ? "Searching..." : "No doctors found."}</CommandEmpty>
                <CommandGroup>
                  {optionsQuery.data?.doctors.map((doctor) => (
                    <CommandItem key={doctor._id} value={doctor._id} onSelect={() => handleSelect(doctor)}>
                      <Check className={cn("size-4", value === doctor._id ? "opacity-100" : "opacity-0")} />
                      {optionLabel(doctor)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
