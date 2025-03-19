
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormSection from "./FormSection";
import YesNoSwitch from "./YesNoSwitch";

interface AppNameSectionProps {
  formData: {
    appName: string;
    requestor: boolean;
    appOwner: string;
    l1Leadership: string;
    dateRequested: string;
    fundingAvailable: boolean;
    fundCode: string;
    cost: string;
  };
  handleInputChange: (field: string, value: string | number) => void;
  handleToggleChange: (field: string) => void;
}

const AppNameSection = ({ formData, handleInputChange, handleToggleChange }: AppNameSectionProps) => {
  return (
    <FormSection title="Application Name">
      <div className="space-y-2">
        <Input 
          placeholder="Application Name" 
          value={formData.appName}
          onChange={(e) => handleInputChange("appName", e.target.value)}
        />
      </div>
      
      <YesNoSwitch 
        id="requestor" 
        label="Requestor:" 
        checked={formData.requestor} 
        onCheckedChange={() => handleToggleChange("requestor")} 
      />
      
      <div className="space-y-2">
        <Label htmlFor="appOwner">App Owner:</Label>
        <Input 
          id="appOwner" 
          value={formData.appOwner}
          onChange={(e) => handleInputChange("appOwner", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="l1Leadership">L1 Leadership:</Label>
        <Input 
          id="l1Leadership" 
          value={formData.l1Leadership}
          onChange={(e) => handleInputChange("l1Leadership", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="dateRequested">Date requested for build:</Label>
        <Input 
          id="dateRequested" 
          placeholder="MM/YY"
          value={formData.dateRequested}
          onChange={(e) => handleInputChange("dateRequested", e.target.value)}
        />
      </div>
      
      <YesNoSwitch 
        id="fundingAvailable" 
        label="Funding Available:" 
        checked={formData.fundingAvailable} 
        onCheckedChange={() => handleToggleChange("fundingAvailable")}  
      />
      
      <div className="space-y-2">
        <Label htmlFor="fundCode">Fund Code or Project Name:</Label>
        <Input 
          id="fundCode" 
          value={formData.fundCode}
          onChange={(e) => handleInputChange("fundCode", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cost">Cost:</Label>
        <div className="flex items-center">
          <span className="mr-2">$</span>
          <Input 
            id="cost" 
            value={formData.cost}
            onChange={(e) => handleInputChange("cost", e.target.value)}
            placeholder="Enter cost"
          />
        </div>
      </div>
    </FormSection>
  );
};

export default AppNameSection;
