
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const WeeklyIntakeForm = () => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "MM/dd/yyyy");
  
  // State for the week date
  const [weekDate, setWeekDate] = useState(formattedDate);

  // Form state
  const [formData, setFormData] = useState({
    // App Name section
    appName: "",
    requestor: false,
    appOwner: "",
    l1Leadership: "",
    dateRequested: "",
    fundingAvailable: false,
    fundCode: "",
    
    // Support Needs section
    cmsFullSupport: false,
    exceptionsToCMS: "",
    
    // Exceptions section
    backup: false,
    dr: false,
    physical: false,
    reasonForPhysical: "",
    onPrem: false,
    reasonForOnPrem: "",
    
    // Location section
    azure: false,
    locationOnPrem: false,
    dataCenterLocation: "1425/NY6/SunGard",
    locationPhysical: false,
    locationReasonForPhysical: "",
    
    // Database Platforms section
    sql: false,
    oracle: false,
    otherExplain: "",
    
    // Server Count section
    prodCount: 0,
    nonProdCount: 0,
    drCount: 0,
    
    // Environments section
    envProd: false,
    envNonProd: false,
    envDR: false,
    
    // Storage Needs section
    azureType: "ANF",
    azureVolume: "",
    storageOnPrem: false,
    onPremVolume: "",
    
    // Other Notes
    otherNotes: ""
  });

  const handleToggleChange = (field: string) => {
    setFormData({
      ...formData,
      [field]: !formData[field as keyof typeof formData]
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast.success("Weekly intake form submitted successfully!");
  };

  const renderYesNoSwitch = (field: string, label: string = "") => {
    return (
      <div className="flex items-center justify-between">
        <div className="space-x-2">
          {label && <span>{label}</span>}
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id={field} 
            checked={formData[field as keyof typeof formData] as boolean}
            onCheckedChange={() => handleToggleChange(field)}
          />
          <span>{formData[field as keyof typeof formData] ? "Yes" : "No"}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center flex-grow">Weekly Intake</h1>
        <Input 
          type="text"
          placeholder="MM/DD/YYYY"
          value={weekDate}
          onChange={(e) => setWeekDate(e.target.value)}
          className="w-32"
        />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Application Name Section */}
          <Card>
            <CardHeader className="bg-gray-200 py-2">
              <CardTitle className="text-center text-base font-medium">Application Name</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <Input 
                  placeholder="Application Name" 
                  value={formData.appName}
                  onChange={(e) => handleInputChange("appName", e.target.value)}
                />
              </div>
              
              {renderYesNoSwitch("requestor", "Requestor:")}
              
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
              
              {renderYesNoSwitch("fundingAvailable", "Funding Available:")}
              
              <div className="space-y-2">
                <Label htmlFor="fundCode">Fund Code or Project Name:</Label>
                <Input 
                  id="fundCode" 
                  value={formData.fundCode}
                  onChange={(e) => handleInputChange("fundCode", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Support Needs Section */}
          <Card>
            <CardHeader className="bg-gray-200 py-2">
              <CardTitle className="text-center text-base font-medium">Support Needs</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {renderYesNoSwitch("cmsFullSupport", "CMS Full Support:")}
              
              <div className="space-y-2">
                <Label htmlFor="exceptionsToCMS">Exceptions to CMS Support:</Label>
                <Textarea 
                  id="exceptionsToCMS" 
                  value={formData.exceptionsToCMS}
                  onChange={(e) => handleInputChange("exceptionsToCMS", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Exceptions Section */}
          <Card>
            <CardHeader className="bg-gray-200 py-2">
              <CardTitle className="text-center text-base font-medium">Exceptions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {renderYesNoSwitch("backup", "Backup")}
              {renderYesNoSwitch("dr", "DR")}
              {renderYesNoSwitch("physical", "Physical:")}
              
              <div className="space-y-2">
                <Label htmlFor="reasonForPhysical">Reason for Physical:</Label>
                <Textarea 
                  id="reasonForPhysical" 
                  value={formData.reasonForPhysical}
                  onChange={(e) => handleInputChange("reasonForPhysical", e.target.value)}
                  className="min-h-[40px]"
                />
              </div>
              
              {renderYesNoSwitch("onPrem", "On Prem:")}
              
              <div className="space-y-2">
                <Label htmlFor="reasonForOnPrem">Reason for On Prem:</Label>
                <Textarea 
                  id="reasonForOnPrem" 
                  value={formData.reasonForOnPrem}
                  onChange={(e) => handleInputChange("reasonForOnPrem", e.target.value)}
                  className="min-h-[40px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Section */}
          <Card>
            <CardHeader className="bg-gray-200 py-2">
              <CardTitle className="text-center text-base font-medium">Location</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {renderYesNoSwitch("azure", "Azure:")}
              {renderYesNoSwitch("locationOnPrem", "On Prem:")}
              
              <div className="space-y-2">
                <Label htmlFor="dataCenterLocation">Data Center Location:</Label>
                <Input 
                  id="dataCenterLocation" 
                  value={formData.dataCenterLocation}
                  onChange={(e) => handleInputChange("dataCenterLocation", e.target.value)}
                />
              </div>
              
              {renderYesNoSwitch("locationPhysical", "Physical:")}
              
              <div className="space-y-2">
                <Label htmlFor="locationReasonForPhysical">Reason for Physical:</Label>
                <Textarea 
                  id="locationReasonForPhysical" 
                  value={formData.locationReasonForPhysical}
                  onChange={(e) => handleInputChange("locationReasonForPhysical", e.target.value)}
                  className="min-h-[40px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Database Platforms Section */}
          <Card>
            <CardHeader className="bg-gray-200 py-2">
              <CardTitle className="text-center text-base font-medium">Database Platforms</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {renderYesNoSwitch("sql", "SQL:")}
              {renderYesNoSwitch("oracle", "Oracle:")}
              
              <div className="space-y-2">
                <Label htmlFor="otherExplain">Other (explain):</Label>
                <Textarea 
                  id="otherExplain" 
                  value={formData.otherExplain}
                  onChange={(e) => handleInputChange("otherExplain", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Other Notes Section */}
          <Card>
            <CardHeader className="bg-gray-200 py-2">
              <CardTitle className="text-center text-base font-medium">Other Notes</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Textarea 
                id="otherNotes" 
                value={formData.otherNotes}
                onChange={(e) => handleInputChange("otherNotes", e.target.value)}
                className="min-h-[161px]"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Server Count Section */}
          <Card>
            <CardHeader className="bg-gray-200 py-2">
              <CardTitle className="text-center text-base font-medium">Server Count</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
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
            </CardContent>
          </Card>

          {/* Environments Section */}
          <Card>
            <CardHeader className="bg-gray-200 py-2">
              <CardTitle className="text-center text-base font-medium">Environments</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {renderYesNoSwitch("envProd", "Prod:")}
              {renderYesNoSwitch("envNonProd", "Non Prod:")}
              {renderYesNoSwitch("envDR", "DR:")}
            </CardContent>
          </Card>

          {/* Storage Needs Section */}
          <Card>
            <CardHeader className="bg-gray-200 py-2">
              <CardTitle className="text-center text-base font-medium">Storage Needs</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="azureType">Azure Type:</Label>
                <div className="flex items-center space-x-2">
                  <select
                    id="azureType"
                    value={formData.azureType}
                    onChange={(e) => handleInputChange("azureType", e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  >
                    <option value="ANF">ANF</option>
                    <option value="Blob">Blob</option>
                    <option value="Managed Disk">Managed Disk</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="azureVolume">Azure Volume:</Label>
                <div className="flex items-center">
                  <span className="mr-2">GB</span>
                  <Input 
                    id="azureVolume" 
                    value={formData.azureVolume}
                    onChange={(e) => handleInputChange("azureVolume", e.target.value)}
                  />
                </div>
              </div>
              
              {renderYesNoSwitch("storageOnPrem", "On Prem:")}
              
              <div className="space-y-2">
                <Label htmlFor="onPremVolume">On Prem Volume:</Label>
                <div className="flex items-center">
                  <span className="mr-2">GB</span>
                  <Input 
                    id="onPremVolume" 
                    value={formData.onPremVolume}
                    onChange={(e) => handleInputChange("onPremVolume", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full md:w-1/3">
            Submit Weekly Intake
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WeeklyIntakeForm;
