import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection = ({ title, children, className }: FormSectionProps) => {
  return (
    <Card className={className}>
      <CardHeader className="bg-blue-600 px-3 py-1">
        <CardTitle className="text-center text-sm font-medium text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 p-3">{children}</CardContent>
    </Card>
  );
};

interface FieldProps {
  label: string;
  children: React.ReactNode;
  stacked?: boolean;
  nowrap?: boolean;
}

// The wrapping label ties the text to its control without needing unique ids,
// which matters because every application on the page renders the same fields.
export const Field = ({ label, children, stacked = false, nowrap = false }: FieldProps) => (
  <label className={cn("flex gap-2 text-xs", stacked ? "flex-col" : "items-center")}>
    <span className={cn(!stacked && (nowrap ? "shrink-0 whitespace-nowrap" : "w-24 shrink-0 leading-tight"))}>{label}</span>
    <span className="min-w-0 flex-1 [&>*]:w-full">{children}</span>
  </label>
);

export const compactInput = "h-7 px-2 py-1 text-xs md:text-xs";
export const compactTextarea = "min-h-0 px-2 py-1 text-xs";

export default FormSection;
