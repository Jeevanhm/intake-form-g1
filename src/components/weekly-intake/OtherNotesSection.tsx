import React from "react";
import { Textarea } from "@/components/ui/textarea";
import FormSection, { compactTextarea } from "./FormSection";

interface OtherNotesSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const OtherNotesSection = ({ value, onChange }: OtherNotesSectionProps) => {
  return (
    <FormSection title="Other Notes">
      <Textarea
        aria-label="Other Notes"
        rows={8}
                className={`${compactTextarea} min-h-[10rem]`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormSection>
  );
};

export default OtherNotesSection;
