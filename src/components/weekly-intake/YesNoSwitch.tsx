
import React from "react";
import { Switch } from "@/components/ui/switch";

interface YesNoSwitchProps {
  id: string;
  label?: string;
  checked: boolean;
  onCheckedChange: () => void;
}

const YesNoSwitch = ({ id, label, checked, onCheckedChange }: YesNoSwitchProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-x-2">
        {label && <span>{label}</span>}
      </div>
      <div className="flex items-center space-x-2">
        <Switch 
          id={id} 
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
        <span>{checked ? "Yes" : "No"}</span>
      </div>
    </div>
  );
};

export default YesNoSwitch;
