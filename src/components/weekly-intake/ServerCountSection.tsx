
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormSection from "./FormSection";

interface ServerCountSectionProps {
  formData: {
    prodCount: number;
    nonProdCount: number;
    drCount: number;
  };
  handleInputChange: (field: string, value: number) => void;
}

const ServerCountSection = ({ formData, handleInputChange }: ServerCountSectionProps) => {
  return (
    <FormSection title="Server Count">
      <div className="flex items-center justify-between">
        <Label htmlFor="prodCount">Prod:</Label>
        <Input 
          id="prodCount" 
          type="number"
          value={formData.prodCount}
          onChange={(e) => handleInputChange("prodCount", Number(e.target.value))}
          className="w-16 text-right"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="nonProdCount">Non Prod:</Label>
        <Input 
          id="nonProdCount" 
          type="number"
          value={formData.nonProdCount}
          onChange={(e) => handleInputChange("nonProdCount", Number(e.target.value))}
          className="w-16 text-right"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="drCount">DR:</Label>
        <Input 
          id="drCount" 
          type="number"
          value={formData.drCount}
          onChange={(e) => handleInputChange("drCount", Number(e.target.value))}
          className="w-16 text-right"
        />
      </div>
    </FormSection>
  );
};

export default ServerCountSection;
