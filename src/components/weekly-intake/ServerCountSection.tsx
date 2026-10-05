import React from "react";
import { Input } from "@/components/ui/input";
import FormSection, { compactInput } from "./FormSection";

interface ServerCountSectionProps {
  formData: {
    prodCount: number;
    nonProdCount: number;
    drCount: number;
  };
  handleInputChange: (field: string, value: number) => void;
}

const counts = [
  { field: "prodCount", label: "Prod" },
  { field: "nonProdCount", label: "Non Prod" },
  { field: "drCount", label: "DR" },
] as const;

const ServerCountSection = ({ formData, handleInputChange }: ServerCountSectionProps) => {
  return (
    <FormSection title="Server Count">
      <div className="grid grid-cols-3 gap-2">
        {counts.map(({ field, label }) => (
          <label key={field} className="flex flex-col gap-1 text-xs">
            <span>{label}:</span>
            <Input
              type="number"
              min={0}
              value={formData[field]}
              onChange={(e) => handleInputChange(field, Number(e.target.value))}
              className={`${compactInput} text-right`}
            />
          </label>
        ))}
      </div>
    </FormSection>
  );
};

export default ServerCountSection;
