import React from "react";
import { Textarea } from "@/components/ui/textarea";
import FormSection, { Field, compactTextarea } from "./FormSection";
import YesNoSwitch from "./YesNoSwitch";

interface SupportNeedsSectionProps {
  formData: {
    cmsFullSupport: boolean;
    exceptionsToCMS: string;
  };
  handleInputChange: (field: string, value: string | number) => void;
  handleToggleChange: (field: string) => void;
}

const SupportNeedsSection = ({ formData, handleInputChange, handleToggleChange }: SupportNeedsSectionProps) => {
  return (
    <FormSection title="Support Needs">
      <YesNoSwitch
        id="cmsFullSupport"
        label="CMS Full Support:"
        checked={formData.cmsFullSupport}
        onCheckedChange={() => handleToggleChange("cmsFullSupport")}
      />

      <Field label="Exceptions to CMS Support:" stacked>
        <Textarea
          rows={3}
          className={compactTextarea}
          value={formData.exceptionsToCMS}
          onChange={(e) => handleInputChange("exceptionsToCMS", e.target.value)}
        />
      </Field>
    </FormSection>
  );
};

export default SupportNeedsSection;
