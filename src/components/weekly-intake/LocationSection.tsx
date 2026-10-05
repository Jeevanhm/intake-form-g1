import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import FormSection, { Field, compactTextarea } from "./FormSection";
import YesNoSwitch from "./YesNoSwitch";

const DATA_CENTER_LOCATIONS = ["Azure EUS", "Azure USSC", "1425", "NY6", "SunGard", "Hicksville"];

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
  // Stored as a comma-separated string so it stays a single CSV column.
  const selectedLocations = formData.dataCenterLocation
    ? formData.dataCenterLocation.split(",").map((location) => location.trim()).filter(Boolean)
    : [];

  const toggleLocation = (location: string) => {
    const next = selectedLocations.includes(location)
      ? selectedLocations.filter((item) => item !== location)
      : DATA_CENTER_LOCATIONS.filter((item) => item === location || selectedLocations.includes(item));
    handleInputChange("dataCenterLocation", next.join(", "));
  };

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

      <Field label="Data Center Location:">
        <div className="flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              aria-label="Data Center Location"
              title={selectedLocations.join(", ")}
              className="h-7 !w-32 justify-between px-2 text-xs font-normal"
            >
              <span className="truncate">
                {selectedLocations.length === 0 ? "Select locations" : selectedLocations.join(", ")}
              </span>
              <ChevronDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44 space-y-1 p-2">
            {DATA_CENTER_LOCATIONS.map((location) => (
              <label key={location} className="flex cursor-pointer items-center gap-2 text-xs">
                <Checkbox
                  checked={selectedLocations.includes(location)}
                  onCheckedChange={() => toggleLocation(location)}
                />
                {location}
              </label>
            ))}
          </PopoverContent>
        </Popover>
        </div>
      </Field>

      <YesNoSwitch
        id="locationPhysical"
        label="Physical:"
        checked={formData.locationPhysical}
        onCheckedChange={() => handleToggleChange("locationPhysical")}
      />

      <Field label="Reason for Physical:" stacked>
        <Textarea
          rows={2}
          className={compactTextarea}
          value={formData.locationReasonForPhysical}
          onChange={(e) => handleInputChange("locationReasonForPhysical", e.target.value)}
        />
      </Field>
    </FormSection>
  );
};

export default LocationSection;
