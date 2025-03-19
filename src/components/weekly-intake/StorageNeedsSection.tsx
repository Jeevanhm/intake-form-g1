
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormSection from "./FormSection";
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
      <div className="space-y-2">
        <Label htmlFor="azureType">Azure Type:</Label>
        <div className="flex items-center space-x-2">
          <select
            id="azureType"
            value={formData.azureType}
            onChange={(e) => handleInputChange("azureType", e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
          >
            <option value="ANF">ANF</option>
            <option value="Blob">Blob</option>
            <option value="Managed Disk">Managed Disk</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="azureVolume">Azure Volume:</Label>
        <div className="flex items-center">
          <span className="mr-2">GB</span>
          <Input 
            id="azureVolume" 
            value={formData.azureVolume}
            onChange={(e) => handleInputChange("azureVolume", e.target.value)}
          />
        </div>
      </div>
      
      <YesNoSwitch 
        id="storageOnPrem" 
        label="On Prem:" 
        checked={formData.storageOnPrem} 
        onCheckedChange={() => handleToggleChange("storageOnPrem")} 
      />
      
      <div className="space-y-2">
        <Label htmlFor="onPremVolume">On Prem Volume:</Label>
        <div className="flex items-center">
          <span className="mr-2">GB</span>
          <Input 
            id="onPremVolume" 
            value={formData.onPremVolume}
            onChange={(e) => handleInputChange("onPremVolume", e.target.value)}
          />
        </div>
      </div>
    </FormSection>
  );
};

export default StorageNeedsSection;
