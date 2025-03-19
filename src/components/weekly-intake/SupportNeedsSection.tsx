
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import FormSection from "./FormSection";
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
      
      <div className="space-y-2">
        <Label htmlFor="exceptionsToCMS">Exceptions to CMS Support:</Label>
        <Textarea 
          id="exceptionsToCMS" 
          value={formData.exceptionsToCMS}
          onChange={(e) => handleInputChange("exceptionsToCMS", e.target.value)}
          className="min-h-[100px]"
        />
      </div>
    </FormSection>
  );
};

export default SupportNeedsSection;
