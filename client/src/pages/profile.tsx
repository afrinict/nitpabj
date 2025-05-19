import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Profile as ProfileType, insertProfileSchema, Qualification, Employment, Publication } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { membershipGrades, statesList, getInitials, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Edit,
  Trash2,
  Plus,
  Upload,
  Loader2,
} from "lucide-react";

type ProfileFormValues = z.infer<typeof insertProfileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  
  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery<ProfileType>({
    queryKey: [`/api/profile/${user?.id}`],
    enabled: !!user,
  });
  
  // Fetch qualifications
  const { data: qualifications, isLoading: qualificationsLoading } = useQuery<Qualification[]>({
    queryKey: [`/api/qualifications/${user?.id}`],
    enabled: !!user,
  });
  
  // Fetch employment history
  const { data: employments, isLoading: employmentsLoading } = useQuery<Employment[]>({
    queryKey: [`/api/employment/${user?.id}`],
    enabled: !!user,
  });
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(insertProfileSchema),
    defaultValues: {
      userId: user?.id,
      phoneNumber: profile?.phoneNumber || "",
      address: profile?.address || "",
      dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "",
      gender: profile?.gender || undefined,
      nationality: profile?.nationality || "Nigerian",
      state: profile?.state || "",
      bio: profile?.bio || "",
      profilePicture: profile?.profilePicture || "",
      membershipGrade: profile?.membershipGrade || undefined,
      researchInterests: profile?.researchInterests || "",
    },
  });
  
  // Update values when profile data loads
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        userId: user?.id,
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "",
        gender: profile.gender || undefined,
        nationality: profile.nationality || "Nigerian",
        state: profile.state || "",
        bio: profile.bio || "",
        profilePicture: profile.profilePicture || "",
        membershipGrade: profile.membershipGrade || undefined,
        researchInterests: profile.researchInterests || "",
      });
    }
  }, [profile, user?.id, profileForm]);
  
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const res = await apiRequest("PUT", "/api/profile", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profile/${user?.id}`] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update profile",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="My Profile"
        description="View and manage your personal information and professional details."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1 border border-neutral-200 shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile?.profilePicture || ""} />
                <AvatarFallback className="bg-[#3D8361] text-white text-xl">
                  {getInitials(`${user?.firstName} ${user?.lastName}`)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-heading font-semibold">{user?.firstName} {user?.lastName}</h2>
              <p className="text-neutral-600">{user?.membershipNumber || "Membership pending"}</p>
              <Badge className="mt-2">{profile?.membershipGrade ? profile.membershipGrade.charAt(0).toUpperCase() + profile.membershipGrade.slice(1) : "Member"}</Badge>
              
              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-neutral-500" />
                  <span>{user?.email}</span>
                </div>
                {profile?.phoneNumber && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-neutral-500" />
                    <span>{profile.phoneNumber}</span>
                  </div>
                )}
                {profile?.address && (
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-neutral-500" />
                    <span>{profile.address}</span>
                  </div>
                )}
                {profile?.state && (
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-neutral-500" />
                    <span>{profile.state}, {profile.nationality}</span>
                  </div>
                )}
              </div>
              
              <div className="w-full mt-6">
                <h3 className="font-medium mb-2">About Me</h3>
                <p className="text-sm text-neutral-600">
                  {profile?.bio || "No bio information provided yet."}
                </p>
              </div>
              
              {profile?.researchInterests && (
                <div className="w-full mt-4">
                  <h3 className="font-medium mb-1">Research Interests</h3>
                  <p className="text-sm text-neutral-600">{profile.researchInterests}</p>
                </div>
              )}
              
              <Button 
                variant="outline" 
                className="mt-6 w-full"
                onClick={() => setActiveTab("personal")}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for Profile Management */}
        <div className="lg:col-span-2">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="career">Career</TabsTrigger>
            </TabsList>
            
            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profileLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin text-[#1E5631]" />
                    </div>
                  ) : (
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="nationality"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nationality</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nationality" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter your full address" 
                                  className="resize-none" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
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
                          control={profileForm.control}
                          name="membershipGrade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Membership Grade</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select membership grade" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {membershipGrades.map((grade) => (
                                    <SelectItem key={grade.value} value={grade.value}>
                                      {grade.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell us about yourself" 
                                  className="resize-none" 
                                  rows={4}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="researchInterests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Research Interests</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter your research interests (if applicable)" 
                                  className="resize-none" 
                                  rows={2}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div>
                          <FormLabel>Profile Picture</FormLabel>
                          <div className="flex items-center space-x-4 mt-1">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={profile?.profilePicture || ""} />
                              <AvatarFallback className="bg-[#3D8361] text-white">
                                {getInitials(`${user?.firstName} ${user?.lastName}`)}
                              </AvatarFallback>
                            </Avatar>
                            <Button variant="outline" type="button">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Photo
                            </Button>
                          </div>
                        </div>
                      </form>
                    </Form>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => profileForm.reset()}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={profileForm.handleSubmit(onSubmit)}
                    disabled={updateProfileMutation.isPending}
                    className="bg-[#1E5631] hover:bg-[#154525]"
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Education Tab */}
            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle>Educational Qualifications</CardTitle>
                  <CardDescription>
                    Manage your academic credentials and professional qualifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {qualificationsLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin text-[#1E5631]" />
                    </div>
                  ) : !qualifications || qualifications.length === 0 ? (
                    <div className="text-center py-8">
                      <GraduationCap className="h-12 w-12 mx-auto text-neutral-300" />
                      <p className="mt-2 text-neutral-600">No educational qualifications added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {qualifications.map((qualification) => (
                        <div 
                          key={qualification.id} 
                          className="border border-neutral-200 rounded-lg p-4 hover:bg-gray-50"
                        >
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{qualification.qualification}</h3>
                              <p className="text-sm text-neutral-600">{qualification.institution}</p>
                              <div className="flex items-center mt-1">
                                <Badge variant="outline" className="mr-2">
                                  {qualification.level === 'secondary' ? 'Secondary Education' : 'Higher Education'}
                                </Badge>
                                <span className="text-xs text-neutral-500">
                                  {qualification.yearObtained}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {qualification.certificate && (
                            <div className="mt-2 flex items-center">
                              <FileText className="h-4 w-4 text-neutral-500 mr-1" />
                              <span className="text-xs text-neutral-500">Certificate uploaded</span>
                              {qualification.isVerified && (
                                <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-[#1E5631] hover:bg-[#154525]">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Qualification
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Career Tab */}
            <TabsContent value="career">
              <Card>
                <CardHeader>
                  <CardTitle>Employment History</CardTitle>
                  <CardDescription>
                    Manage your professional experience and career history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {employmentsLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin text-[#1E5631]" />
                    </div>
                  ) : !employments || employments.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className="h-12 w-12 mx-auto text-neutral-300" />
                      <p className="mt-2 text-neutral-600">No employment history added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {employments.map((employment) => (
                        <div 
                          key={employment.id} 
                          className="border border-neutral-200 rounded-lg p-4 hover:bg-gray-50"
                        >
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{employment.position}</h3>
                              <p className="text-sm text-neutral-600">{employment.employer}</p>
                              <div className="flex items-center mt-1">
                                <span className="text-xs text-neutral-500">
                                  {formatDate(employment.startDate)} - {employment.endDate ? formatDate(employment.endDate) : 'Present'}
                                </span>
                                {employment.isCurrentEmployer && (
                                  <Badge className="ml-2 bg-blue-100 text-blue-800">
                                    Current
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {employment.responsibilities && (
                            <div className="mt-2">
                              <p className="text-sm text-neutral-600">{employment.responsibilities}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-[#1E5631] hover:bg-[#154525]">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employment
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${className || 'bg-[#D8E9A8] text-[#1E5631]'}`}>
      {children}
    </span>
  );
}
