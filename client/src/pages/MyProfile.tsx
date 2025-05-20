import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Upload, Trash2, Loader2, Eye, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Validation schemas
const educationSchema = z.object({
  level: z.string().min(1, "Level is required"),
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  startYear: z.string().min(4, "Start year is required").max(4, "Invalid year"),
  endYear: z.string().min(4, "End year is required").max(4, "Invalid year"),
});

const profileSchema = z.object({
  bio: z.string().max(500, "Bio must be less than 500 characters"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  education: z.array(educationSchema),
});

interface Education {
  id?: string;
  level: string;
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  startYear: string;
  endYear: string;
  certificate?: File;
  certificateUrl?: string;
}

interface ProfileData {
  bio: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  education: Education[];
}

const MyProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    bio: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    education: [
      {
        id: '1',
        level: 'Primary',
        institution: '',
        startYear: '',
        endYear: '',
      },
      {
        id: '2',
        level: 'Secondary',
        institution: '',
        startYear: '',
        endYear: '',
      },
      {
        id: '3',
        level: 'Tertiary',
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startYear: '',
        endYear: '',
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewCertificate, setPreviewCertificate] = useState<{ url: string; name: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      const { bio, phoneNumber, address, city, state, country, education: educationData } = response.data;
      setProfileData(prev => ({
        ...prev,
        bio: bio || '',
        phoneNumber: phoneNumber || '',
        address: address || '',
        city: city || '',
        state: state || '',
        country: country || '',
        education: educationData || prev.education,
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleAddEducation = () => {
    setProfileData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          level: 'Additional',
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startYear: '',
          endYear: '',
        },
      ],
    }));
  };

  const handleRemoveEducation = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const handleEducationChange = (id: string, field: keyof Education, value: string) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`education.${id}.${field}`];
      return newErrors;
    });
  };

  const handleProfileChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleCertificateUpload = async (id: string, file: File) => {
    try {
      setUploading(id);
      const formData = new FormData();
      formData.append('certificate', file);

      const response = await axios.post(`/api/profile/certificate/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfileData(prev => ({
        ...prev,
        education: prev.education.map((edu) =>
          edu.id === id ? { ...edu, certificateUrl: response.data.certificateUrl } : edu
        ),
      }));

      toast.success('Certificate uploaded successfully');
    } catch (error) {
      console.error('Error uploading certificate:', error);
      toast.error('Failed to upload certificate');
    } finally {
      setUploading(null);
    }
  };

  const validateForm = () => {
    try {
      profileSchema.parse(profileData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      await axios.put('/api/profile', profileData);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewCertificate = (url: string, name: string) => {
    setPreviewCertificate({ url, name });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={user.name} disabled />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email} disabled />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                    placeholder="+234..."
                    className={errors.phoneNumber ? 'border-red-500' : ''}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => handleProfileChange('address', e.target.value)}
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profileData.city}
                    onChange={(e) => handleProfileChange('city', e.target.value)}
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profileData.state}
                    onChange={(e) => handleProfileChange('state', e.target.value)}
                    className={errors.state ? 'border-red-500' : ''}
                  />
                  {errors.state && (
                    <p className="text-sm text-red-500 mt-1">{errors.state}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={profileData.country}
                    onChange={(e) => handleProfileChange('country', e.target.value)}
                    className={errors.country ? 'border-red-500' : ''}
                  />
                  {errors.country && (
                    <p className="text-sm text-red-500 mt-1">{errors.country}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  className={`h-32 ${errors.bio ? 'border-red-500' : ''}`}
                />
                {errors.bio && (
                  <p className="text-sm text-red-500 mt-1">{errors.bio}</p>
                )}
              </div>
            </div>

            {/* Educational Information */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Educational Background</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddEducation}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>

              {profileData.education.map((edu) => (
                <Card key={edu.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{edu.level} Education</h4>
                      {edu.level === 'Additional' && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEducation(edu.id!)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                        <Input
                          id={`institution-${edu.id}`}
                          value={edu.institution}
                          onChange={(e) =>
                            handleEducationChange(edu.id!, 'institution', e.target.value)
                          }
                          className={errors[`education.${edu.id}.institution`] ? 'border-red-500' : ''}
                        />
                        {errors[`education.${edu.id}.institution`] && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors[`education.${edu.id}.institution`]}
                          </p>
                        )}
                      </div>

                      {(edu.level === 'Tertiary' || edu.level === 'Additional') && (
                        <>
                          <div>
                            <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                            <Input
                              id={`degree-${edu.id}`}
                              value={edu.degree}
                              onChange={(e) =>
                                handleEducationChange(edu.id!, 'degree', e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
                            <Input
                              id={`field-${edu.id}`}
                              value={edu.fieldOfStudy}
                              onChange={(e) =>
                                handleEducationChange(edu.id!, 'fieldOfStudy', e.target.value)
                              }
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <Label htmlFor={`start-${edu.id}`}>Start Year</Label>
                        <Input
                          id={`start-${edu.id}`}
                          type="number"
                          value={edu.startYear}
                          onChange={(e) =>
                            handleEducationChange(edu.id!, 'startYear', e.target.value)
                          }
                          className={errors[`education.${edu.id}.startYear`] ? 'border-red-500' : ''}
                        />
                        {errors[`education.${edu.id}.startYear`] && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors[`education.${edu.id}.startYear`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor={`end-${edu.id}`}>End Year</Label>
                        <Input
                          id={`end-${edu.id}`}
                          type="number"
                          value={edu.endYear}
                          onChange={(e) =>
                            handleEducationChange(edu.id!, 'endYear', e.target.value)
                          }
                          className={errors[`education.${edu.id}.endYear`] ? 'border-red-500' : ''}
                        />
                        {errors[`education.${edu.id}.endYear`] && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors[`education.${edu.id}.endYear`]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`certificate-${edu.id}`}>Certificate</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id={`certificate-${edu.id}`}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleCertificateUpload(edu.id!, file);
                            }
                          }}
                          disabled={uploading === edu.id}
                        />
                        {uploading === edu.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : edu.certificateUrl ? (
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreviewCertificate(edu.certificateUrl!, 'Certificate')}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Certificate
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Profile'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Certificate Preview Dialog */}
      <Dialog open={!!previewCertificate} onOpenChange={() => setPreviewCertificate(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewCertificate?.name}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[80vh]">
            {previewCertificate?.url.endsWith('.pdf') ? (
              <iframe
                src={previewCertificate.url}
                className="w-full h-full"
                title="Certificate Preview"
              />
            ) : (
              <img
                src={previewCertificate?.url}
                alt="Certificate Preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyProfile; 