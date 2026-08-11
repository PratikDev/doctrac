"use client";

import { doctorInputSchema, type DoctorInput } from "@doctrac/shared/schemas/doctor";
import type { DoctorDTO } from "@doctrac/shared/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateDoctorMutation, useUpdateDoctorMutation } from "@/lib/queries/doctors";

const FIELDS: { name: keyof DoctorInput; label: string; type: string; className?: string }[] = [
  { name: "name", label: "Name", type: "text" },
  // Stored/matched lowercase (see shared/schemas/doctor.ts); capitalize is display-only.
  { name: "specialization", label: "Specialization", type: "text", className: "capitalize" },
  { name: "hospital", label: "Hospital", type: "text" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "email", label: "Email", type: "email" },
];

export function DoctorForm({ doctor, onSuccess }: { doctor?: DoctorDTO; onSuccess: () => void }) {
  const isEdit = Boolean(doctor);
  const createDoctor = useCreateDoctorMutation();
  const updateDoctor = useUpdateDoctorMutation();
  const isPending = createDoctor.isPending || updateDoctor.isPending;

  const form = useForm<DoctorInput>({
    resolver: zodResolver(doctorInputSchema),
    defaultValues: {
      name: doctor?.name ?? "",
      specialization: doctor?.specialization ?? "",
      hospital: doctor?.hospital ?? "",
      phone: doctor?.phone ?? "",
      email: doctor?.email ?? "",
    },
  });

  async function onSubmit(values: DoctorInput) {
    if (isEdit && doctor) {
      await updateDoctor.mutateAsync({ id: doctor._id, input: values });
    } else {
      await createDoctor.mutateAsync(values);
    }
    onSuccess();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {FIELDS.map(({ name, label, type, className }) => (
          <Controller
            key={name}
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type={type}
                  aria-invalid={fieldState.invalid}
                  className={className}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        ))}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : isEdit ? "Save changes" : "Add doctor"}
        </Button>
      </FieldGroup>
    </form>
  );
}
