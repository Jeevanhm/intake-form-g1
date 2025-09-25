import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { mapFormDataToSupabase } from "@/utils/formDataMapper";
import AppNameSection from "./weekly-intake/AppNameSection";
import SupportNeedsSection from "./weekly-intake/SupportNeedsSection";
import ExceptionsSection from "./weekly-intake/ExceptionsSection";
import LocationSection from "./weekly-intake/LocationSection";
import DatabasePlatformsSection from "./weekly-intake/DatabasePlatformsSection";
import OtherNotesSection from "./weekly-intake/OtherNotesSection";
import ServerCountSection from "./weekly-intake/ServerCountSection";
import EnvironmentsSection from "./weekly-intake/EnvironmentsSection";
import StorageNeedsSection from "./weekly-intake/StorageNeedsSection";

const WeeklyIntakeForm = () => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "MM/dd/yyyy");
  
  // State for the week date
  const [weekDate, setWeekDate] = useState(formattedDate);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    cost: "", 
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Map form data to Supabase schema
      const submissionData = mapFormDataToSupabase(formData, weekDate);
      
      const { data, error } = await supabase
        .from('weekly_intake_forms')
        .insert(submissionData)
        .select();
      
      if (error) {
        console.error("Error submitting form:", error);
        toast.error("Failed to submit weekly intake form. Please try again.");
      } else {
        console.log("Form submitted successfully:", data);
        toast.success("Weekly intake form submitted successfully!");
        
        // Reset form state if needed
        // Uncomment the following line if you want to reset the form after submission
        // setFormData({...}); // Reset to initial state
      }
    } catch (err) {
      console.error("Error in form submission:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          <AppNameSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleToggleChange={handleToggleChange} 
          />

          {/* Support Needs Section */}
          <SupportNeedsSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleToggleChange={handleToggleChange} 
          />

          {/* Exceptions Section */}
          <ExceptionsSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleToggleChange={handleToggleChange} 
          />

          {/* Location Section */}
          <LocationSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleToggleChange={handleToggleChange} 
          />

          {/* Database Platforms Section */}
          <DatabasePlatformsSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleToggleChange={handleToggleChange} 
          />

          {/* Other Notes Section */}
          <OtherNotesSection 
            value={formData.otherNotes} 
            onChange={(value) => handleInputChange("otherNotes", value)} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Server Count Section */}
          <ServerCountSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />

          {/* Environments Section */}
          <EnvironmentsSection 
            formData={formData} 
            handleToggleChange={handleToggleChange} 
          />

          {/* Storage Needs Section */}
          <StorageNeedsSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleToggleChange={handleToggleChange} 
          />
        </div>

        <div className="flex justify-center">
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 w-full md:w-1/3"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Weekly Intake"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WeeklyIntakeForm;
