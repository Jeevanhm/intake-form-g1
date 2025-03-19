
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import FormSection from "./FormSection";
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
      
      <div className="space-y-2">
        <Label htmlFor="otherExplain">Other (explain):</Label>
        <Textarea 
          id="otherExplain" 
          value={formData.otherExplain}
          onChange={(e) => handleInputChange("otherExplain", e.target.value)}
          className="min-h-[100px]"
        />
      </div>
    </FormSection>
  );
};

export default DatabasePlatformsSection;
