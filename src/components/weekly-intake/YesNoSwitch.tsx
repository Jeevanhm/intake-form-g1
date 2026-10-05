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
    <label className="flex items-center justify-between text-xs">
      <span>{label}</span>
      <span className="flex items-center gap-1.5">
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="h-4 w-8 [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-4"
        />
        <span className="w-6">{checked ? "Yes" : "No"}</span>
      </span>
    </label>
  );
};

export default YesNoSwitch;
