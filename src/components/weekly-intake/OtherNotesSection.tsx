
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import FormSection from "./FormSection";

interface OtherNotesSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const OtherNotesSection = ({ value, onChange }: OtherNotesSectionProps) => {
  return (
    <FormSection title="Other Notes">
      <Textarea 
        id="otherNotes" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[161px]"
      />
    </FormSection>
  );
};

export default OtherNotesSection;
