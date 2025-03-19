
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import FormSection from "./FormSection";
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
      
      <div className="space-y-2">
        <Label htmlFor="reasonForPhysical">Reason for Physical:</Label>
        <Textarea 
          id="reasonForPhysical" 
          value={formData.reasonForPhysical}
          onChange={(e) => handleInputChange("reasonForPhysical", e.target.value)}
          className="min-h-[40px]"
        />
      </div>
      
      <YesNoSwitch 
        id="onPrem" 
        label="On Prem:" 
        checked={formData.onPrem} 
        onCheckedChange={() => handleToggleChange("onPrem")} 
      />
      
      <div className="space-y-2">
        <Label htmlFor="reasonForOnPrem">Reason for On Prem:</Label>
        <Textarea 
          id="reasonForOnPrem" 
          value={formData.reasonForOnPrem}
          onChange={(e) => handleInputChange("reasonForOnPrem", e.target.value)}
          className="min-h-[40px]"
        />
      </div>
    </FormSection>
  );
};

export default ExceptionsSection;
