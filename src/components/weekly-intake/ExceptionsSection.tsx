import React from "react";
import { Textarea } from "@/components/ui/textarea";
import FormSection, { Field, compactTextarea } from "./FormSection";
import YesNoSwitch from "./YesNoSwitch";

interface ExceptionsSectionProps {
  formData: {
    backup: boolean;
    dr: boolean;
    physical: boolean;
    reasonForPhysical: string;
    onPrem: boolean;
    reasonForOnPrem: string;
  };
  handleInputChange: (field: string, value: string | number) => void;
  handleToggleChange: (field: string) => void;
}

const ExceptionsSection = ({ formData, handleInputChange, handleToggleChange }: ExceptionsSectionProps) => {
  return (
    <FormSection title="Exceptions">
      <YesNoSwitch
        id="backup"
        label="Backup"
        checked={formData.backup}
        onCheckedChange={() => handleToggleChange("backup")}
      />

      <YesNoSwitch
        id="dr"
        label="DR"
        checked={formData.dr}
        onCheckedChange={() => handleToggleChange("dr")}
      />

      <YesNoSwitch
        id="physical"
        label="Physical:"
        checked={formData.physical}
        onCheckedChange={() => handleToggleChange("physical")}
      />

      <Field label="Reason for Physical:" stacked>
        <Textarea
          rows={2}
          className={compactTextarea}
          value={formData.reasonForPhysical}
          onChange={(e) => handleInputChange("reasonForPhysical", e.target.value)}
        />
      </Field>

      <YesNoSwitch
        id="onPrem"
        label="On Prem:"
        checked={formData.onPrem}
        onCheckedChange={() => handleToggleChange("onPrem")}
      />

      <Field label="Reason for On Prem:" stacked>
        <Textarea
          rows={2}
          className={compactTextarea}
          value={formData.reasonForOnPrem}
          onChange={(e) => handleInputChange("reasonForOnPrem", e.target.value)}
        />
      </Field>
    </FormSection>
  );
};

export default ExceptionsSection;
