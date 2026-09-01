"use client";

import { ControllerRenderProps } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParameterI } from "@/interfaces/test.interface";
import { ParameterType } from "@/constants/test.enum";

export default function DynamicResultField({
  parameter,
  field,
  invalid,
}: {
  parameter: ParameterI;
  field: ControllerRenderProps<any, any>;
  invalid: boolean;
}) {
  if (
    parameter.type === ParameterType.SELECT ||
    parameter.type === ParameterType.POSITIVE_NEGATIVE
  ) {
    return (
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger
          className={`w-full border-[#D9E1E0] focus:border-[#5E9C91] ${
            invalid ? "border-red-400" : ""
          }`}
        >
          <SelectValue placeholder="اختر القيمة" />
        </SelectTrigger>
        <SelectContent>
          {parameter.options?.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  const isNumber = parameter.type === ParameterType.NUMBER;

  return (
    <Input
      {...field}
      type={isNumber ? "number" : "text"}
      step={isNumber ? "any" : undefined}
      aria-invalid={invalid}
      dir={isNumber ? "ltr" : undefined}
      className={`border-[#D9E1E0] focus-visible:border-[#5E9C91] focus-visible:ring-[#5E9C91]/20 ${
        isNumber ? "text-left" : ""
      } ${invalid ? "border-red-400 focus-visible:border-red-400" : ""}`}
    />
  );
}
