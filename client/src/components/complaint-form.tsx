import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertComplaintSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type ComplaintFormValues = z.infer<typeof insertComplaintSchema>;

interface ComplaintFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ComplaintForm({ onSuccess, onCancel }: ComplaintFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complaintType, setComplaintType] = useState<string>("");

  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(insertComplaintSchema),
    defaultValues: {
      subject: "",
      details: "",
    }
  });

  const onSubmit = async (data: ComplaintFormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/complaints", data);
      
      toast({
        title: "Complaint submitted",
        description: "Your complaint has been submitted successfully and will be reviewed by the ethics committee.",
        variant: "success",
      });
      
      // Invalidate complaints query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/complaints/user"] });
      
      if (onSuccess) {
        onSuccess();
      }
      
      form.reset();
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

  const handleComplaintTypeChange = (value: string) => {
    setComplaintType(value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Complaint Type</h3>
            <RadioGroup 
              defaultValue={complaintType} 
              onValueChange={handleComplaintTypeChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="organization" id="organization" />
                <Label htmlFor="organization">Against the Organization</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="member" id="member" />
                <Label htmlFor="member">Against a Member</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="executive" id="executive" />
                <Label htmlFor="executive">Against an Executive</Label>
              </div>
            </RadioGroup>
          </div>

          {!user && (
            <>
              <FormField
                control={form.control}
                name="nonMemberName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name (Optional for non-members)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nonMemberEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormDescription>
                      We'll use this to follow up on your complaint.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nonMemberPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          
          {complaintType === "member" && (
            <FormField
              control={form.control}
              name="respondentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member ID (if known)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter member ID number" type="number" {...field} 
                      onChange={(e) => {
                        const value = e.target.value === "" ? undefined : parseInt(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    If you don't know the member ID, please provide details in the complaint.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Brief title of your complaint" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Details</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide a detailed description of your complaint" 
                    className="min-h-[150px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Please include all relevant information, such as dates, locations, and individuals involved.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div>
            <FormLabel>Supporting Documents (Optional)</FormLabel>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-neutral-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-neutral-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#3D8361] hover:text-[#2F6649]"
                  >
                    <span>Upload files</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-neutral-500">
                  PNG, JPG, PDF up to 10MB each
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-[#1E5631] hover:bg-[#154525]"
            disabled={isSubmitting || !complaintType}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Submit Complaint
          </Button>
        </div>
      </form>
    </Form>
  );
}
