
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const FormSection = ({ title, children, className }: FormSectionProps) => {
  return (
    <Card className={className}>
      <CardHeader className="bg-gray-200 py-2">
        <CardTitle className="text-center text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {children}
      </CardContent>
    </Card>
  );
};

export default FormSection;
