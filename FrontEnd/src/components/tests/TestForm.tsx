"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createTestSchema, CreateTestType } from "@/validation/test.validation";
import { createTest, updateTest } from "@/action/test.action";
import {
  SampleType,
  ParameterType,
  EvaluationType,
  TEST_CATEGORIES,
} from "@/constants/test.enum";
import { TestI } from "@/interfaces/test.interface";
import ParameterFieldsetItem from "./ParameterFieldsetItem";

export default function TestForm({
  initialData,
  onSuccess,
}: {
  initialData?: TestI;
  onSuccess: () => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateTestType>({
    resolver: zodResolver(createTestSchema),
    mode: "all",
    defaultValues: initialData
      ? {
          nameAr: initialData.nameAr,
          medicalName: initialData.medicalName,
          code: initialData.code,
          category: initialData.category,
          price: initialData.price,
          sampleType: initialData.sampleType as SampleType,
          parameters: initialData.parameters.map((parameter) => ({
            name: parameter.name,
            type: parameter.type as ParameterType,
            unit: parameter.unit,
            options: parameter.options,
            referenceRanges: parameter.referenceRanges,
            evaluationLogic: parameter.evaluationLogic,
          })),
        }
      : {
          nameAr: "",
          medicalName: "",
          code: "",
          category: "",
          price: 0,
          sampleType: SampleType.BLOOD,
          parameters: [],
        },
  });

  const { control, handleSubmit, formState } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "parameters",
  });

  const onSubmit = async (data: CreateTestType) => {
    setIsLoading(true);

    try {
      if (initialData) {
        await updateTest(data, initialData._id);
        toast.success("تم تحديث التحليل بنجاح");
      } else {
        await createTest(data);
        toast.success("تم إضافة التحليل بنجاح");
      }

      router.refresh();
      onSuccess();
    } catch (error: any) {
      toast.error(error?.message || "حدث خطأ أثناء حفظ التحليل");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-4 pb-4 space-y-6 flex flex-col flex-1"
    >
      <FieldGroup className="gap-4">
        <Controller
          name="nameAr"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-[#20292A] font-medium text-sm">
                الاسم بالعربي
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="صورة الدم الكاملة"
                className="border-[#D9E1E0] focus-visible:border-[#5E9C91] focus-visible:ring-[#5E9C91]/20"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="medicalName"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-[#20292A] font-medium text-sm">
                الاسم الطبي
              </FieldLabel>
              <Input
                {...field}
                dir="ltr"
                aria-invalid={fieldState.invalid}
                placeholder="CBC"
                className="border-[#D9E1E0] focus-visible:border-[#5E9C91] focus-visible:ring-[#5E9C91]/20 text-left"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <Controller
            name="code"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-[#20292A] font-medium text-sm">
                  الكود
                </FieldLabel>
                <Input
                  {...field}
                  dir="ltr"
                  aria-invalid={fieldState.invalid}
                  placeholder="CBC"
                  className="border-[#D9E1E0] focus-visible:border-[#5E9C91] focus-visible:ring-[#5E9C91]/20 text-left"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="price"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-[#20292A] font-medium text-sm">
                  السعر (جنيه)
                </FieldLabel>
                <Input
                  type="number"
                  step="0.01"
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                    )
                  }
                  dir="ltr"
                  aria-invalid={fieldState.invalid}
                  className="border-[#D9E1E0] focus-visible:border-[#5E9C91] focus-visible:ring-[#5E9C91]/20 text-left"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Controller
            name="category"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-[#20292A] font-medium text-sm">
                  التصنيف
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={`w-full border-[#D9E1E0] ${
                      fieldState.invalid ? "border-red-400" : ""
                    }`}
                  >
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEST_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="sampleType"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel className="text-[#20292A] font-medium text-sm">
                  نوع العينة
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full border-[#D9E1E0]">
                    <SelectValue placeholder="اختر نوع العينة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SampleType.BLOOD}>دم</SelectItem>
                    <SelectItem value={SampleType.URINE}>بول</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#20292A]">الباراميترات</p>
          <button
            type="button"
            onClick={() =>
              append({
                name: "",
                type: ParameterType.NUMBER,
                unit: "",
                options: undefined,
                referenceRanges: undefined,
                evaluationLogic: { type: EvaluationType.RANGE },
              })
            }
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#263B3D] border border-[#263B3D] hover:bg-[#263B3D] hover:text-white transition-colors rounded-lg px-3 py-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            إضافة باراميتر
          </button>
        </div>

        {typeof formState.errors.parameters?.message === "string" && (
          <p className="text-xs text-red-500">
            {formState.errors.parameters.message}
          </p>
        )}

        {fields.length === 0 ? (
          <p className="text-xs text-[#687576] border border-dashed border-[#D9E1E0] rounded-lg px-4 py-6 text-center">
            لم تتم إضافة أي باراميتر بعد
          </p>
        ) : (
          <Accordion multiple className="space-y-2">
            {fields.map((fieldItem, index) => (
              <AccordionItem
                key={fieldItem.id}
                value={fieldItem.id}
                className="border border-[#D9E1E0] rounded-lg px-3"
              >
                <div className="flex items-center">
                  <AccordionTrigger className="flex-1 text-sm font-medium text-[#20292A]">
                    {form.watch(`parameters.${index}.name`) ||
                      `باراميتر ${index + 1}`}
                  </AccordionTrigger>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <AccordionContent>
                  <ParameterFieldsetItem form={form} index={index} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-auto inline-flex items-center justify-center gap-2 bg-[#263B3D] hover:bg-[#1E3032] text-white text-sm font-medium px-5 py-3 rounded-xl transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {initialData ? "حفظ التعديلات" : "إضافة التحليل"}
      </button>
    </form>
  );
}
