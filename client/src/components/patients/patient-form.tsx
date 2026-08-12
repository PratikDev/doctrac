"use client";

import {
  doctorIdSchema,
  GENDER_OPTIONS,
  patientInputSchema,
  type PatientUpdateInput,
} from "@doctrac/shared/schemas/patient";
import type { PatientDoctorRefDTO, PatientDTO } from "@doctrac/shared/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { DoctorCombobox } from "@/components/doctor-combobox";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAddPatientMutation, useUpdatePatientMutation } from "@/lib/queries/patients";

const patientFormSchema = patientInputSchema.extend({
  doctor: doctorIdSchema,
});
type PatientFormValues = z.infer<typeof patientFormSchema>;

function doctorRefFromPatient(patient?: PatientDTO): PatientDoctorRefDTO | undefined {
  return patient && typeof patient.doctor === "object" ? patient.doctor : undefined;
}

export function PatientForm({
  patient,
  fixedDoctor,
  onSuccess,
}: {
  /** Present => edit mode (PATCH), absent => add mode (nested POST). */
  patient?: PatientDTO;
  /** Known doctor to add under, e.g. from the doctor detail page. Hides the picker. */
  fixedDoctor?: PatientDoctorRefDTO;
  onSuccess: () => void;
}) {
  const isEdit = Boolean(patient);
  // fixedDoctor only hides the picker on *add* (implicit doctor, no choice
  // needed). Editing must always allow reassignment, even with a known doctor.
  const showDoctorPicker = isEdit || !fixedDoctor;
  const initialDoctor = fixedDoctor ?? doctorRefFromPatient(patient);

  const addPatient = useAddPatientMutation();
  const updatePatient = useUpdatePatientMutation();
  const isPending = addPatient.isPending || updatePatient.isPending;

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: patient?.name ?? "",
      age: patient?.age ?? 0,
      gender: patient?.gender ?? "Male",
      phone: patient?.phone ?? "",
      email: patient?.email ?? "",
      condition: patient?.condition ?? "",
      doctor: initialDoctor?._id ?? "",
    },
  });

  async function onSubmit(values: PatientFormValues) {
    const { doctor: doctorId, ...rest } = values;

    if (isEdit && patient) {
      const input: PatientUpdateInput = { ...rest, doctor: doctorId };
      await updatePatient.mutateAsync({ id: patient._id, input });
    } else {
      await addPatient.mutateAsync({ doctorId, input: rest });
    }
    onSuccess();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {showDoctorPicker && (
          <Controller
            name="doctor"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Doctor</FieldLabel>
                <DoctorCombobox
                  value={field.value}
                  initialLabel={initialDoctor ? `${initialDoctor.name} (${initialDoctor.specialization})` : undefined}
                  onSelect={(doctor) => field.onChange(doctor._id)}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        )}

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input {...field} id={field.name} type="text" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="age"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Age</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="number"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="gender"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Gender</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={field.name} className="w-full" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
              <Input {...field} id={field.name} type="tel" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input {...field} id={field.name} type="email" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="condition"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Condition</FieldLabel>
              <Textarea {...field} id={field.name} aria-invalid={fieldState.invalid} rows={3} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : isEdit ? "Save changes" : "Add patient"}
        </Button>
      </FieldGroup>
    </form>
  );
}
