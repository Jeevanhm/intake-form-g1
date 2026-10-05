import React from "react";
import { Input } from "@/components/ui/input";
import FormSection, { Field, compactInput } from "./FormSection";
import YesNoSwitch from "./YesNoSwitch";

interface AppNameSectionProps {
  formData: {
    appName: string;
    requestor: string;
    appOwner: string;
    l1Leadership: string;
    appIdApm: string;
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
      <Input
        aria-label="Application Name"
        placeholder="Application Name"
        className={compactInput}
        value={formData.appName}
        onChange={(e) => handleInputChange("appName", e.target.value)}
      />

      <Field label="Requestor Name:">
        <Input
          className={compactInput}
          value={formData.requestor}
          onChange={(e) => handleInputChange("requestor", e.target.value)}
        />
      </Field>

      <Field label="App Owner:">
        <Input
          className={compactInput}
          value={formData.appOwner}
          onChange={(e) => handleInputChange("appOwner", e.target.value)}
        />
      </Field>

      <Field label="L1 Leadership:">
        <Input
          className={compactInput}
          value={formData.l1Leadership}
          onChange={(e) => handleInputChange("l1Leadership", e.target.value)}
        />
      </Field>

      <Field label="App ID/APM:">
        <Input
          className={compactInput}
          value={formData.appIdApm}
          onChange={(e) => handleInputChange("appIdApm", e.target.value)}
        />
      </Field>

      <Field label="Date requested for build:">
        <Input
          className={compactInput}
          placeholder="MM/YY"
          value={formData.dateRequested}
          onChange={(e) => handleInputChange("dateRequested", e.target.value)}
        />
      </Field>

      <YesNoSwitch
        id="fundingAvailable"
        label="Funding Available:"
        checked={formData.fundingAvailable}
        onCheckedChange={() => handleToggleChange("fundingAvailable")}
      />

      <Field label="Fund Code or Project Name:">
        <Input
          className={compactInput}
          value={formData.fundCode}
          onChange={(e) => handleInputChange("fundCode", e.target.value)}
        />
      </Field>

      <Field label="Cost ($):">
        <Input
          className={compactInput}
          value={formData.cost}
          onChange={(e) => handleInputChange("cost", e.target.value)}
          placeholder="Enter cost"
        />
      </Field>
    </FormSection>
  );
};

export default AppNameSection;
