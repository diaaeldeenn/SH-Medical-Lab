"use client";

import { useEffect } from "react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateTestType } from "@/validation/test.validation";
import { ParameterType, EvaluationType } from "@/constants/test.enum";
import { Gender } from "@/constants/user.enum";

const PARAMETER_TYPE_LABEL: Record<string, string> = {
  [ParameterType.NUMBER]: "رقم",
  [ParameterType.TEXT]: "نص",
  [ParameterType.SELECT]: "اختيار من قائمة",
  [ParameterType.POSITIVE_NEGATIVE]: "إيجابي / سلبي",
};

export default function ParameterFieldsetItem({
  form,
  index,
}: {
  form: UseFormReturn<CreateTestType>;
  index: number;
}) {
  const { control, watch, setValue, getValues, formState } = form;

  const type = watch(`parameters.${index}.type`);
  const evaluationType = watch(`parameters.${index}.evaluationLogic.type`);

  const { fields, append, remove } = useFieldArray({
    control,
    name: `parameters.${index}.referenceRanges`,
  });

  useEffect(() => {
    if (type === ParameterType.POSITIVE_NEGATIVE) {
      const current = getValues(`parameters.${index}.options`);
      if (!current || current.length === 0) {
        setValue(`parameters.${index}.options`, ["إيجابي", "سلبي"]);
      }
    }
  }, [type, index, getValues, setValue]);

  const referenceRangesError =
    formState.errors.parameters?.[index]?.referenceRanges?.message;

  return (
    <div className="space-y-4 pb-4">
      <div className="grid grid-cols-2 gap-3">
        <Controller
          name={`parameters.${index}.name`}
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-xs font-medium text-[#687576]">
                اسم الباراميتر
              </FieldLabel>
              <Input
                {...field}
                dir="ltr"
                placeholder="Hemoglobin"
                className="border-[#D9E1E0] text-sm"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name={`parameters.${index}.unit`}
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel className="text-xs font-medium text-[#687576]">
                الوحدة (اختياري)
              </FieldLabel>
              <Input
                {...field}
                dir="ltr"
                placeholder="g/dL"
                className="border-[#D9E1E0] text-sm"
              />
            </Field>
          )}
        />
      </div>

      <Controller
        name={`parameters.${index}.type`}
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel className="text-xs font-medium text-[#687576]">
              نوع الحقل
            </FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full border-[#D9E1E0] text-sm">
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ParameterType).map((value) => (
                  <SelectItem key={value} value={value}>
                    {PARAMETER_TYPE_LABEL[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
      />

      {(type === ParameterType.SELECT ||
        type === ParameterType.POSITIVE_NEGATIVE) && (
        <Controller
          name={`parameters.${index}.options`}
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-xs font-medium text-[#687576]">
                الخيارات (افصل بينها بفاصلة)
              </FieldLabel>
              <Input
                value={(field.value ?? []).join("، ")}
                onChange={(event) =>
                  field.onChange(
                    event.target.value
                      .split(/[،,]/)
                      .map((option) => option.trim())
                      .filter(Boolean),
                  )
                }
                placeholder="إيجابي، سلبي"
                className="border-[#D9E1E0] text-sm"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      )}

      {type === ParameterType.NUMBER && (
        <div className="space-y-3 border-t border-[#D9E1E0] pt-3">
          <Controller
            name={`parameters.${index}.evaluationLogic.type`}
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel className="text-xs font-medium text-[#687576]">
                  طريقة التقييم
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full border-[#D9E1E0] text-sm">
                    <SelectValue placeholder="اختر طريقة التقييم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EvaluationType.RANGE}>
                      مدى مرجعي (Reference Range)
                    </SelectItem>
                    <SelectItem value={EvaluationType.NORMAL_VALUES}>
                      قيم طبيعية محددة
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          {evaluationType === EvaluationType.NORMAL_VALUES && (
            <Controller
              name={`parameters.${index}.evaluationLogic.normalValues`}
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xs font-medium text-[#687576]">
                    القيم الطبيعية (افصل بينها بفاصلة)
                  </FieldLabel>
                  <Input
                    value={(field.value ?? []).join("، ")}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value
                          .split(/[،,]/)
                          .map((value) => value.trim())
                          .filter(Boolean),
                      )
                    }
                    placeholder="Negative"
                    className="border-[#D9E1E0] text-sm"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}

          {evaluationType === EvaluationType.RANGE && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-[#687576]">
                  المدى المرجعي
                </p>
                <button
                  type="button"
                  onClick={() =>
                    append({
                      gender: undefined,
                      minAge: undefined,
                      maxAge: undefined,
                      min: 0,
                      max: 0,
                    })
                  }
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#5E9C91] hover:text-[#4E887E]"
                >
                  <Plus className="w-3 h-3" />
                  إضافة مدى
                </button>
              </div>

              {typeof referenceRangesError === "string" && (
                <p className="text-[10px] text-red-500">
                  {referenceRangesError}
                </p>
              )}

              {fields.map((range, rangeIndex) => (
                <div
                  key={range.id}
                  className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end bg-[#F4F7F6] rounded-lg p-2"
                >
                  <Controller
                    name={`parameters.${index}.referenceRanges.${rangeIndex}.gender`}
                    control={control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel className="text-[10px] text-[#687576]">
                          الجنس
                        </FieldLabel>
                        <Select
                          value={field.value ?? "ANY"}
                          onValueChange={(value) =>
                            field.onChange(value === "ANY" ? undefined : value)
                          }
                        >
                          <SelectTrigger className="w-full border-[#D9E1E0] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ANY">الكل</SelectItem>
                            <SelectItem value={Gender.MALE}>ذكر</SelectItem>
                            <SelectItem value={Gender.FEMALE}>أنثى</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  />

                  <Controller
                    name={`parameters.${index}.referenceRanges.${rangeIndex}.minAge`}
                    control={control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel className="text-[10px] text-[#687576]">
                          أقل سن
                        </FieldLabel>
                        <Input
                          type="number"
                          value={field.value ?? ""}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value === ""
                                ? undefined
                                : Number(event.target.value),
                            )
                          }
                          dir="ltr"
                          className="border-[#D9E1E0] text-xs"
                        />
                      </Field>
                    )}
                  />

                  <Controller
                    name={`parameters.${index}.referenceRanges.${rangeIndex}.maxAge`}
                    control={control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel className="text-[10px] text-[#687576]">
                          أكبر سن
                        </FieldLabel>
                        <Input
                          type="number"
                          value={field.value ?? ""}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value === ""
                                ? undefined
                                : Number(event.target.value),
                            )
                          }
                          dir="ltr"
                          className="border-[#D9E1E0] text-xs"
                        />
                      </Field>
                    )}
                  />

                  <Controller
                    name={`parameters.${index}.referenceRanges.${rangeIndex}.min`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-[10px] text-[#687576]">
                          الحد الأدنى
                        </FieldLabel>
                        <Input
                          type="number"
                          step="any"
                          value={field.value ?? ""}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value === ""
                                ? undefined
                                : Number(event.target.value),
                            )
                          }
                          dir="ltr"
                          className="border-[#D9E1E0] text-xs"
                        />
                      </Field>
                    )}
                  />

                  <div className="flex items-end gap-1">
                    <Controller
                      name={`parameters.${index}.referenceRanges.${rangeIndex}.max`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field className="flex-1" data-invalid={fieldState.invalid}>
                          <FieldLabel className="text-[10px] text-[#687576]">
                            الحد الأقصى
                          </FieldLabel>
                          <Input
                            type="number"
                            step="any"
                            value={field.value ?? ""}
                            onChange={(event) =>
                              field.onChange(
                                event.target.value === ""
                                  ? undefined
                                  : Number(event.target.value),
                              )
                            }
                            dir="ltr"
                            className="border-[#D9E1E0] text-xs"
                          />
                        </Field>
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => remove(rangeIndex)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}