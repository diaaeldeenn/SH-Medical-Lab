"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { Loader2, Save } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { TestI } from "@/interfaces/test.interface";
import { ParameterType } from "@/constants/test.enum";
import { createResult } from "@/action/result.action";
import { CreateResultType } from "@/validation/result.validation";
import DynamicResultField from "./DynamicResultField";

interface FormValues {
  values: Record<string, string>;
  note: string;
}

export default function TestResultForm({
  requestId,
  testId,
  schema,
  onSuccess,
}: {
  requestId: string;
  testId: string;
  schema: TestI;
  onSuccess: () => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      values: Object.fromEntries(schema.parameters.map((p) => [p.name, ""])),
      note: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const parameters = schema.parameters.map((parameter) => {
      const raw = data.values[parameter.name];
      const value = parameter.type === ParameterType.NUMBER ? Number(raw) : raw;
      return { parameter: parameter.name, value };
    });

    const payload: CreateResultType = {
      parameters,
      note: data.note || undefined,
    };

    setIsLoading(true);
    try {
      await createResult(payload, requestId, testId);
      toast.success("تم حفظ النتيجة واعتمادها");
      router.refresh();
      onSuccess();
    } catch (error: any) {
      toast.error(error?.message || "فشل حفظ النتيجة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="px-4 pb-4 space-y-4 flex flex-col flex-1"
    >
      <FieldGroup className="gap-4">
        {schema.parameters.map((parameter) => (
          <Controller
            key={parameter.name}
            name={`values.${parameter.name}` as any}
            control={form.control}
            rules={{ required: "هذا الحقل مطلوب" }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-[#20292A] font-medium text-sm">
                  {parameter.name}
                  {parameter.unit && (
                    <span className="text-[#687576] text-xs font-normal mr-1">
                      ({parameter.unit})
                    </span>
                  )}
                </FieldLabel>
                <DynamicResultField
                  parameter={parameter}
                  field={field}
                  invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        ))}

        <Controller
          name="note"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel className="text-[#20292A] font-medium text-sm">
                ملاحظات
                <span className="text-[#687576] text-xs font-normal mr-1">
                  (اختياري)
                </span>
              </FieldLabel>
              <Textarea
                {...field}
                placeholder="أضف ملاحظة على النتيجة إن وجدت"
                className="border-[#D9E1E0] focus-visible:border-[#5E9C91] focus-visible:ring-[#5E9C91]/20"
              />
            </Field>
          )}
        />
      </FieldGroup>

      <button
        type="submit"
        disabled={isLoading || !form.formState.isValid}
        className="mt-auto inline-flex items-center justify-center gap-2 bg-[#263B3D] hover:bg-[#1E3032] text-white text-sm font-medium px-5 py-3 rounded-xl transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        حفظ النتيجة واعتمادها
      </button>
    </form>
  );
}
