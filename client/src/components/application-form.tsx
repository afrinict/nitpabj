import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertApplicationSchema } from "@shared/schema";
import { statesList, projectTypes } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, FileText, Leaf } from "lucide-react";

type ApplicationFormValues = z.infer<typeof insertApplicationSchema>;

interface ApplicationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ApplicationForm({ onSuccess, onCancel }: ApplicationFormProps) {
  const { toast } = useToast();
  const [applicationType, setApplicationType] = useState<"sar" | "eiar" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(insertApplicationSchema),
    defaultValues: {
      type: undefined,
      projectName: "",
      projectType: "",
      state: "",
      lga: "",
      address: "",
      documents: {},
      additionalInfo: {}
    }
  });

  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/applications", data);
      
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
        variant: "success",
      });
      
      // Invalidate applications query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/applications/user"] });
      
      if (onSuccess) {
        onSuccess();
      }
      
      form.reset();
      setApplicationType(null);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeSelection = (type: "sar" | "eiar") => {
    setApplicationType(type);
    form.setValue("type", type);
  };

  const calculateFees = () => {
    const type = form.watch("type");
    
    if (type === "sar") {
      return {
        application: 50000,
        processing: 5000,
        total: 55000
      };
    } else if (type === "eiar") {
      return {
        application: 75000,
        processing: 7500,
        total: 82500
      };
    }
    
    return {
      application: 0,
      processing: 0,
      total: 0
    };
  };

  const fees = calculateFees();

  return (
    <div className="space-y-6">
      {!applicationType ? (
        <>
          <h3 className="font-medium text-lg mb-2">Select Application Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className="border border-neutral-300 rounded-lg p-4 cursor-pointer hover:border-[#1E5631] hover:bg-green-50 transition-colors"
              onClick={() => handleTypeSelection("sar")}
            >
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-[#1E5631] text-white">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Site Analysis Report (SAR)</h4>
                  <p className="text-sm text-neutral-600">For urban development site assessment</p>
                </div>
              </div>
            </div>
            <div 
              className="border border-neutral-300 rounded-lg p-4 cursor-pointer hover:border-[#3D8361] hover:bg-green-50 transition-colors"
              onClick={() => handleTypeSelection("eiar")}
            >
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-[#3D8361] text-white">
                  <Leaf className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Ecological Impact Assessment Report (EIAR)</h4>
                  <p className="text-sm text-neutral-600">Environmental impact evaluation</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h3 className="font-medium text-lg border-b pb-2">
              {applicationType === "sar" 
                ? "Site Analysis Report (SAR) Application" 
                : "Ecological Impact Assessment Report (EIAR) Application"}
            </h3>
            
            {/* Project Information */}
            <div>
              <h4 className="font-medium mb-2">Project Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projectTypes.map((type) => (
                            <SelectItem key={type} value={type.toLowerCase()}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Location Information */}
            <div>
              <h4 className="font-medium mb-2">Location Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statesList.map((state) => (
                            <SelectItem key={state} value={state.toLowerCase()}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lga"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local Government Area</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter LGA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter full site address" 
                            className="resize-none" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            {/* EIAR Specific Fields */}
            {applicationType === "eiar" && (
              <div>
                <h4 className="font-medium mb-2">Environmental Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="additionalInfo.landArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Land Area (in hectares)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter land area" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="additionalInfo.vegetationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vegetation Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vegetation type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="forest">Forest</SelectItem>
                            <SelectItem value="savanna">Savanna</SelectItem>
                            <SelectItem value="grassland">Grassland</SelectItem>
                            <SelectItem value="wetland">Wetland</SelectItem>
                            <SelectItem value="mangrove">Mangrove</SelectItem>
                            <SelectItem value="urban">Urban</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="additionalInfo.ecologicalDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brief Ecological Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the ecological characteristics of the site" 
                              className="resize-none" 
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Document Upload */}
            <div>
              <h4 className="font-medium mb-2">Required Documents</h4>
              <div className="space-y-4">
                {applicationType === "sar" ? (
                  <>
                    <div className="border border-neutral-300 rounded-md p-4">
                      <FormLabel className="font-medium mb-2 block">Site Plan</FormLabel>
                      <FormDescription className="text-xs text-neutral-500 mb-2">
                        Upload a detailed site plan (PDF, PNG, JPG up to 10MB)
                      </FormDescription>
                      <Input type="file" className="cursor-pointer" />
                    </div>
                    <div className="border border-neutral-300 rounded-md p-4">
                      <FormLabel className="font-medium mb-2 block">Title Document / Deed of Assignment</FormLabel>
                      <FormDescription className="text-xs text-neutral-500 mb-2">
                        Upload title document (PDF up to 10MB)
                      </FormDescription>
                      <Input type="file" className="cursor-pointer" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="border border-neutral-300 rounded-md p-4">
                      <FormLabel className="font-medium mb-2 block">Project Proposal</FormLabel>
                      <FormDescription className="text-xs text-neutral-500 mb-2">
                        Upload project proposal document (PDF up to 10MB)
                      </FormDescription>
                      <Input type="file" className="cursor-pointer" />
                    </div>
                    <div className="border border-neutral-300 rounded-md p-4">
                      <FormLabel className="font-medium mb-2 block">Site Images</FormLabel>
                      <FormDescription className="text-xs text-neutral-500 mb-2">
                        Upload site images (JPG, PNG up to 5MB each, max 5 files)
                      </FormDescription>
                      <Input type="file" multiple className="cursor-pointer" />
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Payment Information */}
            <div>
              <h4 className="font-medium mb-2">Payment Information</h4>
              <div className="p-4 bg-neutral-100 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-700">Application Fee:</span>
                  <span className="font-medium">₦{fees.application.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-700">Processing Fee:</span>
                  <span className="font-medium">₦{fees.processing.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-neutral-700 font-medium">Total Amount:</span>
                  <span className="font-bold text-lg">₦{fees.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (onCancel) {
                    onCancel();
                  } else {
                    setApplicationType(null);
                    form.reset();
                  }
                }}
                className="mr-3"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                className="mr-3"
              >
                Save as Draft
              </Button>
              <Button 
                type="submit"
                className="bg-[#1E5631] hover:bg-[#154525]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Proceed to Payment
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
