import React from "react";
import FormSection from "./FormSection";
import YesNoSwitch from "./YesNoSwitch";

interface EnvironmentsSectionProps {
  formData: {
    envProd: boolean;
    envNonProd: boolean;
    envDR: boolean;
  };
  handleToggleChange: (field: string) => void;
}

const EnvironmentsSection = ({ formData, handleToggleChange }: EnvironmentsSectionProps) => {
  return (
    <FormSection title="Environments">
      <YesNoSwitch
        id="envProd"
        label="Prod:"
        checked={formData.envProd}
        onCheckedChange={() => handleToggleChange("envProd")}
      />

      <YesNoSwitch
        id="envNonProd"
        label="Non Prod:"
        checked={formData.envNonProd}
        onCheckedChange={() => handleToggleChange("envNonProd")}
      />

      <YesNoSwitch
        id="envDR"
        label="DR:"
        checked={formData.envDR}
        onCheckedChange={() => handleToggleChange("envDR")}
      />
    </FormSection>
  );
};

export default EnvironmentsSection;
