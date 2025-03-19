
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import FormSection from "./FormSection";
import YesNoSwitch from "./YesNoSwitch";

interface LocationSectionProps {
  formData: {
    azure: boolean;
    locationOnPrem: boolean;
    dataCenterLocation: string;
    locationPhysical: boolean;
    locationReasonForPhysical: string;
  };
  handleInputChange: (field: string, value: string | number) => void;
  handleToggleChange: (field: string) => void;
}

const LocationSection = ({ formData, handleInputChange, handleToggleChange }: LocationSectionProps) => {
  return (
    <FormSection title="Location">
      <YesNoSwitch 
        id="azure" 
        label="Azure:" 
        checked={formData.azure} 
        onCheckedChange={() => handleToggleChange("azure")} 
      />
      
      <YesNoSwitch 
        id="locationOnPrem" 
        label="On Prem:" 
        checked={formData.locationOnPrem} 
        onCheckedChange={() => handleToggleChange("locationOnPrem")} 
      />
      
      <div className="space-y-2">
        <Label htmlFor="dataCenterLocation">Data Center Location:</Label>
        <Input 
          id="dataCenterLocation" 
          value={formData.dataCenterLocation}
          onChange={(e) => handleInputChange("dataCenterLocation", e.target.value)}
        />
      </div>
      
      <YesNoSwitch 
        id="locationPhysical" 
        label="Physical:" 
        checked={formData.locationPhysical} 
        onCheckedChange={() => handleToggleChange("locationPhysical")} 
      />
      
      <div className="space-y-2">
        <Label htmlFor="locationReasonForPhysical">Reason for Physical:</Label>
        <Textarea 
          id="locationReasonForPhysical" 
          value={formData.locationReasonForPhysical}
          onChange={(e) => handleInputChange("locationReasonForPhysical", e.target.value)}
          className="min-h-[40px]"
        />
      </div>
    </FormSection>
  );
};

export default LocationSection;
