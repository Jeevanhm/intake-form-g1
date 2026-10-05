import React from "react";
import { Textarea } from "@/components/ui/textarea";
import FormSection, { Field, compactTextarea } from "./FormSection";
import YesNoSwitch from "./YesNoSwitch";

interface CloudAiServiceSectionProps {
  formData: {
    cloudService: boolean;
    aiService: boolean;
    cloudAiNotes: string;
  };
  handleInputChange: (field: string, value: string | number) => void;
  handleToggleChange: (field: string) => void;
}

const CloudAiServiceSection = ({ formData, handleInputChange, handleToggleChange }: CloudAiServiceSectionProps) => {
  return (
    <FormSection title="Cloud & AI Service">
      <YesNoSwitch
        id="cloudService"
        label="Cloud Service:"
        checked={formData.cloudService}
        onCheckedChange={() => handleToggleChange("cloudService")}
      />

      <YesNoSwitch
        id="aiService"
        label="AI Service:"
        checked={formData.aiService}
        onCheckedChange={() => handleToggleChange("aiService")}
      />

      <Field label="Notes:" stacked>
        <Textarea
          rows={2}
          className={compactTextarea}
          value={formData.cloudAiNotes}
          onChange={(e) => handleInputChange("cloudAiNotes", e.target.value)}
        />
      </Field>
    </FormSection>
  );
};

export default CloudAiServiceSection;
