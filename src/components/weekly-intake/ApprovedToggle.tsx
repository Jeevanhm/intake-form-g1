import React from "react";
import { Button } from "@/components/ui/button";

interface ApprovedToggleProps {
  value: string;
  onChange: (value: string) => void;
}

const OPTIONS = ["Yes", "No"];

const ApprovedToggle = ({ value, onChange }: ApprovedToggleProps) => {
  return (
    <div role="group" aria-label="Approved" className="flex items-center gap-1">
      <span className="text-xs font-medium">Approved:</span>
      {OPTIONS.map((option) => (
        <Button
          key={option}
          type="button"
          size="sm"
          variant={value === option ? "default" : "outline"}
          aria-pressed={value === option}
          className="h-7 px-3 text-xs"
          onClick={() => onChange(value === option ? "" : option)}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};

export default ApprovedToggle;
