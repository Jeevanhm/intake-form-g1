import React from "react";
import { Input } from "@/components/ui/input";
import FormSection, { Field, compactInput } from "./FormSection";
import YesNoSwitch from "./YesNoSwitch";

interface StorageNeedsSectionProps {
  formData: {
    azureType: string;
    azureVolume: string;
    storageOnPrem: boolean;
    onPremVolume: string;
  };
  handleInputChange: (field: string, value: string | number) => void;
  handleToggleChange: (field: string) => void;
}

const StorageNeedsSection = ({ formData, handleInputChange, handleToggleChange }: StorageNeedsSectionProps) => {
  return (
    <FormSection title="Storage Needs">
      <Field label="Azure Type:">
        <select
          value={formData.azureType}
          onChange={(e) => handleInputChange("azureType", e.target.value)}
          className="flex h-7 w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm transition-colors"
        >
          <option value="ANF">ANF</option>
          <option value="Blob">Blob</option>
          <option value="Managed Disk">Managed Disk</option>
        </select>
      </Field>

      <Field label="Azure Volume (GB):" nowrap>
        <Input
          className={compactInput}
          value={formData.azureVolume}
          onChange={(e) => handleInputChange("azureVolume", e.target.value)}
        />
      </Field>

      <YesNoSwitch
        id="storageOnPrem"
        label="On Prem:"
        checked={formData.storageOnPrem}
        onCheckedChange={() => handleToggleChange("storageOnPrem")}
      />

      <Field label="On Prem Volume (GB):" nowrap>
        <Input
          className={compactInput}
          value={formData.onPremVolume}
          onChange={(e) => handleInputChange("onPremVolume", e.target.value)}
        />
      </Field>
    </FormSection>
  );
};

export default StorageNeedsSection;
