import React from "react";
import { Textarea } from "@/components/ui/textarea";
import FormSection, { Field, compactTextarea } from "./FormSection";
import YesNoSwitch from "./YesNoSwitch";

interface DatabasePlatformsSectionProps {
  formData: {
    sql: boolean;
    oracle: boolean;
    otherExplain: string;
  };
  handleInputChange: (field: string, value: string | number) => void;
  handleToggleChange: (field: string) => void;
}

const DatabasePlatformsSection = ({ formData, handleInputChange, handleToggleChange }: DatabasePlatformsSectionProps) => {
  return (
    <FormSection title="Database Platforms">
      <YesNoSwitch
        id="sql"
        label="SQL:"
        checked={formData.sql}
        onCheckedChange={() => handleToggleChange("sql")}
      />

      <YesNoSwitch
        id="oracle"
        label="Oracle:"
        checked={formData.oracle}
        onCheckedChange={() => handleToggleChange("oracle")}
      />

      <Field label="Other (explain):" stacked>
        <Textarea
          rows={2}
          className={compactTextarea}
          value={formData.otherExplain}
          onChange={(e) => handleInputChange("otherExplain", e.target.value)}
        />
      </Field>
    </FormSection>
  );
};

export default DatabasePlatformsSection;
